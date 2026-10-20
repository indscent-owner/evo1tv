(function(){
if(window.__tvInit)return;window.__tvInit=true;
var D=document,W=window,P=location.pathname;
var A=W.Android||{setImmersive:function(){},tap:function(){},showKeyboard:function(){},setEditing:function(){},showOptions:function(){}};
var HOME=/^\/(home)?\/?$/.test(P),WATCH=P.indexOf('/watch/')===0;
var SEL='a[href],button,input:not([type=hidden]),select,textarea,summary,[tabindex]:not([tabindex="-1"]),[onclick],[role=button],video,iframe';
var CSS=[
'html{scroll-padding-top:70px}body{padding-top:56px!important;background:#0b0b10!important}header{display:none!important}',
'.tv-focus{outline:4px solid #e50914!important;outline-offset:2px!important;border-radius:6px}',
'.adsbygoogle,ins.adsbygoogle,[id^="google_ads"],iframe[src*="doubleclick"],iframe[src*="adsterra"],[class*="popunder"],[id*="popunder"]{display:none!important}',
'#evo-top{position:fixed;top:0;left:0;right:0;height:56px;z-index:2147483100;background:#14141c;display:flex;align-items:center;gap:12px;padding:0 14px;box-shadow:0 2px 10px #000a;font-family:sans-serif}',
'.ev-ib{width:42px;height:42px;border:0;border-radius:10px;background:#22222e;color:#fff;font-size:20px}.ev-logo{flex:1;font:700 20px sans-serif;color:#fff}.ev-logo b{color:#e50914}',
'#evo-drawer,#evo-search{position:fixed;top:56px;left:0;background:#14141c;z-index:2147483050;display:none;font-family:sans-serif}',
'#evo-drawer{bottom:0;width:min(86vw,360px);overflow-y:auto;padding:10px}#evo-search{right:0;padding:14px}',
'#evo-drawer.open,#evo-search.open{display:block}',
'#evo-drawer a,#evo-drawer summary{display:block;padding:12px 14px;color:#fff;font-size:16px;border-radius:8px;text-decoration:none;cursor:pointer}',
'#evo-drawer details details{margin-left:10px}.ev-chips a{display:inline-block!important;margin:3px;background:#22222e;font-size:14px!important}',
'#evo-q{width:100%;box-sizing:border-box;padding:12px;font-size:18px;border-radius:8px;border:0;background:#22222e;color:#fff}',
'#evo-home{position:fixed;top:56px;left:0;right:0;bottom:0;overflow-y:auto;background:#0b0b10;z-index:2147483000;color:#f2f2f5;font-family:sans-serif;padding-bottom:40px}',
'body.evo-home-on>*:not(#evo-home):not(#evo-top):not(#evo-drawer):not(#evo-search){display:none!important}',
'.ev-hero{position:relative;height:56vh;min-height:260px;overflow:hidden;background:#000}.ev-hero>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}',
'.ev-hero .sh{position:absolute;inset:0;background:linear-gradient(90deg,#0b0b10 5%,transparent 75%),linear-gradient(0deg,#0b0b10,transparent 50%)}',
'.ev-hero .tx{position:absolute;left:4%;bottom:10%;max-width:60%}.ev-hero h1{font-size:clamp(22px,4vw,44px);margin:6px 0}',
'.ev-g,.ev-m{font-size:13px;color:#cfcfda}.ev-hero p{color:#cfcfda;font-size:clamp(12px,1.5vw,16px);max-height:4.6em;overflow:hidden;margin:8px 0 14px}',
'.ev-watch{display:inline-block;background:#e50914;color:#fff;padding:10px 22px;border-radius:8px;font-weight:700;text-decoration:none}',
'.ev-dots{position:absolute;right:4%;bottom:6%;display:flex;gap:6px}.ev-dots i{width:9px;height:9px;border-radius:50%;background:#fff5}.ev-dots i.on{background:#e50914}',
'.ev-q{display:flex;gap:12px;padding:16px 4%;flex-wrap:wrap}.ev-q a{padding:10px 20px;background:#22222e;color:#fff;border-radius:999px;text-decoration:none;font-weight:600}',
'.ev-sec{padding:6px 4% 14px}.ev-sec h2{font-size:20px;margin:12px 0;color:#fff}',
'.ev-row{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:14px}',
'.ev-row .ev-x{display:none}.ev-row.open .ev-x{display:block}',
'a.ev-card{display:block;color:#fff;text-decoration:none}.ev-img{aspect-ratio:2/3;background:#22222e;border-radius:8px;overflow:hidden}.ev-img img{width:100%;height:100%;object-fit:cover}',
'.ev-t{font-size:13px;margin-top:6px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ev-s{font-size:11px;color:#9a9aab;height:14px;overflow:hidden}',
'.ev-more{display:flex;align-items:center;justify-content:center;text-align:center;aspect-ratio:2/3;border:2px dashed #666;background:transparent;color:#fff;border-radius:8px;font-size:15px;text-decoration:none}',
'.ev-row.open .ev-more.ev-x{display:flex}.ev-foot{padding:10px 4%;color:#9a9aab;font-size:12px}.ev-foot h3{color:#fff;font-size:15px}',
'.ev-foot .ev-chips a{display:inline-block;margin:3px;padding:7px 12px;background:#22222e;color:#fff;border-radius:999px;text-decoration:none;font-size:13px}',
'.evo-fs{position:fixed!important;top:0!important;left:0!important;width:100vw!important;height:100vh!important;max-width:none!important;max-height:none!important;z-index:2147483200!important;background:#000!important;border:0!important;margin:0!important;transform:none!important;outline:none!important}',
'.evo-anc{transform:none!important;filter:none!important;overflow:visible!important;contain:none!important;perspective:none!important}',
'html.evo-fs-on #evo-top{display:none!important}html.evo-fs-on,html.evo-fs-on body{overflow:hidden!important}'
].join('');
(function(){var s=D.createElement('style');s.textContent=CSS;(D.head||D.documentElement).appendChild(s)})();
W.open=function(){return null};
D.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[target=_blank]');if(a&&a.hostname.indexOf('ev01')>-1)a.target='_self'},true);
function isText(e){return (e.tagName==='INPUT'&&!/^(checkbox|radio|button|submit|reset|image|file|range|color)$/i.test(e.type))||e.tagName==='TEXTAREA'}
D.addEventListener('focusin',function(e){if(isText(e.target))try{A.setEditing(true)}catch(x){}},true);
D.addEventListener('focusout',function(e){if(isText(e.target))try{A.setEditing(false)}catch(x){}},true);

// ---------- helpers ----------
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function h(tag,cls,html,at){var e=D.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;for(var k in (at||{}))e.setAttribute(k,at[k]);return e}
function hide(e){if(e&&!e.__h){e.__h=1;e.style.setProperty('display','none','important')}}
function evoUi(e){return e.closest&&e.closest('#evo-top,#evo-drawer,#evo-home,#evo-search')}
function leaf(rx){return [].filter.call(D.querySelectorAll('h1,h2,h3,h4,h5,h6,p,span,div,button,a,li,strong,b,label,small'),function(e){return e.children.length<=3&&e.textContent.length<160&&rx.test(e.textContent.trim())&&!evoUi(e)})}
function blockOf(el){while(el.parentElement&&el.parentElement!==D.body&&!el.parentElement.querySelector('iframe,video,h1,h2,a[href*="/watch/"]'))el=el.parentElement;return el}
function hc(e){return (/^H[1-4]$/.test(e.tagName)?1:0)+e.querySelectorAll('h1,h2,h3,h4').length}
function sectionOf(hd){var el=hd;while(el.parentElement&&el.parentElement!==D.body){var p=el.parentElement;if(hc(p)>hc(el)||p.querySelector('iframe,video'))break;el=p}return el}
function links(rx){var seen={},out=[];[].forEach.call(D.querySelectorAll('a[href]'),function(a){if(evoUi(a))return;var t=a.textContent.trim();if(rx.test(a.pathname)&&t&&!seen[a.href]){seen[a.href]=1;out.push({href:a.href,text:t})}});return out}
function vis(e){var r=e.getBoundingClientRect();if(r.width<6||r.height<6)return false;var s=getComputedStyle(e);return s.visibility!=='hidden'&&s.display!=='none'&&parseFloat(s.opacity)>0.05&&!e.disabled}
function big(e){var r=e.getBoundingClientRect();return r.width>300&&r.height>150}
function isPl(e){return (e.tagName==='VIDEO'||e.tagName==='IFRAME')&&big(e)}
function player(){var l=[].filter.call(D.querySelectorAll('iframe,video'),function(e){return big(e)&&!evoUi(e)});l.sort(function(a,b){return b.offsetWidth*b.offsetHeight-a.offsetWidth*a.offsetHeight});return l[0]}

// ---------- spatial navigation ----------
var cur=null,pane=null,HOMEON=false,fs=null;
function scopes(){if(pane)return [pane];if(HOMEON)return [D.getElementById('evo-top'),D.getElementById('evo-home')];return [D.body]}
function cands(){
  var l=[];scopes().forEach(function(r){[].forEach.call(r.querySelectorAll(SEL),function(e){if(l.indexOf(e)<0&&vis(e))l.push(e)})});
  return l.filter(function(e){if(e.tagName==='IFRAME'&&!big(e))return false;return !l.some(function(o){return o!==e&&e.contains(o)&&o.tagName!=='IFRAME'&&o.tagName!=='VIDEO'})});
}
function setF(e){
  if(cur)cur.classList.remove('tv-focus');
  cur=e;e.classList.add('tv-focus');
  e.scrollIntoView({block:'center',inline:'center'});
  var t=e.tagName;if(t!=='IFRAME'&&t!=='VIDEO'&&t!=='INPUT'&&t!=='TEXTAREA'&&t!=='SELECT'){try{e.focus({preventScroll:true})}catch(x){}}
}
function inView(e){var r=e.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth}
function move(dir){
  if(fs){if(dir==='down')W.__tvOptions();else if(dir==='up')A.tap(innerWidth/2,innerHeight/2,0);return 'ok'}
  if(cur&&!D.contains(cur))cur=null;
  var all=cands();
  if(!cur||all.indexOf(cur)<0){var f=all.filter(inView)[0]||all[0];if(f)setF(f);return 'ok'}
  if(cur.id==='evo-watch'&&(dir==='left'||dir==='right')){heroStep(dir==='right'?1:-1);return 'ok'}
  var a=cur.getBoundingClientRect(),ax=a.left+a.width/2,ay=a.top+a.height/2,best=null,bs=1e18;
  all.forEach(function(e){
    if(e===cur||cur.contains(e)||e.contains(cur))return;
    var r=e.getBoundingClientRect(),dx=r.left+r.width/2-ax,dy=r.top+r.height/2-ay,p,s;
    if(dir==='left'){p=-dx;s=Math.abs(dy)}else if(dir==='right'){p=dx;s=Math.abs(dy)}else if(dir==='up'){p=-dy;s=Math.abs(dx)}else{p=dy;s=Math.abs(dx)}
    if(p<=4)return;var sc=p+2.5*s;if(sc<bs){bs=sc;best=e}
  });
  if(best){setF(best);return 'ok'}
  if(dir==='down'||dir==='up'){var sc2=HOMEON?D.getElementById('evo-home'):W;sc2.scrollBy(0,dir==='down'?innerHeight*0.7:-innerHeight*0.7)}
  return 'ok';
}
function ok(){
  if(fs){exitFs();return 'ok'}
  if(!cur)return move('down');
  var t=cur.tagName;
  if(isText(cur)){cur.focus();A.showKeyboard();return 'ok'}
  if(isPl(cur)){enterFs(cur,true);return 'ok'}
  if(t==='INPUT'||t==='A'||t==='BUTTON'||t==='SUMMARY'||true){cur.click()}
  return 'ok';
}
W.__tvNav=function(d){try{return d==='ok'?ok():move(d)}catch(e){return 'err'}};

// ---------- fullscreen player ----------
function enterFs(p,tap){
  fs=p;var a=p.parentElement;while(a&&a!==D.body){a.classList.add('evo-anc');a=a.parentElement}
  p.classList.add('evo-fs');D.documentElement.classList.add('evo-fs-on');A.setImmersive(true);
  if(tap&&!W.__evoTapped){W.__evoTapped=1;A.tap(innerWidth/2,innerHeight/2,800)}
}
function exitFs(){
  if(!fs)return;var p=fs;fs=null;
  [].forEach.call(D.querySelectorAll('.evo-anc'),function(e){e.classList.remove('evo-anc')});
  p.classList.remove('evo-fs');D.documentElement.classList.remove('evo-fs-on');A.setImmersive(false);
  if(D.contains(p)){setF(p);p.scrollIntoView({block:'start'})}
}
function refreshFs(){if(fs&&!D.contains(fs)){fs=null;[].forEach.call(D.querySelectorAll('.evo-anc'),function(e){e.classList.remove('evo-anc')});var np=player();if(np)enterFs(np,false)}}

// ---------- top bar, drawer, search ----------
function openPane(p){closePane();pane=p;p.classList.add('open');if(p.id==='evo-drawer')fillSettings();if(p.id==='evo-search'){var q=D.getElementById('evo-q');setF(q);q.focus();A.showKeyboard()}else{var f=p.querySelector('a,summary');if(f)setF(f)}}
function closePane(){if(pane){pane.classList.remove('open');pane=null;if(cur&&!D.contains(cur))cur=null}}
function togglePane(p){if(pane===p)closePane();else openPane(p)}
function fillSettings(){
  var g=D.getElementById('evo-gen'),c=D.getElementById('evo-cty');
  if(g&&!g.__f){var l=links(/^\/genre\/[^\/]+$/);if(l.length){g.__f=1;g.innerHTML=l.map(function(x){return '<a href="'+esc(x.href)+'">'+esc(x.text)+'</a>'}).join('')}}
  if(c&&!c.__f){var m=links(/^\/country\/[^\/]+$/);if(m.length){c.__f=1;c.innerHTML=m.map(function(x){return '<a href="'+esc(x.href)+'">'+esc(x.text)+'</a>'}).join('')}}
}
function doSearch(q){
  if(!q)return;
  var inp=[].filter.call(D.querySelectorAll('input'),function(i){return !i.closest('#evo-search')&&/search|keyword|^q$/i.test((i.name||'')+' '+(i.placeholder||'')+' '+i.type)})[0];
  if(inp&&inp.form&&(inp.form.method||'get').toLowerCase()==='get'){var u=new URL(inp.form.action||location.href,location.href);u.searchParams.set(inp.name||'keyword',q);location.href=u.href;return}
  if(inp){inp.value=q;inp.dispatchEvent(new Event('input',{bubbles:true}));inp.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',keyCode:13,bubbles:true}));if(inp.form&&inp.form.requestSubmit)inp.form.requestSubmit();return}
  location.href='/browser?keyword='+encodeURIComponent(q);
}
function buildChrome(){
  if(D.getElementById('evo-top')||!D.body)return;
  var top=h('div',null,'<button class="ev-ib" id="evo-burger">\u2630</button><div class="ev-logo"><b>EVO</b> Stream</div><button class="ev-ib" id="evo-srch">\uD83D\uDD0D</button>',{id:'evo-top'});
  var L=[['Home','/home'],['Movies','/movie'],['TV-Series','/tv'],['New Episodes','/new-episodes'],['New Releases','/new-releases'],['Trending','/trending'],['Top 2026 Movies','/top-movies-2026'],['Top 2026 TV Shows','/top-tv-shows-2026'],['Top IMDb','/top-imdb'],['Filter / Browse','/browser']];
  var dr=h('div',null,L.map(function(x){return '<a href="'+x[1]+'">'+x[0]+'</a>'}).join('')+'<details><summary>\u2699 Settings</summary><details><summary>Genres</summary><div class="ev-chips" id="evo-gen"></div></details><details><summary>Countries</summary><div class="ev-chips" id="evo-cty"></div></details><a href="/genres">All genres \u2192</a><a href="/countries">All countries \u2192</a></details>',{id:'evo-drawer'});
  var se=h('form',null,'<input id="evo-q" type="search" placeholder="Search movies &amp; TV shows" enterkeyhint="search" autocomplete="off">',{id:'evo-search'});
  D.body.appendChild(top);D.body.appendChild(dr);D.body.appendChild(se);
  D.getElementById('evo-burger').onclick=function(){togglePane(dr)};
  D.getElementById('evo-srch').onclick=function(){togglePane(se)};
  se.addEventListener('submit',function(e){e.preventDefault();doSearch(D.getElementById('evo-q').value.trim())});
}

// ---------- home screen ----------
var IM=[],slides=[],heroI=0,heroEl=null;
function srcOf(el){if(!el)return '';var s=el.currentSrc||el.getAttribute('src')||el.getAttribute('data-src')||el.getAttribute('data-original')||el.getAttribute('data-lazy-src')||'';return (/^(https?:)?\/\//.test(s)||/^\/[^\/]/.test(s))?s:''}
function heroImg(){if(!heroEl||!slides.length)return;var s=srcOf(slides[heroI].img),i=heroEl.querySelector('img');if(s&&i.getAttribute('src')!==s)i.src=s}
function refreshImgs(){IM.forEach(function(p){var s=srcOf(p.s);if(s&&p.m.getAttribute('src')!==s)p.m.src=s});heroImg()}
function showHero(i){
  var s=slides[i],e=heroEl;e.querySelector('h1').textContent=s.title;e.querySelector('.ev-g').textContent=s.genres;e.querySelector('.ev-m').textContent=s.meta;e.querySelector('p').textContent=s.desc;
  e.querySelector('.ev-watch').href=s.href;[].forEach.call(e.querySelectorAll('.ev-dots i'),function(d,k){d.className=k===i?'on':''});
  e.querySelector('img').removeAttribute('src');heroImg();
}
function heroStep(d){if(slides.length<2)return;heroI=(heroI+d+slides.length)%slides.length;showHero(heroI)}
function buildHome(){
  if(D.getElementById('evo-home'))return true;
  var SECS={'new episodes':'/new-episodes','new releases':'/new-releases','latest movies':'/movie','latest tv-shows':'/tv','trending':'/trending','best of':'/top-movies-2026'};
  var secs=[],cs=null;
  [].forEach.call(D.querySelectorAll('h2,a[href*="/watch/"]'),function(n){
    if(evoUi(n))return;
    if(n.tagName==='H2'){var k=n.textContent.trim().toLowerCase();cs=SECS[k]?{name:n.textContent.trim(),url:SECS[k],items:[],grp:null,seen:{}}:null;if(cs)secs.push(cs);return}
    if(!cs)return;
    var g=n.parentElement;while(g&&g.querySelectorAll('a[href*="/watch/"]').length<2)g=g.parentElement;
    if(!cs.grp)cs.grp=g;if(g!==cs.grp||cs.seen[n.href])return;cs.seen[n.href]=1;
    var tt=n.getAttribute('title')||n.textContent.trim(),tx=(n.innerText||n.textContent).replace(/\s+/g,' ');
    cs.items.push({href:n.href,title:tt,sub:tx.split(tt).join(' ').replace(/\s+/g,' ').trim().slice(0,34),img:n.querySelector('img')});
  });
  if(!secs.length)return false;
  [].filter.call(D.querySelectorAll('a[href*="/watch/"]'),function(a){return !evoUi(a)&&/^watch now$/i.test(a.textContent.trim())}).forEach(function(a){
    var c=a;while(c.parentElement&&[].filter.call(c.parentElement.querySelectorAll('a'),function(x){return /^watch now$/i.test(x.textContent.trim())}).length===1)c=c.parentElement;
    var tx=(c.innerText||c.textContent).replace(/\s+/g,' '),m=tx.match(/IMDb\s*[\d.]+(?:\s+(?:HD|CAM|SD|TS))?(?:\s+\d+ min)?(?:\s+\d{4})?/),p=[].filter.call(c.querySelectorAll('p'),function(x){return x.textContent.length>50})[0];
    slides.push({href:a.href,title:(c.querySelector('h2')||{textContent:''}).textContent.trim(),img:c.querySelector('img'),desc:p?p.textContent.trim():'',meta:m?m[0]:'',genres:[].map.call(c.querySelectorAll('a[href*="/genre/"]'),function(g){return g.textContent.trim()}).slice(0,3).join(' \u2022 ')});
  });
  var home=h('div',null,null,{id:'evo-home'});
  if(slides.length){heroEl=h('div','ev-hero','<img alt=""><div class="sh"></div><div class="tx"><div class="ev-g"></div><h1></h1><div class="ev-m"></div><p></p><a class="ev-watch" id="evo-watch" href="#">\u25B6 Watch Now</a></div><div class="ev-dots">'+slides.map(function(){return '<i></i>'}).join('')+'</div>');home.appendChild(heroEl);showHero(0)}
  home.appendChild(h('div','ev-q','<a href="/new-episodes">New Episodes</a><a href="/new-releases">New Releases</a><a href="/trending">Trending</a><a href="/top-imdb">Top IMDb</a>'));
  secs.forEach(function(s){
    var sec=h('section','ev-sec','<h2>'+esc(s.name)+'</h2>'),row=h('div','ev-row');
    s.items.forEach(function(it,i){
      var a=h('a','ev-card'+(i>=5?' ev-x':''),'<div class="ev-img"><img alt=""></div><div class="ev-t">'+esc(it.title)+'</div><div class="ev-s">'+esc(it.sub)+'</div>',{href:it.href});
      IM.push({m:a.querySelector('img'),s:it.img});row.appendChild(a);
    });
    if(s.items.length>5){
      var b=h('button','ev-more','Show all ('+s.items.length+')');
      b.onclick=function(){var o=row.classList.toggle('open');b.textContent=o?'Show less':'Show all ('+s.items.length+')'};
      row.appendChild(b);row.appendChild(h('a','ev-more ev-x','Full list \u2192',{href:s.url}));
    }
    sec.appendChild(row);home.appendChild(sec);
  });
  var chips=function(l,all,u){return l.slice(0,8).map(function(x){return '<a href="'+esc(x.href)+'">'+esc(x.text)+'</a>'}).join('')+'<a href="'+u+'">'+all+' \u2192</a>'};
  home.appendChild(h('div','ev-foot','<h3>Genres</h3><div class="ev-chips">'+chips(links(/^\/genre\/[^\/]+$/),'All genres','/genres')+'</div><h3>Countries</h3><div class="ev-chips">'+chips(links(/^\/country\/[^\/]+$/),'All countries','/countries')+'</div><p>This app only displays a third-party website. No files are stored by the app.</p>'));
  D.body.appendChild(home);HOMEON=true;
  var f=D.getElementById('evo-watch')||home.querySelector('a');if(f)setF(f);
  // scroll the hidden original page once so its lazy images load, then copy them
  var y=0,H=Math.max(D.body.scrollHeight,3000),t=setInterval(function(){W.scrollTo(0,y);y+=innerHeight*0.8;if(y>H){clearInterval(t);W.scrollTo(0,0);refreshImgs();setTimeout(function(){refreshImgs();D.body.classList.add('evo-home-on');var n=0,r=setInterval(function(){refreshImgs();if(++n>6)clearInterval(r)},2000)},1200)}},180);
  return true;
}

// ---------- options (servers / seasons / episodes / player) ----------
W.__tvOptions=function(){
  if(!WATCH){togglePane(D.getElementById('evo-drawer'));return}
  var els=[],out=[];
  function add(name,list){var seen={},it=[];list.forEach(function(x){var t=x.t;if(!t||seen[t]||it.length>=200)return;seen[t]=1;els.push(x.e);it.push({i:els.length-1,t:t})});if(it.length)out.push({name:name,items:it})}
  add('Servers',(W.__evoSrv||[]).map(function(e){return {e:e,t:e.textContent.trim()}}));
  var ep=[].filter.call(D.querySelectorAll('a[href*="e="][title]'),function(e){return !evoUi(e)});
  add('Seasons',ep.filter(function(e){return /^Season \d+$/.test(e.title)}).map(function(e){return {e:e,t:e.title}}));
  add('Episodes',ep.filter(function(e){return /^E\d+/.test(e.title)}).map(function(e){return {e:e,t:e.title.replace(/^E(\d+)\s*\u00B7\s*/,'$1. ')}}));
  add('Player',leaf(/^(Prev|Next|Auto Next|Auto Play)$/i).map(function(e){return {e:e,t:e.textContent.trim()}}));
  W.__tvEls=els;A.showOptions(JSON.stringify(out));
};
W.__tvClick=function(i){var e=W.__tvEls&&W.__tvEls[i];if(!e)return;e.click();setTimeout(refreshFs,1200)};
W.__evoBack=function(){if(fs){exitFs();return true}if(pane){closePane();return true}return false};

// ---------- cleaner ----------
function clean(){
  buildChrome();
  if(HOME&&!HOMEON&&D.querySelectorAll('a[href*="/watch/"]').length>12)buildHome();
  var pop=leaf(/The site may close tomorrow/i)[0];
  if(pop){var a=pop;for(var i=0;i<10&&a.parentElement;i++){if(getComputedStyle(a).position==='fixed')break;a=a.parentElement}hide(getComputedStyle(a).position==='fixed'?a:blockOf(pop))}
  [].forEach.call(D.querySelectorAll('a[href*="api.whatsapp.com"],a[href*="t.me/share"]'),function(a){var c=a;while(c.parentElement&&c.parentElement!==D.body&&c.querySelectorAll('a').length<5)c=c.parentElement;if(!c.querySelector('iframe,video,h1,h2'))hide(c)});
  leaf(/let others know|Love this site\?|Never lose|Ctrl.*bookmark/i).forEach(function(e){hide(blockOf(e))});
  leaf(/^Comments$/i).filter(function(e){return /^H[1-6]$/.test(e.tagName)}).forEach(function(e){hide(sectionOf(e))});
  leaf(/^Report a problem$/i).forEach(function(e){hide(blockOf(e))});
  leaf(/A free hub for high-quality movies|^Back to Top$/i).forEach(function(e){hide(blockOf(e))});
  hide(D.querySelector('footer'));
  [].forEach.call(D.querySelectorAll('a[href="/"],a[href="https://ev01.ws/"]'),function(a){if(!evoUi(a)&&/^Home$/i.test(a.textContent.trim())){var l=a.closest('ol,ul,nav');if(l&&!l.querySelector('a[href*="/genre/"]'))hide(l)}});
  if(WATCH){
    leaf(/^(Focus|Report)$/i).forEach(hide);
    if(!W.__evoSrv){
      var l=leaf(/^Servers$/i)[0];
      if(l){var c=l;while(c.parentElement&&c.parentElement!==D.body&&c.querySelectorAll('button,li,a,[role=button]').length<10)c=c.parentElement;
        var els=[].filter.call(c.querySelectorAll('button,li,a,[role=button]'),function(e){return !e.querySelector('button,li,a')&&e.textContent.trim()&&e.textContent.trim().length<30&&e!==l});
        if(els.length>=3&&!c.querySelector('iframe,video')){var box=els[0];while(!els.every(function(e){return box.contains(e)}))box=box.parentElement;W.__evoSrv=els;hide(box);hide(l)}}
    }
    var pl=player();if(pl&&!W.__evoFocused&&!fs){W.__evoFocused=1;setF(pl)}
  }
}
var runs=0;(function loop(){try{clean()}catch(e){}runs++;setTimeout(loop,runs<20?1500:8000)})();
// click-hijack overlay killer
setInterval(function(){try{[].forEach.call(D.querySelectorAll('body > *,[style*="z-index"]'),function(e){
  if(e===cur||/^(IFRAME|VIDEO)$/.test(e.tagName)||(e.id&&e.id.indexOf('evo-')===0)||e.classList.contains('evo-fs')||e.querySelector('.evo-fs'))return;
  var s=getComputedStyle(e);if(s.position!=='fixed'&&s.position!=='absolute')return;
  if((parseInt(s.zIndex)||0)<900)return;
  var r=e.getBoundingClientRect();if(r.width<innerWidth*0.8||r.height<innerHeight*0.8)return;
  if(e.querySelector('video,iframe')||(e.innerText||'').trim().length>0)return;
  e.remove();})}catch(x){}},1500);
})();
