import {readFile,writeFile} from 'node:fs/promises';
import {transform,build} from 'esbuild';
import {execFileSync} from 'node:child_process';
import babel from '@babel/core';
import presetEnv from '@babel/preset-env';
const path=new URL('../public/index.html',import.meta.url);
let html=await readFile(path,"utf8");
const matches=[...html.matchAll(/<script type="text\/plain" id="nyxthea-browser-source">([\s\S]*?)<\/script>/g)];
if(matches.length!==1)throw Error("Expected one browser source block");
for(const match of matches){
 const result=await transform(match[1],{target:'safari11',format:'iife',legalComments:'none'});
 const legacy=babel.transformSync(result.code,{presets:[[presetEnv,{targets:{safari:'9'},modules:false}]],comments:false,compact:false});
 await writeFile(new URL('../public/nyxthea-browser-compat.js',import.meta.url),legacy.code);

}
await build({stdin:{contents:'import "core-js/es/promise";import "core-js/es/promise/all-settled";import "core-js/es/object/from-entries";import "core-js/es/object/entries";import "core-js/es/object/values";import "core-js/es/symbol";import "core-js/es/array/iterator";import "core-js/es/object/get-own-property-descriptors";import "core-js/es/array/from";import "core-js/es/array/includes";import "core-js/es/string/pad-start";import "core-js/es/string/replace-all";import "whatwg-fetch";import "abortcontroller-polyfill/dist/polyfill-patch-fetch";',resolveDir:process.cwd()},bundle:true,minify:true,target:'safari9',outfile:new URL('../public/browser-polyfills.js',import.meta.url).pathname});

console.log('Compiled browser logic for Safari 9+ without changing authorization.');
