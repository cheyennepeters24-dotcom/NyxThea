import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const root=resolve(process.cwd());
const source=resolve(root,"node_modules/onnxruntime-web/dist");
const target=resolve(root,"public/vendor");
const files=["ort.min.js","ort-wasm-simd-threaded.wasm","ort-wasm-simd-threaded.mjs"];

if(!existsSync(source)){
  console.error("onnxruntime-web is not installed. Run npm install before preparing the wake runtime.");
  process.exit(1);
}
mkdirSync(target,{recursive:true});
for(const file of files){
  const from=resolve(source,file),to=resolve(target,file);
  if(!existsSync(from)){
    console.error(`Required ONNX Runtime asset is missing: ${file}`);
    process.exit(1);
  }
  mkdirSync(dirname(to),{recursive:true});
  copyFileSync(from,to);
  console.log(`Prepared public/vendor/${file}`);
}
