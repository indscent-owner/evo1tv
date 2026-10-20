(function(){
if(window.__tvInit)return;window.__tvInit=true;
var SEL='a[href],button,input:not([type=hidden]),select,textarea,summary,[tabindex]:not([tabindex="-1"]),[onclick],[role=button],[role=link],video,iframe';
var CSS='.tv-focus{outline:4px solid #e50914!important;outline-offset:2px!important;border-radius:4px}'+
'.adsbygoogle,ins.adsbygoogle,[id^="google_ads"],iframe[src*="doubleclick"],iframe[src*="adsterra"],[class*="popunder"],[id*="popunder"]{display:none!important}';
(function(){var s=document.createElement('style');s.textContent=CSS;(document.head||document.documentElement).appendChild(s)})();
window.open=function(){return null};
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[target=_blank]');if(a&&a.hostname.indexOf('ev01')>-1)a.target='_self'},true);

function isText(e){return (e.tagName==='INPUT'&&!/^(checkbox|radio|button|submit|reset|image|file|range|color)$/i.test(e.type))||e.tagName==='TEXTAREA'}
document.addEventListener('focusin',function(e){if(isText(e.target))try{Android.setEditing(true)}catch(x){}},true);
document.addEventListener('focusout',function(e){if(isText(e.target))try{Android.setEditing(false)}catch(x){}},true);

function vis(e){var r=e.getBoundingClientRect();if(r.width<6||r.height<6)return false;var s=getComputedStyle(e);return s.visibility!=='hidden'&&s.display!=='none'&&parseFloat(s.opacity)>0.05&&!e.disabled}
function big(e){var r=e.getBoundingClientRect();return r.width>300&&r.height>150}
function isPlayer(e){return (e.tagName==='VIDEO'||e.tagName==='IFRAME')&&big(e)}
function cands(){
  var l=[].filter.call(document.querySelectorAll(SEL),vis);
  return l.filter(function(e){
    if(e.tagName==='IFRAME'&&!big(e))return false;
    return !l.some(function(o){return o!==e&&e.contains(o)&&o.tagName!=='IFRAME'&&o.tagName!=='VIDEO'});
  });
}
var cur=null;
function setF(e){
  if(cur)cur.classList.remove('tv-focus');
  cur=e;e.classList.add('tv-focus');
  e.scrollIntoView({block:'center',inline:'center'});
  var t=e.tagName;
  if(t!=='IFRAME'&&t!=='VIDEO'&&t!=='INPUT'&&t!=='TEXTAREA'&&t!=='SELECT'){try{e.focus({preventScroll:true})}catch(x){}}
}
function inView(e){var r=e.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth}

function move(dir){
  if(cur&&!document.contains(cur))cur=null;
  var all=cands();
  if(!cur){var f=all.filter(inView)[0]||all[0];if(f)setF(f);return 'ok'}
  if(dir==='down'&&isPlayer(cur)){window.__tvOptions();return 'ok'}
  var a=cur.getBoundingClientRect(),ax=a.left+a.width/2,ay=a.top+a.height/2,best=null,bs=1e18;
  all.forEach(function(e){
    if(e===cur||cur.contains(e)||e.contains(cur))return;
    var r=e.getBoundingClientRect(),dx=r.left+r.width/2-ax,dy=r.top+r.height/2-ay,p,s;
    if(dir==='left'){p=-dx;s=Math.abs(dy)}else if(dir==='right'){p=dx;s=Math.abs(dy)}
    else if(dir==='up'){p=-dy;s=Math.abs(dx)}else{p=dy;s=Math.abs(dx)}
    if(p<=4)return;
    var sc=p+2.5*s;if(sc<bs){bs=sc;best=e}
  });
  if(best){setF(best);return 'ok'}
  if(dir==='down'||dir==='up'){
    var y=scrollY;scrollBy(0,dir==='down'?innerHeight*0.7:-innerHeight*0.7);
    if(dir==='down'&&Math.abs(scrollY-y)<2&&document.querySelector('video,iframe'))window.__tvOptions();
  }
  return 'ok';
}
function ok(){
  if(!cur)return move('down');
  var t=cur.tagName;
  if(isText(cur)){cur.focus();Android.showKeyboard();return 'ok'}
  if(t==='INPUT'){cur.click();return 'ok'}
  if(t==='VIDEO'){cur.paused?cur.play():cur.pause();return 'ok'}
  if(t==='IFRAME'){var r=cur.getBoundingClientRect();return 'tap:'+(r.left+r.width/2)+','+(r.top+r.height/2)}
  cur.click();return 'ok';
}
window.__tvNav=function(d){try{return d==='ok'?ok():move(d)}catch(e){return 'err'}};

// ---- Options scanner: servers / quality / episodes / seasons ----
var RX_Q=/^(auto|\d{3,4}p?|4k|hd|sd|cam|hdrip|bluray|web-?dl)$/i;
var RX_S=/^(server|source)\s*\d*|vidcloud|upcloud|megacloud|vidplay|filemoon|streamwish|doodstream|mixdrop|\bvoe\b|vidsrc|streamtape|embed|mirror/i;
var C_S='[class*=server i],[id*=server i],[class*=source i],[id*=source i]';
var C_Q='[class*=quality i],[id*=quality i]';
var C_E='[class*=episode i],[id*=episode i],[class*=ep-list i]';
var C_N='[class*=season i],[id*=season i]';
window.__tvOptions=function(){
  var els=[].slice.call(document.querySelectorAll('a,button,li,[role=button],[onclick],[data-id]'));
  window.__tvEls=[];
  var g={Servers:[],Quality:[],Episodes:[],Seasons:[]},seen={};
  els.forEach(function(e){
    if(!vis(e))return;
    var t=(e.innerText||e.value||'').trim().replace(/\s+/g,' ');
    if(!t||t.length>40)return;
    var k=null;
    if(e.closest(C_S)||RX_S.test(t))k='Servers';
    else if(e.closest(C_Q)||RX_Q.test(t))k='Quality';
    else if(/^season\s*\d+/i.test(t)||(e.closest(C_N)&&!e.closest(C_E)))k='Seasons';
    else if(e.closest(C_E))k='Episodes';
    if(!k||g[k].length>=150||seen[k+t])return;
    seen[k+t]=1;
    window.__tvEls.push(e);
    g[k].push({i:window.__tvEls.length-1,t:t});
  });
  var out=[];Object.keys(g).forEach(function(n){if(g[n].length)out.push({name:n,items:g[n]})});
  Android.showOptions(JSON.stringify(out));
};
window.__tvClick=function(i){var e=window.__tvEls&&window.__tvEls[i];if(e){setF(e);e.click()}};

// ---- Click-hijack overlay killer ----
setInterval(function(){try{
  [].forEach.call(document.querySelectorAll('body > *,[style*="z-index"]'),function(e){
    if(e===cur)return;
    var s=getComputedStyle(e);
    if(s.position!=='fixed'&&s.position!=='absolute')return;
    if((parseInt(s.zIndex)||0)<900)return;
    var r=e.getBoundingClientRect();
    if(r.width<innerWidth*0.8||r.height<innerHeight*0.8)return;
    if(e.querySelector('video,iframe')||(e.innerText||'').trim().length>0)return;
    e.remove();
  });
}catch(x){}},1500);
})();
