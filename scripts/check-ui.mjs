import fs from "node:fs";
import vm from "node:vm";

const html=fs.readFileSync(new URL("../public/index.html",import.meta.url),"utf8");
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).filter(Boolean);
if(!scripts.length)throw new Error("No inline script found in public/index.html");
const selectorHelper=/const \$=s=>document\.querySelector\(s\),\$\$=s=>\[\.\.\.document\.querySelectorAll\(s\)\]/;
if(!selectorHelper.test(scripts.join("\n"))){
  console.error("Nyxthea must define distinct $() and $() selector helpers.");
  process.exit(1);
}
for(const [index,source] of scripts.entries()){
  if(/\${3,}/.test(source)){
    console.error(`Unknown selector helper in inline script ${index+1}.`);
    process.exit(1);
  }
  const invalidCollectionSelector=/(?<!\$)\$\([^)]*\)\.(?:forEach|map|filter|some|every)\b/g;
  const bad=[...source.matchAll(invalidCollectionSelector)];
  if(bad.length){
    console.error(`Single-element $() selector used as a collection in inline script ${index+1}: ${bad.map(m=>m[0]).join(" | ")}`);
    process.exit(1);
  }
  try{new vm.Script(source,{filename:`public/index.html:inline-${index+1}.js`});}
  catch(error){console.error(error.stack||error);process.exit(1);}
}
if(!html.includes("d.buildHealth||[]")||!html.includes("similar runs")||!html.includes("Open CI run"))throw new Error("System Admin must render grouped CI build health.");
console.log(`Checked ${scripts.length} inline Nyxthea script block(s).`);
