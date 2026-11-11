import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
const html=fs.readFileSync(new URL('../../public/index.html',import.meta.url),'utf8');
const between=(start,end)=>html.slice(html.indexOf(start),html.indexOf(end,html.indexOf(start)));
const method=(start,end,context)=>vm.runInNewContext('({'+between(start,end).trim().replace(/,$/,'')+'})',context);
function dom(){const nodes=new Map();return {getElementById(id){if(!nodes.has(id))nodes.set(id,{hidden:true,value:'',textContent:'',innerHTML:'',focus(){},classList:{remove(){}}});return nodes.get(id)}}}
test('device identity works with blocked storage and without randomUUID',()=>{
 const context={localStorage:{getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}},crypto:{getRandomValues(bytes){bytes.fill(15);return bytes}},Uint8Array};
 const source=between('let nyxSessionDeviceId=null;','async function registerThisDevice');
 const ids=vm.runInNewContext(source+';[nyxDeviceId(),nyxDeviceId()]',context);
 assert.equal(ids[0],ids[1]);assert.equal(ids[0].length,32);
});
test('typed answer remains usable while a voice prompt never finishes',async()=>{
 const document=dom();let stopped=0;
 const experience=method(' async sayAndListen(',' async onboard(',{document,esc:String,NYXVoice:{stopSpeech(){stopped++}},clearTimeout,setTimeout,navigator:{},window:{}});
 experience.state=()=>{};experience.prompt=()=>new Promise(()=>{});
 const answer=experience.sayAndListen('How should I pronounce your name?',{requireTap:true});
 document.getElementById('nyxTypeInstead').onclick();
 assert.equal(document.getElementById('nyxVoiceTyped').hidden,false);
 document.getElementById('nyxVoiceTyped').value='shy-ANN';
 document.getElementById('nyxVoiceTypedSubmit').onclick();
 assert.equal(await answer,'shy-ANN');assert.ok(stopped>=1);
});
test('an old prompt timeout cannot cancel a newer voice prompt',async()=>{
 let token=0,stopped=0,rejectTimeout;
 const voice={get speechToken(){return token},say(){token++;return new Promise(()=>{})},stopSpeech(){stopped++}};
 const experience=method(' async prompt(text)', '\n onboardingStreamReady()', {NYXVoice:voice,nyxTimed:()=>new Promise((_,reject)=>{rejectTimeout=reject})});
 const old=experience.prompt('First prompt');token++;
 rejectTimeout(Error('timeout'));assert.equal(await old,false);assert.equal(stopped,0);
});
test('onboarding save failures offer retry instead of an unhandled rejection',async()=>{
 const document=dom();let stopped=0;
 const experience=method(' async onboard(edit=false)', ' async runOnboarding(', {document,NYXVoice:{stopSpeech(){stopped++}},esc:String});
 experience.runOnboarding=async()=>{throw Error('Connection interrupted')};experience.stopOnboardingStream=()=>{};
 await experience.onboard();assert.match(document.getElementById('nyxOnboardCard').innerHTML,/Connection interrupted/);
 assert.equal(typeof document.getElementById('nyxRetrySetup').onclick,'function');assert.equal(stopped,1);
});

test('interrupting device speech settles its pending turn immediately without a cloud request',async()=>{
 let speakCalls=0,cloudCalls=0;
 const context={window:{speechSynthesis:{getVoices:()=>[{lang:'en-GB',name:'Serena'}],cancel(){},speak(){speakCalls++;}}},document:{body:{dataset:{}}},mic:{setAttribute(){}},NYXHandsFree:{resume(){}},NYXExperience:{settings:{voiceOutputMode:'device'}},SpeechSynthesisUtterance:function(text){this.text=text;},fetch(){cloudCalls++;throw Error('Device mode must not fetch');},setTimeout,clearTimeout,URL:{revokeObjectURL(){}},Promise};
 context.speechSynthesis=context.window.speechSynthesis;
 const code=between('const NYXVoice={','window.NYXVoice=NYXVoice;');
 const voice=vm.runInNewContext(code+';NYXVoice',context);
 const pending=voice.say('A spoken reply that has not ended.');
 voice.stopSpeech();
 const result=await Promise.race([pending,new Promise((_,reject)=>setTimeout(()=>reject(Error('Speech cancellation left a pending turn')),100))]);
 assert.equal(result,false);assert.equal(speakCalls,1);assert.equal(cloudCalls,0);assert.equal(voice.speaking,false);
});

test('foreground wake prefers supported browser recognition instead of uploading idle audio',async()=>{
 let started=0,media=0;
 const context={window:{SpeechRecognition:function(){this.start=()=>{started++};}},document:{hidden:false,getElementById:()=>({textContent:'',setAttribute(){}})},navigator:{mediaDevices:{getUserMedia(){media++;throw Error('Should use browser recognizer');}}},state(){},setTimeout,clearTimeout,Number};
 const code=between('const NYXHandsFree={','document.getElementById("wakeToggle").onclick=');
 const handsfree=vm.runInNewContext(code+';NYXHandsFree',context);
 handsfree.active=true;await handsfree.open();
 assert.equal(started,1);assert.equal(media,0);
});
