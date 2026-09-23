// Paste this into the Alexa-hosted skill's lambda/index.js after account linking is configured.
const Alexa = require('ask-sdk-core');
const https = require('https');
const NYX_URL = 'https://nyxthea.cheyenne-peters24.workers.dev/api/alexa/chat';

function askNyx(token, message) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({ message });
    const request = https.request(NYX_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'content-length': Buffer.byteLength(payload),
        authorization: `Bearer ${token}`
      },
      timeout: 6200
    }, response => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', chunk => {
        body += chunk;
        if (body.length > 16000) request.destroy(new Error('NyxThea response too large'));
      });
      response.on('end', () => {
        try { resolve({ status: response.statusCode, body: JSON.parse(body) }); }
        catch (error) { reject(error); }
      });
      response.on('error', reject);
    });
    request.on('timeout', () => request.destroy(new Error('NyxThea timed out')));
    request.on('error', reject);
    request.end(payload);
  });
}

function linkAccount(handlerInput) {
  return handlerInput.responseBuilder
    .speak('To use NyxThea on this Echo, please link your NyxThea profile in the Alexa app.')
    .withLinkAccountCard()
    .getResponse();
}

const LaunchHandler = {
  canHandle: input => Alexa.getRequestType(input.requestEnvelope) === 'LaunchRequest',
  handle(input) {
    if (!input.requestEnvelope.context.System.user.accessToken) return linkAccount(input);
    return input.responseBuilder.speak('NyxThea is here. What would you like to talk about? You can say, ask, followed by your question.')
      .reprompt('What would you like to ask?').getResponse();
  }
};

const TalkHandler = {
  canHandle: input => Alexa.getRequestType(input.requestEnvelope) === 'IntentRequest' && Alexa.getIntentName(input.requestEnvelope) === 'TalkIntent',
  async handle(input) {
    const token = input.requestEnvelope.context.System.user.accessToken;
    if (!token) return linkAccount(input);
    const message = Alexa.getSlotValue(input.requestEnvelope, 'question');
    if (!message) return input.responseBuilder.speak('What would you like to ask me?').reprompt('Say ask, then your question.').getResponse();
    try {
      const response = await askNyx(token, message);
      if (response.status === 401) return linkAccount(input);
      if (response.status < 200 || response.status >= 300) throw new Error(`NyxThea returned ${response.status}`);
      const answer = String(response.body.answer || 'I could not finish that answer. Please ask me again.').slice(0, 750);
      return input.responseBuilder.speak(answer).reprompt('I am here if you have another question.').getResponse();
    } catch (error) {
      console.error('NyxThea request failed:', error.message);
      return input.responseBuilder.speak('I am having trouble reaching NyxThea right now. Please try again in a moment.')
        .reprompt('Would you like to ask something else?').getResponse();
    }
  }
};

const HelpHandler = {
  canHandle: input => Alexa.getRequestType(input.requestEnvelope) === 'IntentRequest' && Alexa.getIntentName(input.requestEnvelope) === 'AMAZON.HelpIntent',
  handle: input => input.responseBuilder.speak('Say ask, followed by what you would like to tell NyxThea.')
    .reprompt('What would you like to ask?').getResponse()
};

const StopHandler = {
  canHandle: input => Alexa.getRequestType(input.requestEnvelope) === 'IntentRequest' && ['AMAZON.StopIntent', 'AMAZON.CancelIntent'].includes(Alexa.getIntentName(input.requestEnvelope)),
  handle: input => input.responseBuilder.speak('Talk soon.').getResponse()
};

const FallbackHandler = {
  canHandle: input => Alexa.getRequestType(input.requestEnvelope) === 'IntentRequest' && Alexa.getIntentName(input.requestEnvelope) === 'AMAZON.FallbackIntent',
  handle: input => input.responseBuilder.speak('I missed that. Please say ask, then your question.')
    .reprompt('What would you like to ask?').getResponse()
};

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(LaunchHandler, TalkHandler, HelpHandler, StopHandler, FallbackHandler)
  .addErrorHandlers({ canHandle: () => true, handle: (input, error) => {
    console.error(error);
    return input.responseBuilder.speak('Something went wrong. Please try again.').getResponse();
  } })
  .lambda();
