(function(){
var VARS={font:'--ff',fontSize:'--fs',lineHeight:'--lh',letterSpacing:'--ls',color:'--fg',textAlign:'--ta',background:'--bg',titleFont:'--tff',titleSize:'--tfs',titleColor:'--tfg',captionSize:'--cfs',captionColor:'--cfg',linkColor:'--link',linkHover:'--hover',imageWidth:'--iw',gridWidth:'--gw',galleryHeight:'--gh',nameFont:'--nff',nameSize:'--nfs',nameColor:'--nfg',nameWeight:'--nfw',menuFont:'--mff',menuSize:'--mfs',menuColor:'--mfg',menuActive:'--mact',sectionSize:'--sfs',sectionColor:'--sfg'};
var FONTS={sans:'Verdana,"PingFang SC","Microsoft YaHei",sans-serif',serif:'Georgia,"Songti SC","Noto Serif SC",SimSun,serif',kai:'KaiTi,"Kaiti SC",STKaiti,serif',fangsong:'STFangsong,FangSong,serif',helvetica:'"Helvetica Neue",Helvetica,Arial,sans-serif',arial:'Arial,Helvetica,sans-serif',verdana:'Verdana,Geneva,sans-serif',tahoma:'Tahoma,Geneva,sans-serif',trebuchet:'"Trebuchet MS",Helvetica,sans-serif',gillsans:'"Gill Sans","Gill Sans MT",Calibri,sans-serif',futura:'Futura,"Century Gothic","Trebuchet MS",sans-serif',times:'"Times New Roman",Times,serif',georgia:'Georgia,serif',palatino:'Palatino,"Palatino Linotype","Book Antiqua",serif',garamond:'Garamond,"EB Garamond",Baskerville,"Times New Roman",serif',baskerville:'Baskerville,"Baskerville Old Face",Georgia,serif',didot:'Didot,"Bodoni MT","Playfair Display",serif',courier:'"Courier New",Courier,monospace',mono:'Menlo,Consolas,"Courier New",monospace'};
var FK={font:1,titleFont:1,nameFont:1,menuFont:1},PX={fontSize:1,letterSpacing:1,titleSize:1,captionSize:1,imageWidth:1,gridWidth:1,galleryHeight:1,nameSize:1,menuSize:1,sectionSize:1};
var $=function(s){return document.querySelector(s)},D,PAGES={},CH={},SEC=[],keyGo=null,ready=false,LB={L:null},lx=null;
var BASE=document.title;var lang=(navigator.language||'zh').toLowerCase().indexOf('zh')==0?'zh':'en';
try{lang=localStorage.getItem('lang')||lang}catch(e){}
function pick(a,b){return(lang=='en'&&b&&String(b).trim())?b:(a||b||'')}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function A(t,u){return /^(https?:|mailto:|tel:|#)/.test(u)?'<a href="'+u+'"'+(/^http/.test(u)?' target="_blank" rel="noopener"':'')+'>'+t+'</a>':t}
function rich(s){return esc(s).replace(/\[([^\]]+)\]\(([^)\s]+)\)|(https?:\/\/[^\s<>]+)|([\w.+-]+@[\w-]+\.[\w.-]+)/g,function(m,t,u,w,e){
 if(t)return A(t,u);if(e)return A(e,'mailto:'+e);
 var k=w.match(/(&quot;|&lt;|&gt;|[.,;:!?)，。；：！？])+$/),tail=k?k[0]:'',url=w.slice(0,w.length-tail.length);return A(url,url)+tail})}
function paras(s){return String(s||'').split(/\n\s*\n/).map(function(b){return b.trim()}).filter(Boolean).map(function(b){return'<p>'+rich(b).replace(/\n/g,'<br>')+'</p>'}).join('')}
function src(s){s=String(s||'');return/^(https?:)?\/\//.test(s)?s:s.replace(/^\/+/,'')}
function lg(t){return/[\u4e00-\u9fa5]/.test(t)?'zh-CN':'en'}
var TAGS=/^(P|BR|STRONG|B|EM|I|U|S|DEL|STRIKE|A|UL|OL|LI|BLOCKQUOTE|H1|H2|H3|H4|H5|H6|CODE|PRE|HR|SPAN|DIV|SUB|SUP|MARK|SMALL)$/,DROP=/^(SCRIPT|STYLE|IFRAME|OBJECT|EMBED|LINK|META|FORM|INPUT|BUTTON|SVG|MATH|TEXTAREA|SELECT)$/,STY=/^(color|background-color|font-size|font-family|font-weight|font-style|text-decoration|text-align|line-height|letter-spacing|text-indent)$/;
function sty(v){return v.split(';').map(function(x){var i=x.indexOf(':');if(i<0)return'';var k=x.slice(0,i).trim().toLowerCase(),val=x.slice(i+1).trim();return STY.test(k)&&!/url\(|expression|javascript|[<>]/i.test(val)?k+':'+val:''}).filter(Boolean).join(';')}
function walk(n){[].slice.call(n.childNodes).forEach(function(c){
 if(c.nodeType==3)return;if(c.nodeType!=1||DROP.test(c.tagName)){n.removeChild(c);return}
 walk(c);if(!TAGS.test(c.tagName)){while(c.firstChild)n.insertBefore(c.firstChild,c);n.removeChild(c);return}
 [].slice.call(c.attributes).forEach(function(a){var k=a.name.toLowerCase();
  if(k=='href'&&c.tagName=='A'&&/^\s*www\./i.test(a.value)){c.setAttribute('href','https://'+a.value.trim());return}if(k=='href'&&c.tagName=='A'&&/^\s*(https?:|mailto:|tel:|#)/i.test(a.value))return;
  if(k=='style'){var v=sty(a.value);if(v)c.setAttribute('style',v);else c.removeAttribute('style');return}
  c.removeAttribute(a.name)});
 if(c.tagName=='A'&&/^https?:/i.test(c.getAttribute('href')||'')){c.setAttribute('target','_blank');c.setAttribute('rel','noopener')}})}
var HT=/<\/?(p|br|div|ul|ol|li|h[1-6]|blockquote|strong|b|em|i|u|s|span|a)[\s>\/]/i;
function linkify(root){var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),L=[],n;while(n=w.nextNode()){if(!n.parentElement.closest('a')&&/(https?:\/\/|www\.|@)/.test(n.nodeValue))L.push(n)}
 L.forEach(function(n){var t=n.nodeValue,f=document.createDocumentFragment(),last=0,re=/(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+|[\w.+-]+@[\w-]+\.[\w.-]+)/g,m;
  while(m=re.exec(t)){var u=m[0],tail='',k=u.match(/[.,;:!?)\]，。；：！？、”’"']+$/);if(k){tail=k[0];u=u.slice(0,u.length-tail.length)}
   f.appendChild(document.createTextNode(t.slice(last,m.index)));var a=document.createElement('a'),mail=/@/.test(u)&&!/^https?:|^www\./i.test(u);a.href=mail?'mailto:'+u:(/^www\./i.test(u)?'https://'+u:u);a.textContent=u;if(!mail){a.target='_blank';a.rel='noopener'}f.appendChild(a);if(tail)f.appendChild(document.createTextNode(tail));last=m.index+m[0].length}
  f.appendChild(document.createTextNode(t.slice(last)));n.parentNode.replaceChild(f,n)})}
function clean(s){var d=new DOMParser().parseFromString('<body>'+s,'text/html').body;walk(d);linkify(d);return d.innerHTML}
function body(s){s=String(s||'');return HT.test(s)?clean(s):paras(s)}
function cap(c){c=String(c||'').trim();return c?(HT.test(c)?clean(c):rich(c).replace(/\n/g,'<br>')):''}
function txt(h){return String(h||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim()}
function capEntry(c){c=String(c||'').trim();if(HT.test(c))return clean(c);return c.split(/\n+/).filter(Boolean).map(function(x,i){return'<p'+(i==0?' class="en"':i==1?' class="ed"':'')+'>'+rich(x)+'</p>'}).join('')}
function uid(p){var b=String(p.slug||p.titleEn||p.title||'page').trim().toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g,'-').replace(/^-+|-+$/g,'')||'page',id=b,n=2;while(PAGES[id])id=b+'-'+n++;return id}
function reg(p,ch){var id=uid(p);PAGES[id]=p;CH[id]=ch;return id}
function build(){(D.sections||[]).forEach(function(s){if(s.status==='隐藏')return;var sec={raw:s,items:[],cats:[],link:s.asLink==='yes'};
 (s.pages||[]).forEach(function(p){if(p.status!=='隐藏')sec.items.push(reg(p,[D.style,s.style]))});
 (s.categories||[]).forEach(function(c){if(c.status==='隐藏')return;var cat={raw:c,items:[]};(c.pages||[]).forEach(function(p){if(p.status!=='隐藏')cat.items.push(reg(p,[D.style,s.style,c.style]))});sec.cats.push(cat)});
 SEC.push(sec)})}
function first(){var hp=String(D.homePage||'about').trim().toLowerCase();if(PAGES[hp])return hp;if(PAGES.cv)return'cv';for(var i=0;i<SEC.length;i++){if(SEC[i].items.length)return SEC[i].items[0];for(var j=0;j<SEC[i].cats.length;j++)if(SEC[i].cats[j].items.length)return SEC[i].cats[j].items[0]}}
function item(id){var p=PAGES[id];return'<li><a href="#'+encodeURIComponent(id)+'" data-id="'+esc(id)+'">'+esc(pick(p.title,p.titleEn)||id)+'</a></li>'}
function menu(){
 var h='<a class="name" href="#">'+esc(pick(D.siteName,D.siteNameEn))+'</a><p class="lang"><button data-l="zh"'+(lang=='zh'?' class="on"':'')+'>中文</button> / <button data-l="en"'+(lang=='en'?' class="on"':'')+'>English</button></p>';
 SEC.forEach(function(s){if(s.link&&s.items.length){var id=s.items[0];h+='<p class="sec l"><a href="#'+encodeURIComponent(id)+'" data-id="'+esc(id)+'">'+esc(pick(s.raw.title,s.raw.titleEn))+'</a></p>';return}h+='<p class="sec">'+esc(pick(s.raw.title,s.raw.titleEn))+'</p><div class="grp">';
  if(s.items.length)h+='<ul>'+s.items.map(item).join('')+'</ul>';
  s.cats.forEach(function(c){h+='<details><summary>'+esc(pick(c.raw.title,c.raw.titleEn))+'</summary><ul>'+(c.items.length?c.items.map(item).join(''):'<li class="soon">'+(lang=='zh'?'即将更新':'Coming soon')+'</li>')+'</ul></details>'});
  h+='</div>'});
 $('#menu').innerHTML=h}
function applyStyle(id){var eff={},r=document.documentElement.style;
 CH[id].concat([PAGES[id].style]).forEach(function(o){for(var k in o||{}){var v=o[k];if(v!==''&&v!=null&&v===v)eff[k]=v}});
 for(var k in VARS){var v=eff[k];if(v==null)r.removeProperty(VARS[k]);else r.setProperty(VARS[k],FK[k]?(FONTS[v]||v):PX[k]?v+'px':v)}TRIM=eff.autoTrim!=='no'}
function alt(im,p){return esc(txt(pick(im.caption,im.captionEn))||pick(p.title,p.titleEn))}
/* 自动裁掉图片四周的白边，让图片顶端和文字对齐 */
var TRIM=true;
function trimImg(im){var go=function(){try{var w=im.naturalWidth,h=im.naturalHeight;if(w<40||h<40)return;var s=Math.min(1,320/w),cw=Math.round(w*s),ch=Math.round(h*s),c=document.createElement('canvas');c.width=cw;c.height=ch;var x=c.getContext('2d');x.drawImage(im,0,0,cw,ch);var d=x.getImageData(0,0,cw,ch).data;
 function row(Y){var n=0;for(var X=0;X<cw;X++){var i=(Y*cw+X)*4;if(d[i]<250||d[i+1]<250||d[i+2]<250)n++}return n>cw*.01}
 function col(X){var n=0;for(var Y=0;Y<ch;Y++){var i=(Y*cw+X)*4;if(d[i]<250||d[i+1]<250||d[i+2]<250)n++}return n>ch*.01}
 var t=0,b=ch-1,l=0,r=cw-1;while(t<b&&!row(t))t++;while(b>t&&!row(b))b--;while(l<r&&!col(l))l++;while(r>l&&!col(r))r--;
 var f=[t/ch,(cw-1-r)/cw,(ch-1-b)/ch,l/cw];if(Math.max.apply(null,f)<.01)return;im.dataset.trim=f.join(',');fitImg(im)}catch(e){}};
 if(im.complete&&im.naturalWidth)go();else im.addEventListener('load',go)}
function fitImg(im){var f=String(im.dataset.trim||'').split(',').map(Number);if(f.length!=4)return;var w=im.clientWidth,h=im.clientHeight;
 im.style.clipPath='inset('+f[0]*100+'% '+f[1]*100+'% '+f[2]*100+'% '+f[3]*100+'%)';im.style.margin=(-f[0]*h)+'px '+(-f[1]*w)+'px '+(-f[2]*h)+'px '+(-f[3]*w)+'px'}
addEventListener('resize',function(){[].forEach.call(document.querySelectorAll('img[data-trim]'),fitImg)});
function ctl(i,n){return n>1?'<div class="ctl"><button data-d="-1" aria-label="Previous">←</button><button data-d="1" aria-label="Next">→</button><span>| '+(i+1)+'/'+n+'</span></div>':''}
/* 放大查看 */
document.body.insertAdjacentHTML('beforeend','<div id="lb" role="dialog" aria-modal="true" aria-hidden="true"><button class="x" aria-label="Close">×</button><img alt=""><div class="lbc"></div></div>');
var lb=$('#lb');
function lbDraw(){var im=LB.L[LB.i],n=LB.L.length,c=pick(im.caption,im.captionEn),g=lb.querySelector('img');g.src=src(im.src);g.alt=txt(c);
 lb.querySelector('.lbc').innerHTML=ctl(LB.i,n)+(c?'<div class="cap">'+cap(c)+'</div>':'');if(n>1)new Image().src=src(LB.L[(LB.i+1)%n].src)}
function lbOpen(L,i,cb){LB={L:L,i:i,cb:cb};lbDraw();lb.classList.add('on');lb.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';lb.querySelector('.x').focus()}
function lbClose(){if(!LB.L)return;var cb=LB.cb,i=LB.i;LB={L:null};lb.classList.remove('on');lb.setAttribute('aria-hidden','true');document.body.style.overflow='';if(cb)cb(i)}
function lbGo(d){var n=LB.L.length;LB.i=(LB.i+d+n)%n;lbDraw()}
lb.addEventListener('click',function(e){var b=e.target.closest('button');if(b&&b.dataset.d)lbGo(+b.dataset.d);else if(b||e.target===lb)lbClose();else if(e.target.tagName=='IMG'){if(LB.L.length>1)lbGo(1);else lbClose()}});
lb.addEventListener('touchstart',function(e){lx=e.touches[0].clientX},{passive:true});
lb.addEventListener('touchend',function(e){if(lx==null||!LB.L||LB.L.length<2)return;var dx=e.changedTouches[0].clientX-lx;lx=null;if(Math.abs(dx)>40)lbGo(dx<0?1:-1)});
function slideshow(p,L){
 var n=L.length,i=0,x0=null,root=document.createElement('div');root.className='view';
 function draw(){var im=L[i],c=pick(im.caption,im.captionEn);
  root.innerHTML='<img src="'+esc(src(im.src))+'" alt="'+alt(im,p)+'">'+ctl(i,n)+(c?'<div class="cap">'+cap(c)+'</div>':'');
  if(TRIM)trimImg(root.querySelector('img'));if(n>1)new Image().src=src(L[(i+1)%n].src)}
 function go(d){i=(i+d+n)%n;draw()}
 root.addEventListener('click',function(e){var b=e.target.closest('button[data-d]');if(b)go(+b.dataset.d);else if(e.target.tagName=='IMG')lbOpen(L,i,function(j){i=j;draw()})});
 root.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});
 root.addEventListener('touchend',function(e){if(x0==null||n<2)return;var dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>40)go(dx<0?1:-1)});
 keyGo=n>1?go:null;draw();return root}
/* Google Analytics（衡量 ID 在后台「网站内容」最上面填写；默认先征求访客同意） */
var GA={id:'',on:false,last:'',cur:''};
function gaView(id){if(!GA.on||!window.gtag||GA.last===id)return;GA.last=id;gtag('event','page_view',{page_title:document.title,page_location:location.origin+'/'+encodeURIComponent(id),page_referrer:document.referrer})}
function gaLoad(){if(GA.on)return;GA.on=true;window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',GA.id,{send_page_view:false});var t=document.createElement('script');t.async=true;t.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(GA.id);document.head.appendChild(t);if(GA.cur)gaView(GA.cur)}
function ckText(){var b=$('#ck');if(!b)return;b.children[0].textContent=lang=='zh'?'本站使用 Google Analytics 统计访问量（会使用 Cookie），只用来了解有多少人看过网站。':'This site uses Google Analytics (cookies) to count visits.';b.children[1].textContent=lang=='zh'?'接受':'Accept';b.children[2].textContent=lang=='zh'?'拒绝':'Decline'}
function gaInit(){var id=String(D.gaId||'').trim();if(!/^G-[A-Z0-9]{4,}$/i.test(id))return;GA.id=id;if(D.gaConsent==='no'){gaLoad();return}
 var c='';try{c=localStorage.getItem('ga_consent')||''}catch(e){}if(c==='1'){gaLoad();return}if(c==='0')return;
 var b=document.createElement('div');b.id='ck';b.innerHTML='<span></span><br><button data-a="1"></button><button data-a="0"></button>';document.body.appendChild(b);ckText();
 b.addEventListener('click',function(e){var a=e.target.closest('button');if(!a)return;try{localStorage.setItem('ga_consent',a.dataset.a)}catch(_){}b.remove();if(a.dataset.a=='1')gaLoad()})}
function zoomable(c,sel,L){[].forEach.call(c.querySelectorAll(sel),function(g){g.addEventListener('click',function(e){var t=e.target.closest('img');if(t)lbOpen(L,+t.dataset.i)});g.addEventListener('keydown',function(e){if(e.key=='Enter'&&e.target.tagName=='IMG')lbOpen(L,+e.target.dataset.i)})});if(TRIM)[].forEach.call(c.querySelectorAll(sel+' img'),trimImg)}
function oi(a){return[].concat(a||[]).map(function(x){return typeof x=='string'?{src:x}:x}).filter(function(x){return x&&x.src})}
function show(){try{show0()}catch(e){console.error(e);$('#content').innerHTML='<p>页面显示出错：'+esc(e&&e.message||e)+'（请按 Ctrl+F5 刷新；仍不行，请把这行字发给维护的人）</p>'}}
function show0(){
 var h='';try{h=decodeURIComponent(location.hash.slice(1))}catch(e){}
 var id=PAGES[h]?h:first(),c=$('#content');if(!id){c.innerHTML='';return}
 var p=PAGES[id],ok=function(o){return o&&o.status!=='隐藏'},more=[].concat(p.moreImages||[]).filter(Boolean).map(function(s){return{src:s}}),
  L=oi(p.images).filter(ok).concat(more),lay=p.layout||'slideshow',
  E=(p.entries||[]).filter(function(e){return ok(e)&&(e.image||e.name||e.link||e.note)}),BL=(p.blocks||[]).filter(ok);
 if(lay=='entries'&&!E.length&&L.length)E=L.map(function(im){return{image:im.src,cap:pick(im.caption,im.captionEn)}});
 if(lay=='entries'){if(!E.length)lay='text'}else if(lay=='gallery'){if(!BL.length&&!L.length)lay='text'}else if(!L.length)lay='text';
 keyGo=null;applyStyle(id);
 var tx=pick(p.text,p.textEn),st=p.showTitle,lk=' lang="'+lg(tx)+'"',text=body(tx),
  head=(st=='显示'||(st!='隐藏'&&lay=='slideshow'))?'<h1>'+esc(pick(p.title,p.titleEn))+'</h1>':'',doc=text?'<div class="doc"'+lk+'>'+text+'</div>':'';
 if(lay=='grid'){c.innerHTML=head+'<div class="grid">'+L.map(function(im,k){var cp=pick(im.caption,im.captionEn);return'<figure><img tabindex="0" loading="lazy" data-i="'+k+'" src="'+esc(src(im.src))+'" alt="'+alt(im,p)+'">'+(cp?'<figcaption class="cap">'+cap(cp)+'</figcaption>':'')+'</figure>'}).join('')+'</div>'+doc;zoomable(c,'.grid',L)}
 else if(lay=='gallery'){var AL=[],G=[];
  if(BL.length)BL.forEach(function(b){var bi=oi([].concat(b.images||[],b.moreImages||[])).filter(ok);G.push({f:1,t:pick(b.text,b.textEn),a:bi.map(function(im){AL.push(im);return[im,AL.length-1]})})});
  else{AL=L;L.forEach(function(im,k){var cp=pick(im.caption,im.captionEn)||'';if(!G.length||(cp&&cp!==G[G.length-1].t))G.push({t:cp,a:[]});G[G.length-1].a.push([im,k])})}
  c.innerHTML=head+doc+G.map(function(g){var tt=g.t?(g.f?body(g.t):cap(g.t)):'';return'<section class="gg"><div class="gr">'+g.a.map(function(x){var cp=g.f?pick(x[0].caption,x[0].captionEn):'';return'<figure><img tabindex="0" loading="lazy" data-i="'+x[1]+'" src="'+esc(src(x[0].src))+'" alt="'+alt(x[0],p)+'">'+(cp?'<figcaption class="cap">'+cap(cp)+'</figcaption>':'')+'</figure>'}).join('')+'</div>'+(tt?'<div class="gt" lang="'+lg(g.t)+'">'+tt+'</div>':'')+'</section>'}).join('');zoomable(c,'.gr',AL)}
 else if(lay=='entries'){var EL=[];c.innerHTML=head+doc+'<div class="ents'+(p.entriesStyle=='stack'?' stack':'')+'">'+E.map(function(e){var im='',nm=pick(e.name,e.nameEn),u=e.link?(/^[a-z]+:/i.test(e.link)?e.link:'https://'+e.link):'',rt='';
   if(e.image){EL.push({src:e.image,caption:e.cap!=null?e.cap:[nm,e.date].filter(Boolean).join(' — ')});im='<figure><img tabindex="0" loading="lazy" data-i="'+(EL.length-1)+'" src="'+esc(src(e.image))+'" alt="'+esc(nm||txt(e.cap)||'')+'"></figure>'}
   if(e.cap!=null)rt=capEntry(e.cap);else rt=(nm?'<p class="en">'+rich(nm)+'</p>':'')+(e.date?'<p class="ed">'+esc(e.date)+'</p>':'')+(u?'<p class="el">'+A(esc(String(e.link).replace(/^https?:\/\//,'').replace(/\/$/,'')),esc(u))+'</p>':'')+(e.note?paras(e.note):'');
   return'<article class="ent">'+im+'<div class="et">'+rt+'</div></article>'}).join('')+'</div>';zoomable(c,'.ents',EL)}
 else if(lay=='text')c.innerHTML='<div class="doc"'+lk+'>'+head+(text||'<p class="cap">（这一页还没有内容）</p>')+'</div>';
 else{c.innerHTML='<div class="work"><div class="im"></div><div class="tx"'+lk+'>'+head+text+'</div></div>';c.querySelector('.im').appendChild(slideshow(p,L))}
 document.querySelectorAll('#menu a[data-id]').forEach(function(a){if(a.dataset.id==id){a.setAttribute('aria-current','page');var d=a.closest('details');if(d)d.open=true}else a.removeAttribute('aria-current')});
 document.title=PAGES[h]?pick(p.title,p.titleEn)+' — '+BASE.split(' — ')[0]:BASE;if(ready)scrollTo(0,0);ready=true}
function ga(){var id=String(D.analyticsId||'').trim();if(!/^G-[A-Z0-9]{4,}$/i.test(id))return;var okc=null;try{okc=localStorage.getItem('ga_consent')}catch(e){}
 function go(){if(window.__ga)return;window.__ga=1;window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',id);var t=document.createElement('script');t.async=true;t.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(id);document.head.appendChild(t)}
 if(okc=='1')return go();if(okc=='0')return;
 var b=document.createElement('div');b.id='ck';b.innerHTML='<span>'+(lang=='zh'?'本站使用 Google Analytics 统计访问量（会使用 cookie），是否同意？':'This site uses Google Analytics (cookies) to measure traffic. Do you agree?')+'</span><button data-a="1">'+(lang=='zh'?'同意':'Accept')+'</button><button data-a="0">'+(lang=='zh'?'拒绝':'Decline')+'</button>';
 document.body.appendChild(b);b.addEventListener('click',function(e){var a=e.target.getAttribute('data-a');if(a==null)return;try{localStorage.setItem('ga_consent',a)}catch(_){}b.remove();if(a=='1')go()})}
document.addEventListener('click',function(e){var b=e.target.closest('button[data-l]');if(!b)return;lang=b.dataset.l;try{localStorage.setItem('lang',lang)}catch(_){}document.documentElement.lang=lang=='zh'?'zh-CN':'en';menu();show();ckText()});
document.addEventListener('keydown',function(e){if(e.metaKey||e.ctrlKey||e.altKey)return;
 if(LB.L){if(e.key=='Escape')lbClose();else if(e.key=='ArrowRight')lbGo(1);else if(e.key=='ArrowLeft')lbGo(-1);return}
 if(keyGo){if(e.key=='ArrowRight')keyGo(1);else if(e.key=='ArrowLeft')keyGo(-1)}});
addEventListener('hashchange',show);
fetch('content.json?v='+Date.now(),{cache:'no-store'}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(d){D=d;D.style=D.style||{};build();ga();document.documentElement.lang=lang=='zh'?'zh-CN':'en';gaInit();menu();show()})
 .catch(function(){$('#content').innerHTML='<p>无法读取 content.json。请通过网址访问网站（不要直接双击本地文件）。</p>'});
})();
