import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const root=resolve(process.cwd(),"public/models/nyx");
const model=resolve(root,"wakeword.onnx");
const config=resolve(root,"wakeword.json");
const modelExists=existsSync(model),configExists=existsSync(config);

if(!modelExists&&!configExists){
  console.log("Nyx wake model not installed yet; browser fallback remains active.");
  process.exit(0);
}
if(modelExists!==configExists){
  console.error("Nyx wake model installation is incomplete. Both wakeword.onnx and wakeword.json are required.");
  process.exit(1);
}
if(statSync(model).size<10000){
  console.error("wakeword.onnx is unexpectedly small.");
  process.exit(1);
}
let cfg;
try{cfg=JSON.parse(readFileSync(config,"utf8"))}catch{
  console.error("wakeword.json is not valid JSON.");
  process.exit(1);
}
const threshold=Number(cfg.threshold),sampleRate=Number(cfg.sample_rate??cfg.sampleRate??16000);
if(!Number.isFinite(threshold)||threshold<=0||threshold>=1){
  console.error("wakeword.json must contain a threshold between 0 and 1.");
  process.exit(1);
}
if(sampleRate!==16000){
  console.error("Nyx wake model must use 16 kHz audio.");
  process.exit(1);
}
console.log(`Nyx wake model ready: ${statSync(model).size} bytes, threshold ${threshold}, sample rate ${sampleRate} Hz.`);
