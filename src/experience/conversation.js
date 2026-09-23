const INTERRUPTS=/^(wait|hold on|stop|hang on|nixie|nyx|nyxthea|actually|no[, ]*no)\b/i;
const CONTROLS=[
  ["just show me","show"],["read it to me","read"],["short version","shorten"],["explain that","expand"],
  ["slower","slower"],["say that again","repeat"],["skip this part","skip"],["give me the details","expand"],
  ["start over","restart"],["keep going","continue"]
];
export function interpretTurn({utterance="",assistantSpeaking=false,currentThread=null}={}) {
  const text=String(utterance).trim(); const lower=text.toLowerCase();
  const control=CONTROLS.find(([phrase])=>lower.includes(phrase));
  const interrupt=assistantSpeaking&&INTERRUPTS.test(text);
  const backchannel=assistantSpeaking&&/^(yeah|yep|mhm|mm-hmm|uh-huh|okay|ok|right)[.! ]*$/i.test(text);
  return {text,interrupt,backchannel,control:control?.[1]||null,preserveThread:Boolean(currentThread),humanHasFloor:interrupt||(!backchannel&&text.length>0)};
}
export function recoveryLanguage({kind="unknown",recovered=false,safe=true}={}) {
  if(recovered) return {message:"Got it. We’re back.",retry:false};
  if(kind==="offline") return {message:"We’re offline. Some things won’t work, but I’m still here.",retry:true};
  if(kind==="voice") return {message:"My voice isn’t cooperating, but I can still talk with you here.",retry:true,fallback:"text"};
  if(kind==="save") return {message:safe?"I haven’t been able to sync this yet, but I still have your changes on this device.":"I couldn’t save that.",retry:true};
  return {message:"Something failed on my side. I don’t know why yet.",retry:true};
}
