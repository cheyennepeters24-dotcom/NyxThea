// Presentation only: retain all existing control IDs, listeners, and security paths.
const centerStage=document.querySelector('.rose-stage');
centerStage.insertAdjacentHTML('afterbegin','<div class="moon-phases"><i></i><i></i><i></i></div><div class="orbit-ring"></div><div class="hero-motto">FOR A<br>SMARTER<br>SAFER<br>BRIGHTER<br>YOU<em>More than<br>an assistant.<br>A part of<br>your story.</em></div>');
document.querySelector('.page-title strong').textContent='Knowledge · Protection · Control · Freedom';
document.querySelector('.hero h1').innerHTML='Nyxthea<span>The Intelligence That Runs Your World.</span>';
document.querySelector('.hero .intro').textContent='Real intelligence. Real life. Yours.';
document.querySelector('.content').insertAdjacentHTML('beforeend','<footer class="command-footer"><span>KNOWLEDGE · PROTECTION · CONTROL · FREEDOM</span><em>A Calmer Mind.<br>A More Connected Life.</em></footer>');
