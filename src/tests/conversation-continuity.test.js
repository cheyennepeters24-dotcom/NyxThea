import test from 'node:test';
import assert from 'node:assert/strict';
import {resetStateForTests,table} from '../state/store.js';
import {recordTurn,conversationContext,clearConversation} from '../core/conversation-state.js';
import {converse,converseFast} from '../core/conversation.js';
import {defaultExperience,updateExperience} from '../experience/design-system.js';

test('a long conversation retains earlier constraints without extra model calls or permanent memories',async()=>{
 resetStateForTests();
 recordTurn('a','user','I need a quiet indoor activity and cannot drive.');
 for(let i=0;i<40;i++)recordTurn('a',i%2?'assistant':'user','Planning detail '+i);
 recordTurn('b','user','Other profile secret');
 const context=conversationContext('a');
 assert.equal(context.conversation.length,24);
 assert.ok(context.continuity.notes.some(x=>x.text.includes('cannot drive')));
 assert.ok(!JSON.stringify(context).includes('Other profile secret'));
 assert.equal(table('memories').size,0);
 let calls=0,input;
 await converse({run:async(_model,value)=>{calls++;input=value;return {response:'Let’s keep it indoors.'};}},'What did I need?',context);
 assert.equal(calls,1);
 assert.match(input.messages[0].content,/cannot drive/);
});

test('temporary context expires and clearing chat leaves explicit memory and other profiles intact',()=>{
 resetStateForTests();
 const old=recordTurn('a','user','Old thread');old.at=new Date(Date.now()-25*3600000).toISOString();
 recordTurn('a','user','Current thread');recordTurn('b','user','Their thread');
 table('memories').set('saved',{text:'An explicitly saved preference'});
 assert.ok(!JSON.stringify(conversationContext('a')).includes('Old thread'));
 clearConversation('a');
 assert.equal(conversationContext('a').conversation.length,0);
 assert.equal(conversationContext('b').conversation.length,1);
 assert.equal(table('memories').size,1);
});

test('both chat paths know the active speaker without inference or model usage',async()=>{
 for(const fn of [converse,converseFast]){
  const reply=await fn({run:()=>{throw Error('must not use quota');}},'Hey Nyx do you remember who your talking to?',{speaker:{name:'Selected speaker'}});
  assert.match(reply.text,/Selected speaker/);assert.equal(reply.modelUsed,false);
 }
});

test('device speech defaults avoid cloud output and cloud speech requires selecting it',()=>{
 resetStateForTests();assert.equal(defaultExperience('a').voiceOutputMode,'device');
 assert.equal(updateExperience('a',{voiceOutputMode:'cloud'}).voiceOutputMode,'cloud');
 assert.throws(()=>updateExperience('a',{voiceOutputMode:'unknown'}));
});

test('explicit remember commands persist until forgotten; ordinary questions do not create memories',async()=>{
 const {memoryService}=await import('../memory/memory-integration.js');
 const {explicitMemoryReply,relevantMemories}=await import('../core/conversation-memory.js');
 resetStateForTests();const a=memoryService('user','a'),b=memoryService('user','b');
 assert.equal(explicitMemoryReply(a,'I like blue roses.'),null);
 assert.equal(explicitMemoryReply(a,'Do you remember my name?'),null);
 const reply=explicitMemoryReply(a,'Please remember that I like blue roses.');
 assert.ok(reply.memoryId);assert.equal(a.inspect()[0].expiresAt,null);assert.equal(b.inspect().length,0);
 assert.equal(relevantMemories(a,'What flowers do I like?').length,1);
 assert.equal(explicitMemoryReply(b,'What do you remember about me?').text,'There are no saved personal memories for this profile yet.');
});
