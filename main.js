(function(){
var VARS={font:'--ff',fontSize:'--fs',lineHeight:'--lh',color:'--fg',background:'--bg',titleSize:'--tfs',titleColor:'--tfg',captionSize:'--cfs',captionColor:'--cfg',linkColor:'--link',linkHover:'--hover',imageWidth:'--iw',gridWidth:'--gw',menuSize:'--mfs',menuColor:'--mfg',menuActive:'--mact'};
var FONTS={sans:'Verdana,"PingFang SC","Microsoft YaHei",sans-serif',serif:'Georgia,"Songti SC","Noto Serif SC",SimSun,serif',kai:'KaiTi,"Kaiti SC",STKaiti,serif',mono:'Menlo,Consolas,"Courier New",monospace'};
var PX={fontSize:1,titleSize:1,captionSize:1,imageWidth:1,gridWidth:1,menuSize:1};
var $=function(s){return document.querySelector(s)},D,PAGES={},CH={},SEC=[],keyGo=null,ready=false;
var lang=(navigator.language||'zh').toLowerCase().indexOf('zh')==0?'zh':'en';
try{lang=localStorage.getItem('lang')||lang}catch(e){}
function pick(a,b){return(lang=='en'&&b&&String(b).trim())?b:(a||b||'')}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function A(t,u){return /^(https?:|mailto:|tel:|#)/.test(u)?'<a href="'+u+'"'+(/^http/.test(u)?' target="_blank" rel="noopener"':'')+'>'+t+'</a>':t}
function rich(s){return esc(s).replace(/\[([^\]]+)\]\(([^)\s]+)\)|(https?:\/\/[^\s<>]+)|([\w.+-]+@[\w-]+\.[\w.-]+)/g,function(m,t,u,w,e){
 if(t)return A(t,u);if(e)return A(e,'mailto:'+e);
 var k=w.match(/(&quot;|&lt;|&gt;|[.,;:!?)，。；：！？])+$/),tail=k?k[0]:'',url=w.slice(0,w.length-tail.length);return A(url,url)+tail})}
function paras(s){return String(s||'').split(/\n\s*\n/).map(function(b){return b.trim()}).filter(Boolean).map(function(b){return'<p>'+rich(b).replace(/\n/g,'<br>')+'</p>'}).join('')}
function src(s){s=String(s||'');return/^(https?:)?\/\//.test(s)?s:s.replace(/^\/+/,'')}
function uid(p){var b=String(p.slug||p.titleEn||p.title||'page').trim().toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g,'-').replace(/^-+|-+$/g,'')||'page',id=b,n=2;while(PAGES[id])id=b+'-'+n++;return id}
function reg(p,ch){var id=uid(p);PAGES[id]=p;CH[id]=ch;return id}
function build(){(D.sections||[]).forEach(function(s){var sec={raw:s,items:[],cats:[]};
 (s.pages||[]).forEach(function(p){sec.items.push(reg(p,[D.style,s.style]))});
 (s.categories||[]).forEach(function(c){var cat={raw:c,items:[]};(c.pages||[]).forEach(function(p){cat.items.push(reg(p,[D.style,s.style,c.style]))});sec.cats.push(cat)});
 SEC.push(sec)})}
function first(){for(var i=0;i<SEC.length;i++){if(SEC[i].items.length)return SEC[i].items[0];for(var j=0;j<SEC[i].cats.length;j++)if(SEC[i].cats[j].items.length)return SEC[i].cats[j].items[0]}}
function item(id){var p=PAGES[id];return'<li><a href="#'+encodeURIComponent(id)+'" data-id="'+esc(id)+'">'+esc(pick(p.title,p.titleEn)||id)+'</a></li>'}
function menu(){
 var h='<a class="name" href="#">'+esc(pick(D.siteName,D.siteNameEn))+'</a><p class="lang"><button data-l="zh"'+(lang=='zh'?' class="on"':'')+'>中文</button> / <button data-l="en"'+(lang=='en'?' class="on"':'')+'>English</button></p>';
 SEC.forEach(function(s){h+='<p class="sec">'+esc(pick(s.raw.title,s.raw.titleEn))+'</p><div class="grp">';
  if(s.items.length)h+='<ul>'+s.items.map(item).join('')+'</ul>';
  s.cats.forEach(function(c){h+='<details><summary>'+esc(pick(c.raw.title,c.raw.titleEn))+'</summary><ul>'+(c.items.length?c.items.map(item).join(''):'<li class="soon">'+(lang=='zh'?'即将更新':'Coming soon')+'</li>')+'</ul></details>'});
  h+='</div>'});
 $('#menu').innerHTML=h}
function applyStyle(id){var eff={},r=document.documentElement.style;
 CH[id].concat([PAGES[id].style]).forEach(function(o){for(var k in o||{}){var v=o[k];if(v!==''&&v!=null&&v===v)eff[k]=v}});
 for(var k in VARS){var v=eff[k];if(v==null)r.removeProperty(VARS[k]);else r.setProperty(VARS[k],k=='font'?(FONTS[v]||v):PX[k]?v+'px':v)}}
function alt(im,p){return esc(pick(im.caption,im.captionEn)||pick(p.title,p.titleEn))}
function slideshow(p,L){
 var n=L.length,i=0,x0=null,root=document.createElement('div');root.className='view';
 function draw(){var im=L[i],c=pick(im.caption,im.captionEn);
  root.innerHTML='<img src="'+esc(src(im.src))+'" alt="'+alt(im,p)+'"'+(n>1?' class="go"':'')+'>'+
   (n>1?'<div class="ctl"><button data-d="-1" aria-label="Previous">←</button><button data-d="1" aria-label="Next">→</button><span>| '+(i+1)+'/'+n+'</span></div>':'')+
   (c?'<p class="cap">'+rich(c)+'</p>':'');
  if(n>1)new Image().src=src(L[(i+1)%n].src)}
 function go(d){i=(i+d+n)%n;draw()}
 root.addEventListener('click',function(e){var b=e.target.closest('button[data-d]');if(b)go(+b.dataset.d);else if(e.target.className=='go')go(1)});
 root.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});
 root.addEventListener('touchend',function(e){if(x0==null||n<2)return;var dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>40)go(dx<0?1:-1)});
 keyGo=n>1?go:null;draw();return root}
function show(){
 var h='';try{h=decodeURIComponent(location.hash.slice(1))}catch(e){}
 var id=PAGES[h]?h:first(),c=$('#content');if(!id){c.innerHTML='';return}
 var p=PAGES[id],L=(p.images||[]).filter(function(im){return im&&im.src}),lay=p.layout||'slideshow';if(!L.length)lay='text';
 keyGo=null;applyStyle(id);
 var head='<h1>'+esc(pick(p.title,p.titleEn))+'</h1>',text=paras(pick(p.text,p.textEn));
 if(lay=='grid')c.innerHTML=head+'<div class="grid">'+L.map(function(im){var cp=pick(im.caption,im.captionEn);return'<figure><a href="'+esc(src(im.src))+'" target="_blank" rel="noopener"><img src="'+esc(src(im.src))+'" alt="'+alt(im,p)+'"></a>'+(cp?'<figcaption class="cap">'+rich(cp)+'</figcaption>':'')+'</figure>'}).join('')+'</div><div class="doc">'+text+'</div>';
 else if(lay=='text')c.innerHTML='<div class="doc">'+head+text+'</div>';
 else{c.innerHTML='<div class="work"><div class="im"></div><div class="tx">'+head+text+'</div></div>';c.querySelector('.im').appendChild(slideshow(p,L))}
 document.querySelectorAll('#menu a[data-id]').forEach(function(a){if(a.dataset.id==id){a.setAttribute('aria-current','page');var d=a.closest('details');if(d)d.open=true}else a.removeAttribute('aria-current')});
 document.title=pick(p.title,p.titleEn)+' — '+pick(D.siteName,D.siteNameEn);if(ready)scrollTo(0,0);ready=true}
document.addEventListener('click',function(e){var b=e.target.closest('button[data-l]');if(!b)return;lang=b.dataset.l;try{localStorage.setItem('lang',lang)}catch(_){}document.documentElement.lang=lang=='zh'?'zh-CN':'en';menu();show()});
document.addEventListener('keydown',function(e){if(keyGo&&!e.metaKey&&!e.ctrlKey&&!e.altKey){if(e.key=='ArrowRight')keyGo(1);else if(e.key=='ArrowLeft')keyGo(-1)}});
addEventListener('hashchange',show);
fetch('content.json?v='+Date.now(),{cache:'no-store'}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(d){D=d;D.style=D.style||{};build();document.documentElement.lang=lang=='zh'?'zh-CN':'en';menu();show()})
 .catch(function(){$('#content').innerHTML='<p>无法读取 content.json。请通过网址访问网站（不要直接双击本地文件）。</p>'});
})();
