(function(){
if(window.__evoAgent)return;window.__evoAgent=1;
window.open=function(){return null};
var top=false;try{top=window.top===window}catch(e){}
if(top||typeof EvoFrame==='undefined')return;
var id=Math.random().toString(36).slice(2);
function post(o){o.f=id;try{EvoFrame.postMessage(JSON.stringify(o))}catch(e){}}
function main(){var l=[].slice.call(document.querySelectorAll('video'));if(!l.length)return null;
  l.sort(function(a,b){return (b.videoWidth*b.videoHeight||b.clientWidth*b.clientHeight)-(a.videoWidth*a.videoHeight||a.clientWidth*a.clientHeight)});return l[0]}
function tracksOff(v){try{[].forEach.call(v.textTracks,function(t){if(t.mode!=='disabled')t.mode='disabled'})}catch(e){}}
function attach(v){if(v.__evo)return;v.__evo=1;
  v.addEventListener('error',function(){post({t:'err'})});
  try{v.textTracks.addEventListener('addtrack',function(){if(window.__evoSubsOff)tracksOff(v)})}catch(e){}}
function report(){var v=main();if(!v)return;attach(v);
  post({t:'v',p:v.paused,ct:v.currentTime,d:v.duration||0,rs:v.readyState,w:v.videoWidth,h:v.videoHeight,e:v.error?1:0})}
setInterval(report,700);
function playBtn(){['.jw-icon-display','.vjs-big-play-button','.plyr__control--overlaid','[aria-label="Play"]','[title="Play"]','.play-button','.btn-play','.ytp-large-play-button','button[class*="play" i]'].forEach(function(s){
  try{var b=document.querySelector(s);if(b&&b.offsetWidth>0)b.click()}catch(e){}})}
EvoFrame.addEventListener('message',function(ev){
  var c;try{c=JSON.parse(ev.data)}catch(e){return}
  var v=main();
  if(c.c==='play'){
    if(v){if(v.paused){v.muted=false;var p=v.play();if(p&&p.catch)p.catch(function(){v.muted=true;try{v.play()}catch(e){}})}}
    else playBtn();
  }else if(v){
    if(c.c==='pause')v.pause();
    else if(c.c==='toggle'){v.paused?v.play():v.pause()}
    else if(c.c==='seek'){try{v.currentTime=Math.max(0,v.currentTime+c.d)}catch(e){}}
    else if(c.c==='subs'){
      if(c.v==='list'){post({t:'subs',list:[].map.call(v.textTracks||[],function(t,i){return {i:i,label:t.label||t.language||('Track '+(i+1))}})})}
      else if(c.v===-1){window.__evoSubsOff=1;tracksOff(v)}
      else{window.__evoSubsOff=0;[].forEach.call(v.textTracks||[],function(t,i){t.mode=(i===c.v)?'showing':'disabled'})}
    }
  }
});
// remove empty full-screen click-hijack overlays inside the player frame
setInterval(function(){try{[].forEach.call(document.querySelectorAll('body *'),function(e){
  if(e.tagName==='VIDEO'||e.querySelector('video'))return;
  var s=getComputedStyle(e);if(s.position!=='fixed'&&s.position!=='absolute')return;
  if((parseInt(s.zIndex)||0)<900)return;
  var r=e.getBoundingClientRect();if(r.width<innerWidth*0.8||r.height<innerHeight*0.8)return;
  if((e.textContent||'').trim().length>0)return;e.remove()})}catch(x){}},1800);
})();
