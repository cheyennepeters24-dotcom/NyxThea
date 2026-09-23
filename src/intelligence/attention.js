export const priorityOrder=["critical","time_sensitive","important","useful","background"];
export function attentionDecision(input={}) {
  const consequence=Number(input.consequence||0), minutes=input.minutesUntilDue==null?null:Number(input.minutesUntilDue);
  let level=consequence>=90?"critical":minutes!==null&&minutes<=30?"time_sensitive":consequence>=60?"important":consequence>=30?"useful":"background";
  const focus=Boolean(input.focusMode), dnd=Boolean(input.doNotDisturb), relevant=Boolean(input.relevantToCurrentTask);
  let interrupt=level==="critical"||level==="time_sensitive"||relevant&&level==="important";
  if(focus&&!["critical","time_sensitive"].includes(level)) interrupt=false;
  if(dnd&&level!=="critical") interrupt=false;
  return {level,interrupt,holdForLater:!interrupt,reason:interrupt?"consequence_or_context":"protect_attention"};
}
