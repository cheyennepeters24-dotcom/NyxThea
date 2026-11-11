// Explicit commands only. Ordinary chat never writes personal memory.
export function explicitMemoryReply(memory, message) {
  const text=String(message).trim();
  if (/^(?:please\s+)?(?:what do you remember about me|show (?:me )?(?:my |your )?(?:saved )?memories)[?.!]*$/i.test(text)) {
    const items=memory.inspect();
    return {text:items.length ? `Your saved memories: ${items.slice(0,6).map(item=>item.text).join('; ')}${items.length>6 ? '. There are more in Memories.' : ''}` : 'There are no saved personal memories for this profile yet.', modelUsed:false};
  }
  const match=text.match(/^(?:please\s+)?remember\s+(?:that\s+)?(.+)$/i);
  if(!match || /\?$/.test(text) || /^(?:who|what|when|where|how|whether|if)\b/i.test(match[1]))return null;
  const item=memory.remember(match[1].trim(),'archive');
  return {text:'Saved to your profile’s memory. You can inspect or delete it in Memories.',memoryId:item.id,modelUsed:false};
}
export function relevantMemories(memory, message) {
  const stop=new Set(['what','when','where','which','about','would','could','should','please','remember','with','that','this','have','does','your','you','the','and','for','are','can','tell','help','how','was','were']);
  const terms=[...new Set(String(message).toLowerCase().match(/[\p{L}\p{N}']{3,}/gu)||[])].filter(term=>!stop.has(term));
  return memory.inspect().map(item=>({item,score:terms.reduce((n,term)=>n+(item.text.toLowerCase().includes(term)?1:0),0)})).filter(row=>row.score>0).sort((a,b)=>b.score-a.score).slice(0,6).map(row=>row.item);
}
