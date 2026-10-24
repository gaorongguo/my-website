(function(){
var VARS={font:'--ff',fontSize:'--fs',lineHeight:'--lh',color:'--fg',background:'--bg',titleSize:'--tfs',titleColor:'--tfg',captionSize:'--cfs',captionColor:'--cfg',linkColor:'--link',linkHover:'--hover',imageWidth:'--iw',gridWidth:'--gw',menuSize:'--mfs',menuColor:'--mfg',menuActive:'--mact'};
var $=function(s){return document.querySelector(s)},keyGo=null,ready=false,chain={};
var lang=(navigator.language||'zh').toLowerCase().indexOf('zh')==0?'zh':'en';
try{lang=localStorage.getItem('lang')||lang}catch(e){}
function tr(x){return x==null?'':typeof x=='string'?x:(x[lang]||x.zh||x.en||'')}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function A(t,u){return /^(https?:|mailto:|tel:|#)/.test(u)?'<a href="'+u+'"'+(/^http/.test(u)?' target="_blank" rel="noopener"':'')+'>'+t+'</a>':t}
function rich(s){return esc(tr(s)).replace(/\[([^\]]+)\]\(([^)\s]+)\)|(https?:\/\/[^\s<>]+)|([\w.+-]+@[\w-]+\.[\w.-]+)/g,function(m,t,u,w,e){
 if(t)return A(t,u);if(e)return A(e,'mailto:'+e);
 var k=w.match(/(&quot;|&lt;|&gt;|[.,;:!?)，。；：！？])+$/),tail=k?k[0]:'',url=w.slice(0,w.length-tail.length);return A(url,url)+tail})}
function first(){for(var i=0;i<MENU.length;i++){var cs=MENU[i].cats||[MENU[i]];for(var j=0;j<cs.length;j++)if(cs[j].items.length)return cs[j].items[0]}}
function item(id){return PAGES[id]?'<li><a href="#'+id+'" data-id="'+id+'">'+esc(tr(PAGES[id].title))+'</a></li>':''}
MENU.forEach(function(s){(s.cats||[s]).forEach(function(c){c.items.forEach(function(id){chain[id]=[STYLE,s.style,c.style]})})});
function menu(){
 var h='<a class="name" href="#">'+esc(tr(SITE.name))+'</a><p class="lang"><button data-l="zh"'+(lang=='zh'?' class="on"':'')+'>中文</button> / <button data-l="en"'+(lang=='en'?' class="on"':'')+'>English</button></p>';
 MENU.forEach(function(s){h+='<p class="sec">'+esc(tr(s.title))+'</p><div class="grp">';
  if(s.cats)s.cats.forEach(function(c){h+='<details><summary>'+esc(tr(c.title))+'</summary><ul>'+(c.items.length?c.items.map(item).join(''):'<li class="soon">'+(lang=='zh'?'即将更新':'Coming soon')+'</li>')+'</ul></details>'});
  else h+='<ul>'+s.items.map(item).join('')+'</ul>';
  h+='</div>'});
 $('#menu').innerHTML=h;$('#bar-name').textContent=tr(SITE.name);$('#bar-btn').textContent=lang=='zh'?'菜单':'Menu'}
function applyStyle(id){var eff=Object.assign.apply(null,[{}].concat(chain[id]||[STYLE],[PAGES[id].style])),r=document.documentElement.style;
 for(var k in VARS){if(eff[k])r.setProperty(VARS[k],eff[k]);else r.removeProperty(VARS[k])}}
function alt(im,p){return esc(tr(im.alt)||tr(im.caption)||tr(p.title))}
function extra(p){return(p.rows?'<dl>'+p.rows.map(function(r){return'<dt>'+esc(tr(r.label))+'</dt><dd>'+rich(r.text)+'</dd>'}).join('')+'</dl>':'')+(p.links?'<ul class="links">'+p.links.map(function(l){return'<li>'+A(esc(tr(l[0])),esc(l[1]))+'</li>'}).join('')+'</ul>':'')}
function slideshow(p){
 var L=p.images,n=L.length,i=0,x0=null,root=document.createElement('div');root.className='view';
 function draw(){var im=L[i];
  root.innerHTML='<img src="'+esc(im.src)+'" alt="'+alt(im,p)+'"'+(n>1?' class="go"':'')+'>'+
   (n>1?'<div class="ctl"><button data-d="-1" aria-label="Previous">←</button><button data-d="1" aria-label="Next">→</button><span>| '+(i+1)+'/'+n+'</span></div>':'')+
   (im.caption?'<p class="cap">'+rich(im.caption)+'</p>':'');
  if(n>1)new Image().src=L[(i+1)%n].src}
 function go(d){i=(i+d+n)%n;draw()}
 root.addEventListener('click',function(e){var b=e.target.closest('button[data-d]');if(b)go(+b.dataset.d);else if(e.target.className=='go')go(1)});
 root.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});
 root.addEventListener('touchend',function(e){if(x0==null||n<2)return;var dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>40)go(dx<0?1:-1)});
 keyGo=n>1?go:null;draw();return root}
function show(){
 var h=location.hash.slice(1),id=PAGES[h]?h:first(),p=PAGES[id],c=$('#content'),imgs=p.images||[],lay=p.layout||(imgs.length?'slideshow':'text');
 if(!imgs.length)lay='text';keyGo=null;applyStyle(id);
 var head='<h1>'+esc(tr(p.title))+'</h1>'+(p.meta?'<p class="cap">'+rich(p.meta)+'</p>':''),text=(p.text||[]).map(function(t){return'<p>'+rich(t)+'</p>'}).join('');
 if(lay=='slideshow'){c.innerHTML='<div class="work"><div class="im"></div><div class="tx">'+head+text+extra(p)+'</div></div>';c.querySelector('.im').appendChild(slideshow(p))}
 else if(lay=='grid')c.innerHTML=head+'<div class="grid">'+imgs.map(function(im){return'<figure><a href="'+esc(im.src)+'" target="_blank" rel="noopener"><img src="'+esc(im.src)+'" alt="'+alt(im,p)+'"></a>'+(im.caption?'<figcaption class="cap">'+rich(im.caption)+'</figcaption>':'')+'</figure>'}).join('')+'</div><div class="doc">'+text+extra(p)+'</div>';
 else c.innerHTML='<div class="doc'+(p.tight?' tight':'')+'">'+head+text+extra(p)+'</div>';
 document.querySelectorAll('#menu a[data-id]').forEach(function(a){if(a.dataset.id==id){a.setAttribute('aria-current','page');var d=a.closest('details');if(d)d.open=true}else a.removeAttribute('aria-current')});
 document.title=tr(p.title)+' — '+tr(SITE.name);document.body.classList.remove('open');if(ready)scrollTo(0,0);ready=true}
document.addEventListener('click',function(e){var b=e.target.closest('button[data-l]');if(!b)return;lang=b.dataset.l;try{localStorage.setItem('lang',lang)}catch(_){}document.documentElement.lang=lang=='zh'?'zh-CN':'en';menu();show()});
$('#bar-btn').addEventListener('click',function(){this.setAttribute('aria-expanded',document.body.classList.toggle('open'))});
document.addEventListener('keydown',function(e){if(keyGo&&!e.metaKey&&!e.ctrlKey&&!e.altKey){if(e.key=='ArrowRight')keyGo(1);else if(e.key=='ArrowLeft')keyGo(-1)}});
addEventListener('hashchange',show);
document.documentElement.lang=lang=='zh'?'zh-CN':'en';menu();show();
})();
