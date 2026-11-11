// Presentation only: retain all existing control IDs, listeners, and security paths.
// An ordinary image layer also works in Safari versions that fail to composite
// fixed body backgrounds. Never put this behind the page's root background.
var sceneImage=document.createElement('img');
sceneImage.id='nyxSceneBackdrop';sceneImage.src='./sapphire-atmosphere.jpg';sceneImage.alt='';sceneImage.setAttribute('aria-hidden','true');
document.body.insertBefore(sceneImage,document.body.firstChild);
var centerStage=document.querySelector('.rose-stage');
var roseImage=document.createElement('img');roseImage.className='nyx-rose-artwork';roseImage.src='./sapphire-rose-transparent.png';roseImage.alt='';centerStage.insertBefore(roseImage,centerStage.firstChild);
centerStage.insertAdjacentHTML('afterbegin','<div class="moon-phases"><i></i><i></i><i></i></div><div class="orbit-ring"></div><div class="hero-motto">FOR A<br>SMARTER<br>SAFER<br>BRIGHTER<br>YOU<em>More than<br>an assistant.<br>A part of<br>your story.</em></div>');
document.querySelector('.page-title strong').textContent='Knowledge · Protection · Control · Freedom';
document.querySelector('.hero h1').innerHTML='Nyxthea<span>The Intelligence That Runs Your World.</span>';
document.querySelector('.hero .intro').textContent='Real intelligence. Real life. Yours.';
document.querySelector('.content').insertAdjacentHTML('beforeend','<footer class="command-footer"><span>KNOWLEDGE · PROTECTION · CONTROL · FREEDOM</span><em>A Calmer Mind.<br>A More Connected Life.</em></footer>');
// The Devices tile routes to the existing Devices navigation; Live Guide stays
// available through its dedicated conversation-bar control.
var guideTile=document.querySelector('.domain-grid #liveGuide');
if(guideTile){guideTile.querySelector('strong').textContent='Devices';guideTile.querySelector('small').textContent='Phone · Wearables · Tech';guideTile.querySelector('.card-state').textContent='Authorization required';guideTile.onclick=function(){document.querySelector('.sidebar [data-view="Devices"]').click();};}
var worldTile=document.querySelector('.domain-grid [data-view="Your World"]');
if(worldTile)worldTile.querySelector('small').textContent='Home · Life · Family';
var svgPaths={Home:'M3 10 12 3l9 7M5 9v12h5v-7h4v7h5V9','Your World':'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20M2 12h20M12 2c-6 6-6 14 0 20 6-6 6-14 0-20',Devices:'M6 2h12v20H6zM10 18h4',Health:'M3 12h4l2-5 4 10 2-5h6M20 7c-2-5-6-4-8-1-2-3-6-4-8 1',Security:'M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6z',Memories:'M9 3c-4-2-7 3-5 6-4 2-2 8 1 8-1 4 5 6 7 3V4M15 3c4-2 7 3 5 6 4 2 2 8-1 8 1 4-5 6-7 3M7 8l3 2M5 14l4-1M17 8l-3 2M19 14l-4-1',Music:'M9 18V5l11-3v13M9 7l11-3M9 18a3 3 0 1 1-3-3c2 0 3 1 3 3M20 15a3 3 0 1 1-3-3c2 0 3 1 3 3',Vehicle:'M3 11l3-7h12l3 7v9h-3v-3H6v3H3zM3 11h18M6 14h2M16 14h2'};
var navButtons=document.querySelectorAll('.nav-button[data-view]');
for(var ni=0;ni<navButtons.length;ni++){var nav=navButtons[ni],path=svgPaths[nav.getAttribute('data-view')],icon=nav.querySelector('.nav-icon');if(path&&icon)icon.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="'+path+'"/></svg>';}
var artNames=['world','devices','health','vehicle'];
var tiles=document.querySelectorAll('.content > section:not(#integrationShelf) .domain-grid > .glass');
for(var ci=0;ci<Math.min(tiles.length,4);ci++){var tileArt=document.createElement('img');tileArt.className='nyx-card-artwork';tileArt.src='./dashboard-'+artNames[ci]+'.jpg';tileArt.alt='';tileArt.setAttribute('aria-hidden','true');tiles[ci].insertBefore(tileArt,tiles[ci].firstChild);}
