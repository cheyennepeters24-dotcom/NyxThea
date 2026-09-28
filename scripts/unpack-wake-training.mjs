import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { extname, resolve } from "node:path";

const input=process.argv[2];
if(!input){
  console.error("Usage: node scripts/unpack-wake-training.mjs <nyx-training.json> [output-dir]");
  process.exit(1);
}
const outputRoot=resolve(process.argv[3]||"training/nyx");
let bundle;
try{bundle=JSON.parse(readFileSync(resolve(input),"utf8"))}catch(error){
  console.error("Could not read Nyx training bundle:",error.message);
  process.exit(1);
}
if(bundle?.format!=="nyxthea-wake-training-v1"||bundle?.wakeWord!=="Nyx"||!Array.isArray(bundle.samples)){
  console.error("This is not a NyxThea wake-training bundle.");
  process.exit(1);
}
const extensionFor=mime=>{
  const value=String(mime||"").toLowerCase();
  if(value.includes("mp4")||value.includes("m4a"))return ".m4a";
  if(value.includes("ogg"))return ".ogg";
  if(value.includes("wav"))return ".wav";
  if(value.includes("mpeg")||value.includes("mp3"))return ".mp3";
  return ".webm";
};
const manifest=[];
for(let i=0;i<bundle.samples.length;i++){
  const sample=bundle.samples[i],label=["positive","negative","background"].includes(sample.label)?sample.label:"unknown";
  const dir=resolve(outputRoot,label);mkdirSync(dir,{recursive:true});
  const filename=`${String(i+1).padStart(3,"0")}-${String(sample.promptKind||"sample").replace(/[^a-z0-9_-]+/gi,"-")}${extensionFor(sample.mimeType)}`;
  const bytes=Buffer.from(String(sample.audioBase64||""),"base64");
  if(bytes.length<100)continue;
  writeFileSync(resolve(dir,filename),bytes);
  manifest.push({file:`${label}/${filename}`,label,promptKind:sample.promptKind||null,transcript:sample.transcript||null,mimeType:sample.mimeType||null,createdAt:sample.createdAt||null});
}
mkdirSync(outputRoot,{recursive:true});
writeFileSync(resolve(outputRoot,"manifest.json"),JSON.stringify({wakeWord:"Nyx",sourceFormat:bundle.format,deviceId:bundle.deviceId,exportedAt:bundle.exportedAt,samples:manifest},null,2)+"\n");
console.log(`Unpacked ${manifest.length} Nyx samples into ${outputRoot}`);
