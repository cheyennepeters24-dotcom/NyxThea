import fs from "node:fs";
import vm from "node:vm";

const html=fs.readFileSync(new URL("../public/index.html",import.meta.url),"utf8");
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).filter(Boolean);
if(!scripts.length)throw new Error("No inline script found in public/index.html");
for(const [index,source] of scripts.entries()){
  try{new vm.Script(source,{filename:`public/index.html:inline-${index+1}.js`});}
  catch(error){console.error(error.stack||error);process.exit(1);}
}
console.log(`Checked ${scripts.length} inline Nyxthea script block(s).`);
