(function(){
if(window.__tvInit)return;window.__tvInit=true;
var D=document,W=window,L=location,NOP=function(){};
var A=W.Android||{setEditing:NOP,showKeyboard:NOP,showOptions:NOP,setImmersive:NOP,tap:NOP,frameCmd:NOP,openSettings:NOP,pref:function(){return ''},startPath:function(){return '/'},audioActive:function(){return false},agentOk:function(){return false}};
function norm(p){return (p||'/').replace(/\/index\.(html?|php)$/i,'/').replace(/\/+$/,'')||'/'}
var HOME=norm(L.pathname)===norm(A.startPath())||norm(L.pathname)==='/';
var SEL='a[href],button,input:not([type=hidden]),select,textarea,summary,[tabindex]:not([tabindex="-1"]),[onclick],[role=button],video,iframe';
var CSS=[
'html{scroll-padding-top:70px}body{padding-top:56px!important;background:#0b0b10!important}header{display:none!important}',
'.tv-focus{outline:4px solid #e50914!important;outline-offset:2px!important;border-radius:6px}',
'.adsbygoogle,ins.adsbygoogle,[id^="google_ads"],iframe[src*="doubleclick"],[class*="popunder"],[id*="popunder"]{display:none!important}',
'#evo-top{position:fixed;top:0;left:0;right:0;height:56px;z-index:2147483100;background:#14141c;display:flex;align-items:center;gap:12px;padding:0 14px;box-shadow:0 2px 10px #000a;font-family:sans-serif}',
'.ev-ib{width:42px;height:42px;border:0;border-radius:10px;background:#22222e;color:#fff;font-size:20px}.ev-logo{flex:1;font:700 20px sans-serif;color:#fff;text-align:center}.ev-logo b{color:#e50914}',
'#evo-drawer,#evo-search{position:fixed;top:56px;left:0;background:#14141c;z-index:2147483050;display:none;font-family:sans-serif}',
'#evo-drawer{bottom:0;width:min(86vw,360px);overflow-y:auto;padding:10px}#evo-search{right:0;padding:14px}',
'#evo-drawer.open,#evo-search.open{display:block}',
'#evo-drawer a,#evo-drawer summary{display:block;padding:12px 14px;color:#fff;font-size:16px;border-radius:8px;text-decoration:none;cursor:pointer}',
'#evo-drawer details details{margin-left:10px}',
'#evo-q{width:100%;box-sizing:border-box;padding:12px;font-size:18px;border-radius:8px;border:0;background:#22222e;color:#fff}',
'#evo-home{position:fixed;top:56px;left:0;right:0;bottom:0;overflow-y:auto;background:#0b0b10;z-index:2147483000;color:#f2f2f5;font-family:sans-serif;padding-bottom:40px}',
'body.evo-home-on>*:not(#evo-home):not(#evo-top):not(#evo-drawer):not(#evo-search):not(#evo-prog):not(#evo-msg){display:none!important}',
'.ev-hero,.ev-det{position:relative;overflow:hidden;background:#000}.ev-hero{height:56vh;min-height:260px}',
'.ev-hero>img,.ev-det>img.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.ev-det>img.bg{filter:blur(6px) brightness(.5);transform:scale(1.05)}',
'.ev-hero .sh{position:absolute;inset:0;background:linear-gradient(90deg,#0b0b10 5%,transparent 75%),linear-gradient(0deg,#0b0b10,transparent 50%)}',
'.ev-hero .tx{position:absolute;left:4%;bottom:10%;max-width:60%}.ev-hero h1{font-size:clamp(22px,4vw,44px);margin:6px 0}',
'.ev-g,.ev-m{font-size:13px;color:#cfcfda;margin:4px 0}.ev-hero p,.ev-det p{color:#cfcfda;font-size:clamp(12px,1.5vw,16px);max-height:5em;overflow:hidden;margin:8px 0 14px}',
'.ev-watch{display:inline-block;background:#e50914;color:#fff;padding:12px 26px;border:0;border-radius:8px;font-weight:700;font-size:16px;text-decoration:none}',
'.ev-dots{position:absolute;right:4%;bottom:6%;display:flex;gap:6px}.ev-dots i{width:9px;height:9px;border-radius:50%;background:#fff5}.ev-dots i.on{background:#e50914}',
'.ev-det .inf{position:relative;display:flex;gap:22px;padding:26px 4%}.ev-det .poster{width:clamp(110px,18vw,220px);border-radius:10px;align-self:flex-start}.ev-det h1{margin:0 0 6px;font-size:clamp(22px,3.5vw,38px)}',
'.ev-sec{padding:6px 4% 14px}.ev-sec h2{font-size:20px;margin:14px 0 10px;color:#fff}.ev-sec h2 a{color:#fff;text-decoration:none;display:inline-block;padding:2px 6px}',
'.ev-row{display:flex;gap:14px;overflow-x:auto;padding:4px 2px 8px;scrollbar-width:none}.ev-row::-webkit-scrollbar{display:none}.ev-row .ev-card{flex:0 0 150px}',
'.ev-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:14px}',
'a.ev-card{display:block;color:#fff;text-decoration:none}.ev-img{aspect-ratio:2/3;background:#22222e;border-radius:8px;overflow:hidden}.ev-img img{width:100%;height:100%;object-fit:cover}',
'.ev-t{font-size:13px;margin-top:6px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ev-s{font-size:11px;color:#9a9aab;height:14px;overflow:hidden}',
'.ev-ch{display:inline-block;margin:4px;padding:10px 16px;background:#22222e;color:#fff;border-radius:8px;border:0;font-size:15px;text-decoration:none}.ev-ch.on{background:#e50914}',
'.ev-btt{display:block;margin:24px auto;padding:12px 28px;background:#22222e;color:#fff;border:0;border-radius:999px;font-size:15px}',
'#evo-prog{position:fixed;inset:0;z-index:2147483300;background:#000;display:none;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-family:sans-serif;pointer-events:none}',
'#evo-prog .bar{width:min(70vw,520px);height:10px;background:#333;border-radius:6px;overflow:hidden;margin:18px 0}#evo-prog i{display:block;height:100%;width:0;background:#e50914;transition:width .6s}#evo-prog h2{margin:0;font-size:22px}#evo-prog .st{color:#9a9aab;font-size:14px}',
'#evo-msg{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:2147483400;background:#000d;color:#fff;padding:20px 28px;border-radius:12px;font:18px sans-serif;display:none;text-align:center;max-width:80vw}',
'.evo-fs{position:fixed!important;top:0!important;left:0!important;width:100vw!important;height:100vh!important;max-width:none!important;max-height:none!important;z-index:2147483200!important;background:#000!important;border:0!important;margin:0!important;transform:none!important;outline:none!important}',
'.evo-anc{transform:none!important;filter:none!important;overflow:visible!important;contain:none!important;perspective:none!important}',
'html.evo-fs-on #evo-top{display:none!important}html.evo-fs-on,html.evo-fs-on body{overflow:hidden!important}'
].join('');
(function(){var s=D.createElement('style');s.textContent=CSS;(D.head||D.documentElement).appendChild(s)})();
W.open=function(){return null};
D.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[target=_blank]');if(a&&a.hostname===L.hostname)a.target='_self'},true);
function isText(e){return (e.tagName==='INPUT'&&!/^(checkbox|radio|button|submit|reset|image|file|range|color)$/i.test(e.type))||e.tagName==='TEXTAREA'}
D.addEventListener('focusin',function(e){if(isText(e.target))try{A.setEditing(true)}catch(x){}},true);
D.addEventListener('focusout',function(e){if(isText(e.target))try{A.setEditing(false)}catch(x){}},true);

// ================= helpers =================
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function h(tag,cls,html,at){var e=D.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;for(var k in (at||{}))e.setAttribute(k,at[k]);return e}
function hide(e){if(e&&!e.__h){e.__h=1;e.style.setProperty('display','none','important')}}
function evoUi(e){return e.closest&&e.closest('#evo-top,#evo-drawer,#evo-home,#evo-search,#evo-prog,#evo-msg')}
function lab(e){return ((e.getAttribute&&e.getAttribute('title'))||e.textContent||'').trim().replace(/\s+/g,' ')}
function same(a){return a.hostname.replace(/^www\./,'')===L.hostname.replace(/^www\./,'')}
function okUrl(s){return !!s&&!/^data:/.test(s)&&(/^(https?:)?\/\//.test(s)||/^\/[^\/]/.test(s))}
function srcOf(el){
  if(!el||!el.getAttribute)return '';
  var s=el.currentSrc||el.getAttribute('src')||'';if(okUrl(s))return s;
  var k=['data-src','data-original','data-lazy-src','data-bg','data-image','data-poster'];
  for(var i=0;i<k.length;i++){s=el.getAttribute(k[i]);if(okUrl(s))return s}
  var m=(el.getAttribute('style')||'').match(/url\(["']?([^"')]+)/);if(m&&okUrl(m[1]))return m[1];
  var ss=el.getAttribute('srcset');if(ss){s=ss.split(',')[0].trim().split(' ')[0];if(okUrl(s))return s}
  return '';
}
function leaf(rx){return [].filter.call(D.querySelectorAll('h1,h2,h3,h4,h5,h6,p,span,div,button,a,li,strong,b,label,small'),function(e){return e.children.length<=3&&e.textContent.length<160&&rx.test(e.textContent.trim())&&!evoUi(e)})}
function vis(e){var r=e.getBoundingClientRect();if(r.width<6||r.height<6)return false;var s=getComputedStyle(e);return s.visibility!=='hidden'&&s.display!=='none'&&parseFloat(s.opacity)>0.05&&!e.disabled}
function big(e){var r=e.getBoundingClientRect();return r.width>300&&r.height>150}
function isPl(e){return (e.tagName==='VIDEO'||e.tagName==='IFRAME')&&big(e)}
function player(){var l=[].filter.call(D.querySelectorAll('iframe,video'),function(e){return big(e)&&!evoUi(e)});l.sort(function(a,b){return b.offsetWidth*b.offsetHeight-a.offsetWidth*a.offsetHeight});return l[0]}
function clickEl(e){try{['mousedown','mouseup','click'].forEach(function(t){e.dispatchEvent(new MouseEvent(t,{bubbles:true,cancelable:true,view:W}))})}catch(x){try{e.click()}catch(y){}}}
function sget(k){try{return sessionStorage.getItem(k)}catch(e){return null}}
function sset(k,v){try{if(v==null)sessionStorage.removeItem(k);else sessionStorage.setItem(k,v)}catch(e){}}

// ================= spatial navigation =================
var cur=null,pane=null,OVL=null,fs=null;
function scopes(){if(pane)return [pane];if(OVL)return [D.getElementById('evo-top'),OVL];return [D.body]}
function cands(){
  var l=[];scopes().forEach(function(r){[].forEach.call(r.querySelectorAll(SEL),function(e){if(l.indexOf(e)<0&&vis(e))l.push(e)})});
  return l.filter(function(e){if(e.tagName==='IFRAME'&&!big(e))return false;return !l.some(function(o){return o!==e&&e.contains(o)&&o.tagName!=='IFRAME'&&o.tagName!=='VIDEO'})});
}
function setF(e){
  if(cur)cur.classList.remove('tv-focus');
  cur=e;e.classList.add('tv-focus');
  if(e.scrollIntoView)e.scrollIntoView({block:'center',inline:'center'});
  var t=e.tagName;if(t!=='IFRAME'&&t!=='VIDEO'&&t!=='INPUT'&&t!=='TEXTAREA'&&t!=='SELECT'){try{e.focus({preventScroll:true})}catch(x){}}
}
function inView(e){var r=e.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth}
var heroI=0,slides=[],heroEl=null;
function move(dir){
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
  if(dir==='down'||dir==='up'){var sc2=OVL||W;sc2.scrollBy(0,dir==='down'?innerHeight*0.7:-innerHeight*0.7)}
  return 'ok';
}
function ok(){
  if(!cur)return move('down');
  if(isText(cur)){cur.focus();A.showKeyboard();return 'ok'}
  cur.click();return 'ok';
}
W.__tvNav=function(d){try{
  if(PL.busy)return 'ok';
  if(fs)return fsKey(d);
  return d==='ok'?ok():move(d);
}catch(e){return 'err'}};

// ================= fullscreen player =================
function enterFs(p){
  if(fs===p)return;fs=p;var a=p.parentElement;while(a&&a!==D.body){a.classList.add('evo-anc');a=a.parentElement}
  p.classList.add('evo-fs');D.documentElement.classList.add('evo-fs-on');A.setImmersive(true);
}
function clearFs(){[].forEach.call(D.querySelectorAll('.evo-anc'),function(e){e.classList.remove('evo-anc')});D.documentElement.classList.remove('evo-fs-on');A.setImmersive(false)}
function exitFs(pause){
  if(!fs)return;var p=fs;fs=null;
  if(pause)cmd({c:'pause'});
  clearFs();p.classList.remove('evo-fs');
  var pb=D.getElementById('evo-play');if(pb)setF(pb);else if(!OVL&&D.contains(p))setF(p);
}
function ensureFs(){
  if(fs&&!D.contains(fs)){fs=null;clearFs()}
  if(!fs){var p=player();if(p)enterFs(p)}
}
function fsKey(d){
  if(d==='ok'){cmd({c:'toggle'});setTimeout(function(){showInd(anyPaused()?'\u23F8':'\u25B6')},400)}
  else if(d==='right')W.__tvOptions();
  else if(d==='left'){cmd({c:'seek',d:-10});showInd('\u23EA 10s')}
  return 'ok';
}
function showInd(t){var m=D.getElementById('evo-msg');m.textContent=t;m.style.display='block';clearTimeout(showInd.t);showInd.t=setTimeout(function(){m.style.display='none'},900)}
function showMsg(t,ms){var m=D.getElementById('evo-msg');m.textContent=t;m.style.display='block';clearTimeout(showInd.t);showInd.t=setTimeout(function(){m.style.display='none'},ms||3500)}

// ================= scanners (site-agnostic) =================
function isCard(a){
  if(evoUi(a))return false;var hr=a.getAttribute('href');if(!hr||hr.charAt(0)==='#'||/^(javascript|mailto|tel):/i.test(hr))return false;
  if(!same(a)||a.closest('header,nav,footer'))return false;
  return !!a.querySelector('img,[data-src],[data-bg],[style*="background-image"]');
}
function cardInfo(a){
  var im=a.querySelector('img'),srcEl=im||a.querySelector('[data-src],[data-bg],[style*="background-image"]');
  var t=(a.getAttribute('title')||(im&&im.getAttribute('alt'))||'').trim();
  var te=a.querySelector('h1,h2,h3,h4,h5,[class*=title i],[class*=name i]');
  if(te&&te.textContent.trim())t=te.textContent.trim().replace(/\s+/g,' ');
  var tx=(a.innerText||a.textContent||'').replace(/\s+/g,' ').trim();
  if(!t)t=tx.slice(0,40);
  return {href:a.href,title:t,sub:tx.split(t).join(' ').replace(/\s+/g,' ').trim().slice(0,32),srcEl:srcEl};
}
function scanSections(excl){
  excl=excl||[];
  var cards=[].filter.call(D.querySelectorAll('a[href]'),function(a){return isCard(a)&&!excl.some(function(x){return x.contains(a)})});
  var set=new Set(cards),groups=[];
  function cardsIn(g){var m={},o=[];[].forEach.call(g.querySelectorAll('a[href]'),function(x){if(set.has(x)&&!m[x.href]){m[x.href]=1;o.push(x)}});return o}
  cards.forEach(function(a){
    if(groups.some(function(g){return g.el.contains(a)}))return;
    var g=a.parentElement,l=[];
    while(g&&g!==D.body){l=cardsIn(g);if(l.length>=4)break;g=g.parentElement}
    if(!g||g===D.body||l.length<4)return;
    groups.push({el:g,cards:l.map(cardInfo)});
  });
  var heads=[].filter.call(D.querySelectorAll('h1,h2,h3,h4,h5,[class*=title i],[class*=heading i]'),function(e){
    var t=e.textContent.trim();if(t.length<3||t.length>40||evoUi(e)||e.querySelector('img'))return false;
    if(groups.some(function(g){return g.el.contains(e)})||excl.some(function(x){return x.contains(e)}))return false;
    var ca=e.closest('a[href]');if(ca&&isCard(ca))return false;
    return !e.closest('header,nav,footer');
  });
  var seen={},out=[];
  groups.forEach(function(g){
    var best=null;heads.forEach(function(e){if((e.compareDocumentPosition(g.el)&4)&&!e.contains(g.el))best=e});
    var t=best?best.textContent.replace(/\s+/g,' ').replace(/\b(view all|see all|view more|more)\b.*$/i,'').trim():'';
    if(!t)t='More to watch';
    var url='';
    if(best){
      var ha=best.closest('a[href]')||best.querySelector('a[href]');
      if(!ha){var par=best.parentElement;for(var i=0;i<3&&par&&!ha;i++){ha=[].filter.call(par.querySelectorAll('a[href]'),function(x){return /view|all|more|see/i.test(x.textContent)&&!isCard(x)})[0];par=par.parentElement}}
      if(ha&&same(ha)&&ha.getAttribute('href').charAt(0)!=='#')url=ha.href;
    }
    var key=t.toLowerCase();if(seen[key])return;seen[key]=1;
    out.push({title:t,url:url,items:g.cards.slice(0,40)});
  });
  return out.slice(0,12);
}
function scanHero(){
  var cs=[].filter.call(D.querySelectorAll('[class*=slide i],[class*=hero i],[class*=banner i],[class*=feature i],[class*=carousel i],[class*=spotlight i]'),function(e){
    return !evoUi(e)&&!e.closest('header,nav,footer')&&e.querySelector('a[href]')&&e.querySelector('img,[style*="background-image"],[data-bg]')});
  var lf=cs.filter(function(e){return !cs.some(function(o){return o!==e&&e.contains(o)})});
  var out=[],seen={};
  lf.forEach(function(e){
    var as=[].filter.call(e.querySelectorAll('a[href]'),function(a){return same(a)&&a.getAttribute('href').charAt(0)!=='#'});if(!as.length)return;
    var a=as.filter(function(x){return /watch|play|detail|info|view|open/i.test(x.textContent)})[0]||as[0];
    if(seen[a.href])return;
    var im=e.querySelector('img')||e.querySelector('[style*="background-image"],[data-bg]');
    var te=e.querySelector('h1,h2,h3,h4,[class*=title i],[class*=name i]'),t=te?te.textContent.trim().replace(/\s+/g,' '):((im&&im.getAttribute&&im.getAttribute('alt'))||'').trim();
    if(!t||t.length>90)return;seen[a.href]=1;
    var tx=(e.innerText||e.textContent||'').replace(/\s+/g,' '),m=tx.match(/IMDb\s*[\d.]+(?:\s+(?:HD|CAM|SD|TS))?(?:\s+\d+ ?min)?(?:\s+(?:19|20)\d{2})?/);
    var p=[].filter.call(e.querySelectorAll('p'),function(x){return x.textContent.trim().length>50})[0];
    out.push({href:a.href,title:t,srcEl:im,desc:p?p.textContent.trim():'',meta:m?m[0]:'',genres:[].map.call(e.querySelectorAll('a[href*=genre i]'),function(g){return g.textContent.trim()}).slice(0,3).join(' \u2022 '),el:e});
  });
  return out.length<=20?out:[];
}
function scanMenu(){
  var fc=[].filter.call(D.querySelectorAll('a[href]'),isCard)[0],best=null,bc=0;
  [].forEach.call(D.querySelectorAll('nav,header,[class*=menu i],[class*=nav i],[id*=menu i],[id*=nav i]'),function(c){
    if(evoUi(c)||c.closest('footer'))return;
    if(fc&&!(c.compareDocumentPosition(fc)&4)&&!c.contains(fc))return;
    var n=[].filter.call(c.querySelectorAll('a[href]'),function(a){var t=a.textContent.trim();return t&&t.length<=28&&same(a)&&!isCard(a)}).length;
    if(n>=3&&n<=80&&n>bc){best=c;bc=n}
  });
  var out=[],seen={};
  function ent(a){return {text:a.textContent.trim().replace(/\s+/g,' '),href:a.href}}
  function push(o){var k=(o.href||'')+o.text;if(!o.text||seen[k]||/^(log ?in|sign|register)/i.test(o.text))return;seen[k]=1;out.push(o)}
  if(!best)return out;
  var ul=best.querySelector('ul'),lis=ul?[].filter.call(ul.children,function(x){return x.tagName==='LI'}):[];
  if(lis.length>=3){
    lis.forEach(function(li){
      var sub=li.querySelector('ul,[class*=dropdown i],[class*=sub i]');
      var subs=sub?[].filter.call(sub.querySelectorAll('a[href]'),function(a){return a.textContent.trim()&&same(a)}):[];
      var hd=[].filter.call(li.querySelectorAll('a,span,button'),function(x){return !(sub&&sub.contains(x))&&x.textContent.trim()})[0];
      if(!hd)return;var t=hd.textContent.trim().replace(/\s+/g,' ');
      if(subs.length>=2)push({text:t,children:subs.map(ent)});
      else if(hd.tagName==='A'&&hd.getAttribute('href')&&hd.getAttribute('href').charAt(0)!=='#'&&same(hd))push(ent(hd));
    });
  }
  if(out.length<3){out=[];seen={};[].forEach.call(best.querySelectorAll('a[href]'),function(a){if(same(a)&&a.getAttribute('href').charAt(0)!=='#'&&a.textContent.trim().length<=28&&!isCard(a))push(ent(a))})}
  return out;
}
function hasSearch(){return !!D.querySelector('input[type=search],input[name=q],input[name=keyword],input[name=s],form[action*=search i]')}
function playLink(){return [].filter.call(D.querySelectorAll('a[href]'),function(a){return !evoUi(a)&&same(a)&&/^\W*(watch|play|stream)\b/i.test(lab(a))&&!/[?&]e=|episode/i.test(a.href)&&!isCard(a)})[0]}
function scanDetail(){
  var h1=[].filter.call(D.querySelectorAll('h1'),function(e){return !evoUi(e)&&e.textContent.trim()})[0];
  var meta=function(q){return ((D.querySelector(q)||{}).content||'').trim()};
  var title=h1?h1.textContent.trim().replace(/\s+/g,' '):(meta('meta[property="og:title"]')||D.title);
  var poster=meta('meta[property="og:image"]'),dm=meta('meta[property="og:description"]')||meta('meta[name=description]');
  var p=[].filter.call(D.querySelectorAll('p'),function(x){return !evoUi(x)&&!x.closest('footer')&&x.textContent.trim().length>80})[0];
  var tx=((D.querySelector('main')||D.body).innerText||D.body.textContent||'').replace(/\s+/g,' ').slice(0,3000);
  var mm=[(tx.match(/IMDb\s*[\d.]+/)||[''])[0],(tx.match(/\b(19|20)\d{2}\b/)||[''])[0],(tx.match(/\d+ ?min\b/)||[''])[0]].filter(Boolean).join('  \u2022  ');
  var inCards=function(e){var a=e.closest('a[href]');return a&&isCard(a)};
  var els=[].filter.call(D.querySelectorAll('a,button,li,[role=button]'),function(e){return !evoUi(e)&&!e.querySelector('a,button,li')&&lab(e).length<=70&&!inCards(e)&&!e.closest('header,nav,footer')});
  function act(e){return /active|current|selected/i.test(e.className||'')||e.getAttribute('aria-selected')==='true'||e.getAttribute('aria-current')}
  function uniq(l){var m={};return l.filter(function(e){var k=lab(e);if(m[k])return false;m[k]=1;return true})}
  var seasons=uniq(els.filter(function(e){return /^(season|s)\s*\.?\s*\d+$/i.test(lab(e))}));
  var eps=uniq(els.filter(function(e){return /^(e|ep|episode)\s*\.?\s*\d+\b/i.test(lab(e))}));
  if(!eps.length){var hd=leaf(/^episodes?$/i)[0];if(hd){var c=hd;while(c&&c!==D.body){var n=[].filter.call(c.querySelectorAll('a,button,li'),function(e){return /^\d{1,3}$/.test(lab(e))});if(n.length>=3){eps=uniq(n);break}c=c.parentElement}}}
  return {title:title,poster:poster,desc:(p&&p.textContent.trim().length>80)?p.textContent.trim():dm,meta:mm,
    genres:uniq([].filter.call(D.querySelectorAll('a[href*=genre i]'),function(a){return !evoUi(a)&&!a.closest('header,nav,footer')})).map(lab).slice(0,4).join(' \u2022 '),
    seasons:seasons.map(function(e){return {t:lab(e),e:e,on:act(e)}}),eps:eps.map(function(e){return {t:lab(e).replace(/^E(\d+)\s*\u00B7\s*/i,'$1. ').slice(0,40),e:e,on:act(e)}})};
}
var SRVKEY=/^(servers?|sources?)$/i;
function gatherServers(){
  if(PL.srv&&PL.srv.length&&PL.srv.every(function(e){return D.contains(e)}))return PL.srv;
  var res=[];
  var l=leaf(SRVKEY)[0];
  if(l){var c=l;while(c&&c!==D.body){var n=[].filter.call(c.querySelectorAll('button,li,a,[role=button],[data-id]'),function(e){return e!==l&&!e.querySelector('button,li,a')&&e.textContent.trim()&&e.textContent.trim().length<30});if(n.length>=2&&!c.querySelector('iframe,video')){res=n;break}c=c.parentElement}}
  if(!res.length){var best=[];[].forEach.call(D.querySelectorAll('[class*=server i],[id*=server i]'),function(c){if(evoUi(c))return;var n=[].filter.call(c.querySelectorAll('button,li,a,[role=button],[data-id]'),function(e){return !e.querySelector('button,li,a')&&e.textContent.trim()&&e.textContent.trim().length<30});if(n.length>=2&&n.length<=40&&n.length>best.length)best=n});res=best}
  var m={};res=res.filter(function(e){var k=lab(e);if(m[k])return false;m[k]=1;return true});
  PL.srv=res;return res;
}

// ================= UI: top bar, menu, search =================
var IM=[];
function refreshImgs(){IM.forEach(function(p){var s=srcOf(p.s);if(s&&p.m.getAttribute('src')!==s)p.m.src=s});heroImg()}
function openPane(p){closePane();pane=p;p.classList.add('open');if(p.id==='evo-drawer')fillMenu();if(p.id==='evo-search'){var q=D.getElementById('evo-q');setF(q);q.focus();A.showKeyboard()}else{var f=p.querySelector('a,summary');if(f)setF(f)}}
function closePane(){if(pane){pane.classList.remove('open');pane=null;if(cur&&!D.contains(cur))cur=null}}
function togglePane(p){if(pane===p)closePane();else openPane(p)}
function fillMenu(){
  var dr=D.getElementById('evo-drawer');if(dr.__f)return;
  var m=W.__evoMenu||scanMenu();if(m.length)W.__evoMenu=m;
  var html='<a href="#" id="evo-ms">\uD83D\uDD0D Search</a><a href="'+esc(L.origin+norm(A.startPath()))+'">\u2302 Home</a>';
  m.forEach(function(x){
    if(x.children)html+='<details><summary>'+esc(x.text)+'</summary>'+x.children.map(function(c){return '<a href="'+esc(c.href)+'">'+esc(c.text)+'</a>'}).join('')+'</details>';
    else html+='<a href="'+esc(x.href)+'">'+esc(x.text)+'</a>';
  });
  dr.innerHTML=html;dr.__f=1;
  D.getElementById('evo-ms').onclick=function(e){e.preventDefault();openPane(D.getElementById('evo-search'))};
}
function doSearch(q){
  if(!q)return;
  var inp=[].filter.call(D.querySelectorAll('input'),function(i){return !i.closest('#evo-search')&&/search|keyword|^q$|^s$/i.test((i.name||'')+' '+(i.placeholder||'')+' '+i.type)})[0];
  if(inp&&inp.form&&(inp.form.method||'get').toLowerCase()==='get'){var u=new URL(inp.form.action||L.href,L.href);u.searchParams.set(inp.name||'keyword',q);L.href=u.href;return}
  if(inp){inp.value=q;inp.dispatchEvent(new Event('input',{bubbles:true}));inp.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',keyCode:13,bubbles:true}));if(inp.form&&inp.form.requestSubmit)inp.form.requestSubmit();return}
  L.href='/search?keyword='+encodeURIComponent(q);
}
function buildChrome(){
  if(D.getElementById('evo-top')||!D.body)return;
  var top=h('div',null,'<button class="ev-ib" id="evo-burger">\u2630</button><div class="ev-logo"><b>EVO</b> Stream</div><button class="ev-ib" id="evo-gear">\u2699</button>',{id:'evo-top'});
  var dr=h('div',null,'',{id:'evo-drawer'});
  var se=h('form',null,'<input id="evo-q" type="search" placeholder="Search movies &amp; TV shows" enterkeyhint="search" autocomplete="off">',{id:'evo-search'});
  var pr=h('div',null,'<h2>Getting your video ready\u2026</h2><div class="bar"><i></i></div><div class="st"></div>',{id:'evo-prog'});
  D.body.appendChild(top);D.body.appendChild(dr);D.body.appendChild(se);D.body.appendChild(pr);D.body.appendChild(h('div',null,'',{id:'evo-msg'}));
  D.getElementById('evo-burger').onclick=function(){togglePane(dr)};
  D.getElementById('evo-gear').onclick=function(){A.openSettings()};
  se.addEventListener('submit',function(e){e.preventDefault();doSearch(D.getElementById('evo-q').value.trim())});
}

// ================= overlay pages =================
function ovl(){var o=D.getElementById('evo-home');if(o)o.remove();o=h('div',null,null,{id:'evo-home'});D.body.appendChild(o);OVL=o;return o}
function mkCard(it){var a=h('a','ev-card','<div class="ev-img"><img alt=""></div><div class="ev-t">'+esc(it.title)+'</div><div class="ev-s">'+esc(it.sub)+'</div>',{href:it.href});IM.push({m:a.querySelector('img'),s:it.srcEl});return a}
function mkSection(s){
  var sec=h('section','ev-sec',s.url?'<h2><a href="'+esc(s.url)+'">'+esc(s.title)+' \u203A</a></h2>':'<h2>'+esc(s.title)+'</h2>'),row=h('div','ev-row');
  s.items.slice(0,16).forEach(function(it){row.appendChild(mkCard(it))});sec.appendChild(row);return sec;
}
function addBtt(o){var b=h('button','ev-btt','\u2191 Back to top');b.onclick=function(){o.scrollTop=0;var f=cands()[0];if(f)setF(f)};o.appendChild(b)}
function heroImg(){if(!heroEl||!slides.length)return;var s=srcOf(slides[heroI].srcEl),i=heroEl.querySelector('img');if(s&&i.getAttribute('src')!==s)i.src=s}
function showHero(i){
  var s=slides[i],e=heroEl;e.querySelector('h1').textContent=s.title;e.querySelector('.ev-g').textContent=s.genres;e.querySelector('.ev-m').textContent=s.meta;e.querySelector('p').textContent=s.desc;
  e.querySelector('.ev-watch').href=s.href;[].forEach.call(e.querySelectorAll('.ev-dots i'),function(d,k){d.className=k===i?'on':''});
  e.querySelector('img').removeAttribute('src');heroImg();
}
function heroStep(d){if(slides.length<2)return;heroI=(heroI+d+slides.length)%slides.length;showHero(heroI)}
function prime(hideOrig){
  var y=0,H=Math.max(D.body.scrollHeight,3000);
  var t=setInterval(function(){try{W.scrollTo(0,y)}catch(e){}y+=innerHeight*0.8;if(y>H){clearInterval(t);try{W.scrollTo(0,0)}catch(e){}refreshImgs();
    setTimeout(function(){refreshImgs();if(hideOrig)D.body.classList.add('evo-home-on');var n=0,r=setInterval(function(){refreshImgs();if(++n>6)clearInterval(r)},2000)},1200)}},180);
}
function buildHome(scan){
  var o=ovl();slides=scan.hero;
  if(slides.length){heroEl=h('div','ev-hero','<img alt=""><div class="sh"></div><div class="tx"><div class="ev-g"></div><h1></h1><div class="ev-m"></div><p></p><a class="ev-watch" id="evo-watch" href="#">\u25B6 Open</a></div><div class="ev-dots">'+slides.map(function(){return '<i></i>'}).join('')+'</div>');o.appendChild(heroEl);showHero(0)}
  scan.secs.forEach(function(s){o.appendChild(mkSection(s))});
  addBtt(o);
  var f=D.getElementById('evo-watch')||o.querySelector('a');if(f)setF(f);prime(true);
}
function buildList(secs){
  var o=ovl(),h1=[].filter.call(D.querySelectorAll('h1'),function(e){return !evoUi(e)&&e.textContent.trim()})[0];
  var title=h1?h1.textContent.trim():D.title,html='<section class="ev-sec"><h2>'+esc(title)+'</h2><div class="ev-grid"></div></section>';
  o.innerHTML=html;var g=o.querySelector('.ev-grid'),seen={};
  secs.forEach(function(s){s.items.forEach(function(it){if(!seen[it.href]){seen[it.href]=1;g.appendChild(mkCard(it))}})});
  var pg=D.querySelector('[class*=pagin i],nav[aria-label*=pagin i],ul.pagination'),links=pg?[].filter.call(pg.querySelectorAll('a[href]'),function(a){return same(a)&&a.textContent.trim()&&a.getAttribute('href').charAt(0)!=='#'}):[];
  var nx=D.querySelector('a[rel=next]');if(nx&&links.indexOf(nx)<0)links.push(nx);
  if(links.length){var sec=h('section','ev-sec','<h2>Pages</h2>');links.slice(0,14).forEach(function(a){sec.appendChild(h('a','ev-ch',esc(a.textContent.trim().slice(0,12)||'Next'),{href:a.href}))});o.appendChild(sec)}
  addBtt(o);var f=o.querySelector('a');if(f)setF(f);prime(true);
}
function buildDetail(){
  var d=scanDetail(),o=ovl(),link=playLink();PL.link=link?link.href:'';
  var secs=scanSections().filter(function(s){return !/episode|season|comment/i.test(s.title)}).slice(0,3);
  o.innerHTML='<div class="ev-det">'+(d.poster?'<img class="bg" alt="" src="'+esc(d.poster)+'">':'')+'<div class="inf">'+(d.poster?'<img class="poster" alt="" src="'+esc(d.poster)+'">':'')+'<div><h1>'+esc(d.title)+'</h1><div class="ev-m">'+esc(d.meta)+'</div><div class="ev-g">'+esc(d.genres)+'</div><p>'+esc(d.desc)+'</p><button class="ev-watch" id="evo-play">\u25B6 Play</button></div></div></div>';
  D.getElementById('evo-play').onclick=startPlay;
  if(d.seasons.length||d.eps.length)buildEps(o,d);
  secs.forEach(function(s){o.appendChild(mkSection(s))});
  addBtt(o);setF(D.getElementById('evo-play'));
}
function buildEps(o,d){
  var old=o.querySelector('.ev-eps');if(old)old.remove();
  var sec=h('section','ev-sec ev-eps','');
  if(d.seasons.length){sec.appendChild(h('h2',null,'Seasons'));d.seasons.forEach(function(s){var b=h('button','ev-ch'+(s.on?' on':''),esc(s.t));b.onclick=function(){clickEl(s.e);setTimeout(rescanEps,1500)};sec.appendChild(b)})}
  if(d.eps.length){sec.appendChild(h('h2',null,'Episodes'));d.eps.forEach(function(x){var b=h('button','ev-ch'+(x.on?' on':''),esc(x.t));b.onclick=function(){sset('evo_auto','1');clickEl(x.e);setTimeout(function(){rescanEps();startPlay(true)},1500)};sec.appendChild(b)})}
  var det=o.querySelector('.ev-det');det.parentNode.insertBefore(sec,det.nextSibling);
}
function rescanEps(){if(!OVL)return;var d=scanDetail();if(d.seasons.length||d.eps.length){var c=cur&&cur.id;buildEps(OVL,d);var pb=D.getElementById('evo-play');if(pb&&!c)setF(pb)}}

// ================= playback =================
var PL={run:0,busy:false,ready:false,frames:{},srv:null,link:''},TMO=16000;
function cmd(o){try{A.frameCmd(JSON.stringify(o))}catch(e){}}
function subsPref(){return A.pref('subsOff')!=='0'}
W.__evoFrameMsg=function(s){var o;try{o=JSON.parse(s)}catch(e){return}var f=PL.frames[o.f]=PL.frames[o.f]||{};if(o.t==='v')f.v=o;else if(o.t==='subs')f.subs=o.list;else if(o.t==='err')f.err=1};
function anyPaused(){for(var k in PL.frames){var v=PL.frames[k].v;if(v&&v.rs>=2)return v.p}return false}
function showProg(){var p=D.getElementById('evo-prog');p.style.display='flex';PL.busy=true}
function prog(pct,txt){var p=D.getElementById('evo-prog');p.querySelector('i').style.width=Math.round(pct)+'%';if(txt)p.querySelector('.st').textContent=txt}
function hideProg(){var p=D.getElementById('evo-prog');p.style.display='none';PL.busy=false}
function check(dt){
  var any=false,err=false;
  for(var k in PL.frames){var f=PL.frames[k],v=f.v;if(f.err)err=true;if(!v)continue;any=true;if(v.e)err=true;
    if(!v.p&&v.rs>=3&&v.ct>0.4){if(f.pc!=null&&v.ct>f.pc+0.15)return 'ok';f.pc=v.ct}else f.pc=v.ct}
  if((!any||!A.agentOk())&&dt>6500&&A.audioActive())return 'ok';
  return err?'err':'';
}
function startPlay(auto){
  if(PL.ready&&!auto){var p=player()||fs;if(p){enterFs(p);cmd({c:'play'})}return}
  var has=!!player()||gatherServers().length>0;
  if(!has&&PL.link){sset('evo_auto','1');L.href=PL.link;return}
  if(!has){showMsg('Sorry, this title cannot be played right now.',4000);return}
  runFlow(0,{});
}
function runFlow(start,opts){
  opts=opts||{};var token=++PL.run;PL.ready=false;PL.srv=null;showProg();prog(3,'Preparing\u2026');
  var servers=gatherServers(),n=Math.max(servers.length,1),k0=opts.k||0,tries=0,idx=start||0;
  function fail(){hideProg();exitFs(true);sset('evo_ap',null);showMsg('Sorry, this title cannot be played right now.',5000)}
  function success(){PL.ready=true;sset('evo_ap',null);prog(100,'Ready');if(subsPref())cmd({c:'subs',v:-1});setTimeout(hideProg,350)}
  function attempt(){
    if(token!==PL.run)return;
    if(tries+k0>=n){fail();return}
    PL.frames={};var i=idx%n,t0=Date.now(),tapped=0;
    if(servers.length){sset('evo_ap',JSON.stringify({i:i,ts:Date.now(),k:tries+k0}));if(!(opts.resume&&tries===0))clickEl(servers[i])}
    var iv=setInterval(function(){
      if(token!==PL.run){clearInterval(iv);return}
      var dt=Date.now()-t0;ensureFs();
      cmd({c:'play'});if(subsPref())cmd({c:'subs',v:-1});
      var st=check(dt);
      prog(Math.min(96,8+(tries+k0)/n*50+Math.min(dt/TMO,1)*35),dt<5000?'Loading player\u2026':'Buffering\u2026');
      if(st==='ok'){clearInterval(iv);success()}
      else if(st==='err'||dt>TMO){clearInterval(iv);tries++;idx++;attempt()}
      else if(dt>5000&&!tapped){tapped=1;A.tap(innerWidth/2,innerHeight/2,0)}
    },700);
  }
  attempt();
}

// ================= options / bridge entry points =================
W.__tvOptions=function(){
  if(!fs){A.openSettings();return}
  cmd({c:'subs',v:'list'});
  setTimeout(function(){
    var els=[],out=[];
    function add(name,items){if(!items.length)return;var it=[];items.forEach(function(x){els.push(x.f);it.push({i:els.length-1,t:x.t})});out.push({name:name,items:it})}
    var subs=[{t:'Off',f:function(){cmd({c:'subs',v:-1})}}];
    for(var k in PL.frames){(PL.frames[k].subs||[]).forEach(function(s){subs.push({t:s.label,f:function(){cmd({c:'subs',v:s.i})}})})}
    add('Subtitles',subs);
    var srv=gatherServers();
    add('Servers',srv.map(function(e,i){return {t:lab(e)||('Server '+(i+1)),f:function(){runFlow(i,{})}}}));
    add('Playback',[{t:'Play / Pause',f:function(){cmd({c:'toggle'})}},{t:'Back 10 seconds',f:function(){cmd({c:'seek',d:-10})}},{t:'Forward 10 seconds',f:function(){cmd({c:'seek',d:10})}},{t:'Forward 60 seconds',f:function(){cmd({c:'seek',d:60})}}]);
    W.__tvEls=els;A.showOptions(JSON.stringify(out));
  },500);
};
W.__tvClick=function(i){var e=W.__tvEls&&W.__tvEls[i];if(!e)return;if(typeof e==='function')e();else clickEl(e)};
W.__evoBack=function(){
  if(PL.busy){PL.run++;hideProg();exitFs(true);sset('evo_ap',null);return true}
  if(fs){exitFs(true);return true}
  if(pane){closePane();return true}
  return false;
};
W.__evoAnalyze=function(){var s=W.__evoScan;if(!s)return JSON.stringify({ready:false});
  return JSON.stringify({ready:true,menu:s.menu.length,hero:s.hero.length,sections:s.secs.length,cards:s.secs.reduce(function(n,x){return n+x.items.length},0),search:s.search})};

// ================= cleaner (fallback pages) =================
function clean(){
  buildChrome();
  [].forEach.call(D.querySelectorAll('a[href*="api.whatsapp.com"],a[href*="t.me/share"]'),function(a){var c=a;while(c.parentElement&&c.parentElement!==D.body&&c.querySelectorAll('a').length<5)c=c.parentElement;if(!c.querySelector('iframe,video,h1,h2'))hide(c)});
  hide(D.querySelector('footer'));
}
setInterval(function(){try{[].forEach.call(D.querySelectorAll('body > *,[style*="z-index"]'),function(e){
  if(e===cur||/^(IFRAME|VIDEO)$/.test(e.tagName)||(e.id&&e.id.indexOf('evo-')===0)||e.classList.contains('evo-fs')||e.querySelector('.evo-fs'))return;
  var s=getComputedStyle(e);if(s.position!=='fixed'&&s.position!=='absolute')return;
  if((parseInt(s.zIndex)||0)<900)return;
  var r=e.getBoundingClientRect();if(r.width<innerWidth*0.8||r.height<innerHeight*0.8)return;
  if(e.querySelector('video,iframe')||(e.innerText||'').trim().length>0)return;
  e.remove();})}catch(x){}},1500);

// ================= boot =================
var T0=Date.now(),built=false;
function boot(){
  if(built)return;
  if(!D.body){setTimeout(boot,300);return}
  try{
    clean();var dt=Date.now()-T0,type=null,secs=null;
    if(HOME)type='home';
    else if(player()||gatherServers().length)type='detail';
    else{
      var h1=[].filter.call(D.querySelectorAll('h1'),function(e){return !evoUi(e)&&e.textContent.trim()})[0];
      secs=scanSections();
      if(h1&&playLink()&&secs.length<3)type='detail';else if(secs.length)type='list';
    }
    if(type==='home'){
      var hero=scanHero(),s=scanSections(hero.map(function(x){return x.el}));
      if(s.length&&(s.length>=3||dt>4000)){built=true;W.__evoScan={menu:scanMenu(),hero:hero,secs:s,search:hasSearch()};buildHome(W.__evoScan);return}
    }else if(type==='detail'&&dt>1200){
      built=true;buildDetail();
      var ap=null;try{ap=JSON.parse(sget('evo_ap')||'null')}catch(e){}
      if(ap&&Date.now()-ap.ts<45000)setTimeout(function(){runFlow(ap.i,{resume:true,k:ap.k})},800);
      else if(sget('evo_auto')==='1'){sset('evo_auto',null);setTimeout(function(){startPlay(true)},800)}
      return;
    }else if(type==='list'&&dt>2500){built=true;buildList(secs);return}
  }catch(e){}
  if(Date.now()-T0<25000)setTimeout(boot,600);
}
boot();
setInterval(function(){try{clean()}catch(e){}},8000);
})();
