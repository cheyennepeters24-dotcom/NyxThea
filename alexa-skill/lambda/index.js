// Paste this into the Alexa-hosted skill's lambda/index.js after account linking is configured.
const Alexa = require('ask-sdk-core');
const NYX_URL = 'https://nyxthea.cheyenne-peters24.workers.dev/api/alexa/chat';

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
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 6200);
      let response;
      try {
        response = await fetch(NYX_URL, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` }, body: JSON.stringify({ message }), signal: controller.signal });
      } finally { clearTimeout(timer); }
      if (response.status === 401) return linkAccount(input);
      if (!response.ok) throw new Error(`NyxThea returned ${response.status}`);
      const body = await response.json();
      const answer = String(body.answer || 'I could not finish that answer. Please ask me again.').slice(0, 750);
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
