function escapeHtml(value=""){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
export function mailConfigured(env){return Boolean(env.RESEND_API_KEY&&env.NYXTHEA_RECOVERY_FROM);}
export async function sendRecoveryMail(env,{to,kind,code}){
  if(!mailConfigured(env))throw Object.assign(new Error("Recovery email delivery is not configured yet."),{status:503});
  const subject=kind==="verify"?"Verify your NyxThea recovery email":"NyxThea account recovery code";
  const purpose=kind==="verify"?"verify this address as your recovery email":"recover your NyxThea account";
  const html=`<div style="font-family:system-ui,sans-serif;max-width:560px;margin:auto"><h2>NyxThea</h2><p>Use this code to ${escapeHtml(purpose)}:</p><p style="font-size:28px;font-weight:700;letter-spacing:6px">${escapeHtml(code)}</p><p>This code expires in 10 minutes. If you did not request it, you can ignore this email.</p></div>`;
  const response=await fetch("https://api.resend.com/emails",{method:"POST",headers:{"content-type":"application/json","authorization":`Bearer ${env.RESEND_API_KEY}`},body:JSON.stringify({from:env.NYXTHEA_RECOVERY_FROM,to:[to],subject,html,tags:[{name:"category",value:kind==="verify"?"recovery_email_verify":"account_recovery"}]})});
  if(!response.ok)throw Object.assign(new Error("Recovery email could not be sent right now."),{status:503});
  return {sent:true};
}
