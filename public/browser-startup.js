(function(){
 var failures=[];
 window.addEventListener('error',function(e){failures.push((e.message||'Script load failed')+' '+(e.filename||'')+':'+(e.lineno||0));});
 window.addEventListener('load',function(){setTimeout(function(){
 var button=document.getElementById('unlock');
 if(button&&typeof button.onclick==='function')return;
 var banner=document.createElement('div');
 banner.setAttribute('role','alert');
 banner.style.cssText='position:fixed;top:0;left:0;right:0;z-index:20000;padding:18px;background:#11223e;color:white;font:16px/1.5 sans-serif;border:2px solid #77baff;';
 banner.textContent='NyxThea could not start in this browser. Your account is not blocked. Please share this error: '+(failures.join(' | ')||'Browser script did not initialize')+' — '+navigator.userAgent;
 document.body.appendChild(banner);
 },1000);});
})();
