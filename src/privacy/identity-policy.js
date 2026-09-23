export function identityPolicy({role="user",action="general",deviceTrusted=false,voiceMatch=false}={}) {
  const sensitive=["private_records","account_change","purchase","security","permanent_delete","legal_submit","public_publish"];
  const high=sensitive.includes(action);
  if(role==="guest"&&high) return {allowed:false,reason:"Those are private.",revealMetadata:false};
  return {allowed:true,deviceTrusted,voiceMatchConvenienceOnly:Boolean(voiceMatch),requiresDeviceAuthentication:high,voiceAloneSufficient:false};
}
export function spokenPrivacy({sensitive=false,privateOutput=false,explicitlyAllowed=false}={}) {
  return {mayReadAloud:!sensitive||privateOutput||explicitlyAllowed,askFirst:sensitive&&!privateOutput&&!explicitlyAllowed};
}
