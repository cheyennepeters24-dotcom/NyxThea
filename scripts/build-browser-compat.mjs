import {readFile,writeFile} from 'node:fs/promises';
import {transform} from 'esbuild';
import {execFileSync} from 'node:child_process';
const path=new URL('../public/index.html',import.meta.url);
let html=execFileSync('git',['show','e7e4ed9:public/index.html'],{encoding:'utf8'});
const matches=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
for(const match of matches){
 const result=await transform(match[1],{target:'safari11',format:'iife',legalComments:'none'});
 await writeFile(new URL('../public/nyxthea-browser-compat.js',import.meta.url),result.code);
 html=html.replace(match[0],()=>'<script type="text/plain" id="nyxthea-browser-source">'+match[1]+'</script><script src="./nyxthea-browser-compat.js"></script>');
}
await writeFile(path,html);
console.log('Compiled browser logic for Safari 11+ without changing authorization.');
