import test from "node:test";
import assert from "node:assert/strict";
import { converse } from "../core/conversation.js";
import { orchestrate } from "../core/orchestration.js";
import { classifyComplexity } from "../core/complexity.js";
import { assessWakeTranscript } from "../architecture/voice.js";

test("a spoken greeting receives a real reply without waiting on the model", async () => {
  const answer = await converse({ run: () => { throw Error("AI should not run for this greeting"); } }, "Hey Nyx. How are you?", {});
  assert.match(answer.text, /ready to talk/);
  assert.equal(answer.modelUsed, false);
});

test("a failed model gives a candid answer and conversation has time to finish", async () => {
  assert.ok(classifyComplexity("Please help me plan dinner").budgetMs >= 10000);
  const response = await orchestrate({ ai: { run: async () => { throw Error("provider unavailable"); } }, message: "Please help me plan dinner", memories: [], conversation: [], authorization: {} });
  assert.equal(response.type, "conversation_unavailable");
  assert.match(response.answer, /I heard you/);
  assert.equal(response.modelUsed, false);
});

test("empty first model response is retried before degrading", async () => {
  let calls=0;
  const response = await converse({ run: async () => { calls++; return calls===1 ? { response:"" } : { response:"Second try worked." }; } }, "Tell me something useful.", {});
  assert.equal(response.text, "Second try worked.");
  assert.equal(calls, 2);
});

test("Nyxthea can describe herself without model dependency", async () => {
  const response = await converse({ run: async () => { throw Error("model should not run"); } }, "Can you tell me a little bit about you and what all you can do?", {});
  assert.match(response.text, /voice-first personal and household assistant/i);
  assert.equal(response.modelUsed, false);
});

test("Nyx is the only wake word and accepts natural requests", () => {
  const result=assessWakeTranscript({transcript:"Nyx I was wondering if you could help with dinner",confidence:.8});
  assert.equal(result.recognized,true);
  assert.equal(result.safeToRespond,true);
  assert.ok(result.request.length>0);
  for (const transcript of ["Nixie this thing is acting weird", "NyxThea remind me later"]) {
    const ignored=assessWakeTranscript({transcript,confidence:.99,authorizedNicknames:["Nixie","NyxThea"]});
    assert.equal(ignored.recognized,false);
    assert.equal(ignored.safeToRespond,false);
  }
});

test("wake word alone can engage listening without inventing a request", () => {
  const result=assessWakeTranscript({transcript:"Nyx",confidence:.8});
  assert.equal(result.recognized,true);
  assert.equal(result.safeToRespond,true);
  assert.equal(result.request,"");
});

test("low-confidence or unaddressed speech stays quiet", () => {
  assert.equal(assessWakeTranscript({transcript:"Nyx tell me the weather",confidence:.3}).safeToRespond,false);
  assert.equal(assessWakeTranscript({transcript:"tell me the weather",confidence:.99}).recognized,false);
});

test('voice and text use the same saved personality with distinct style modes', async () => {
  const {converseFast,conversationPersonality}=await import('../core/conversation.js');
  for(const converseMode of [converse,converseFast]) {
    let prompt='';
    const ai={run:async(_model,input)=>{prompt=JSON.stringify(input.messages);return {response:'Let’s sort it out.'}}};
    await converseMode(ai,'Help me organize my afternoon.',{}, {communicationStyle:'natural'});
    assert.match(prompt,/dry humor, playful sarcasm/i);
    await converseMode(ai,'Help me organize my afternoon.',{}, {communicationStyle:'professional'});
    assert.match(prompt,/Keep sarcasm and teasing off/);
    assert.doesNotMatch(prompt,/Natural mode:/);
    await converseMode(ai,'Help me organize my afternoon.',{}, {communicationStyle:'unfiltered'});
    assert.match(prompt,/a little bite/);
  }
  const child=conversationPersonality({communicationStyle:'unfiltered',role:'child'});
  assert.match(child,/age-appropriate/);
  assert.doesNotMatch(child,/Unfiltered mode:/);
});

test('a timed-out primary model falls back without losing adult personality', async () => {
  const {converseFast}=await import('../core/conversation.js');
  for(const fn of [converse,converseFast]){
    const calls=[];
    const result=await fn({run:async(model,input)=>{calls.push({model,input});if(calls.length===1)throw Object.assign(Error('timeout'),{status:504});return {choices:[{message:{content:'That coffee has officially betrayed you.'}}]};}},'My coffee is cold.',{conversation:[{role:'assistant',text:"I heard you, but I couldn't finish that reply right now. Please try again in a moment."},{role:'user',text:'My coffee is cold.'}]},{communicationStyle:'unfiltered',role:'adult'});
    assert.equal(result.fallbackUsed,true);assert.notEqual(calls[0].model,calls[1].model);
    assert.match(calls[1].input.messages[0].content,/strong swear words/);
    assert.equal(calls[1].input.messages.filter(x=>x.role==='user').length,1);
    assert.ok(!JSON.stringify(calls[1].input.messages).includes("couldn't finish"));
  }
});

test('child model requests cannot inherit adult language from an unfiltered preference', async()=>{
  let request;
  await converse({run:async(_model,input)=>{request=input;return {response:'Let’s figure it out.'}}},'Make a joke.',{}, {communicationStyle:'unfiltered',role:'child'});
  assert.match(request.messages[0].content,/free of profanity or sexual innuendo/);
  assert.doesNotMatch(request.messages[0].content,/Adult language is opted in/);
});


test('daily account quota is reported honestly and does not retry the same exhausted allowance', async()=>{
  let calls=0;
  const response=await orchestrate({ai:{run:async()=>{calls++;throw Error('AiError: you have used up your daily free allocation of 10,000 neurons, please upgrade to Cloudflare Workers Paid plan');}},message:'Will you marry me?',memories:[],conversation:[],authorization:{}});
  assert.equal(calls,1);
  assert.equal(response.errorCode,'ai_daily_allowance_exhausted');
  assert.match(response.answer,/daily AI allowance is used up/);
  assert.doesNotMatch(response.answer,/try again in a moment/i);
});
