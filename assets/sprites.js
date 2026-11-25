/* sprites.js — 연구실 식구 픽셀아트(16비트 RPG풍). 그림 파일 없이 코드로 그린다. 32×32 격자. */
(function(G){
const N=32, OUT='#1f1a2e';
function grid(){return Array.from({length:N},()=>Array(N).fill(null));}
function mk(){const g=grid();const o={g,
  p(x,y,c){if(x>=0&&y>=0&&x<N&&y<N)g[y][x]=c;},
  r(x,y,w,h,c){for(let j=0;j<h;j++)for(let i=0;i<w;i++)o.p(x+i,y+j,c);},
  disc(cx,cy,rad,c){for(let y=0;y<N;y++)for(let x=0;x<N;x++)if((x-cx)**2+(y-cy)**2<=rad*rad)o.p(x,y,c);}};return o;}
function outline(g,skip){const h=grid();for(let y=0;y<N;y++)for(let x=0;x<N;x++){if(g[y][x])continue;
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const v=g[y+dy]&&g[y+dy][x+dx];if(v&&v!==OUT&&!(skip&&skip.includes(v))){h[y][x]=OUT;break;}}}
  for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(h[y][x])g[y][x]=h[y][x];}
const SK='#ffd9b8',SKD='#f0b892',DK='#2a2233',WH='#ffffff',MOUTH='#b23a48',TEAR='#7cc7ff',SPARK='#ffd23f';
/* 사람형 꼬마 */
function human(o,s,mood){
  // 다리·신발
  o.r(12,28,3,2,s.pants||'#3b4a6b');o.r(17,28,3,2,s.pants||'#3b4a6b');o.r(11,30,4,1,'#3a2a22');o.r(17,30,4,1,'#3a2a22');
  // 몸통(겉옷)
  o.r(10,20,12,9,s.coat);o.r(14,20,4,8,s.inner||s.coat);
  if(s.tie)o.r(15,21,2,4,s.tie);
  // 팔
  if(mood==='point'||mood==='spark'){o.r(22,14,2,7,s.coat);o.r(22,12,2,2,SK);} else {o.r(22,21,2,5,s.coat);o.r(22,26,2,1,SK);}
  o.r(8,21,2,5,s.coat);o.r(8,26,2,1,SK);
  // 머리(피부)
  o.r(10,8,12,12,SK);o.r(9,9,14,10,SK);o.r(10,19,12,1,SKD);
  // 머리카락
  const H=s.hair;o.r(9,4,14,5,H);o.r(8,6,16,3,H);o.r(8,9,2,6,H);o.r(22,9,2,6,H);o.r(10,9,4,1,H);o.r(18,9,4,1,H);
  if(s.bob){o.r(8,9,2,10,H);o.r(22,9,2,10,H);}
  if(s.streak)o.r(s.streakX||15,4,2,6,s.streak);
  if(s.buns){o.disc(9,4,3,H);o.disc(22,4,3,H);}
  if(s.tail){o.r(24,9,3,8,H);o.r(25,17,2,2,H);o.p(24,8,s.tailTie||'#e2554e');o.p(25,8,s.tailTie||'#e2554e');}
  if(s.clip){o.r(19,7,2,2,s.clip);}
  face(o,mood,s.eye||'#3a2a5a',12,18,13);
  if(s.glasses){const F='#8a8a9a';for(const ex of [11,17]){o.r(ex,12,4,1,F);o.r(ex,15,4,1,F);o.p(ex,13,F);o.p(ex,14,F);o.p(ex+3,13,F);o.p(ex+3,14,F);}o.p(15,13,F);o.p(16,13,F);}
}
/* 얼굴(눈 두 개 위치 lx, rx, 눈 윗줄 ey) */
function face(o,mood,eye,lx,rx,ey){
  const my=ey+4;
  const eyes={
    open(){for(const x of [lx,rx]){o.r(x,ey,2,2,DK);o.p(x,ey,WH);o.p(x+1,ey+1,eye);}},
    big(){for(const x of [lx,rx]){o.r(x,ey-1,2,3,DK);o.p(x,ey-1,WH);o.p(x+1,ey+1,eye);}},
    happy(){for(const x of [lx,rx]){o.p(x-1,ey+1,DK);o.p(x,ey,DK);o.p(x+1,ey,DK);o.p(x+2,ey+1,DK);}},
    half(){for(const x of [lx,rx]){o.r(x-1,ey,4,1,DK);o.r(x,ey+1,2,1,DK);}},
    sad(){for(const x of [lx,rx]){o.r(x,ey,2,2,DK);o.p(x,ey,WH);}o.p(lx+1,ey-2,DK);o.p(lx,ey-1,DK);o.p(rx,ey-2,DK);o.p(rx+1,ey-1,DK);}};
  const mouths={
    smile(){o.p(14,my,DK);o.r(15,my+1,2,1,DK);o.p(17,my,DK);},
    open(){o.r(14,my,4,1,DK);o.r(14,my+1,4,1,MOUTH);o.r(15,my+2,2,1,DK);},
    o(){o.r(15,my,2,2,DK);},
    flat(){o.r(14,my+1,4,1,DK);},
    frown(){o.p(14,my+1,DK);o.r(15,my,2,1,DK);o.p(17,my+1,DK);}};
  const M={smile:['open','smile'],happy:['happy','open'],spark:['happy','open'],point:['open','smile'],
    shock:['big','o'],think:['half','flat'],sad:['sad','frown'],firm:['open','flat']}[mood]||['open','smile'];
  eyes[M[0]]();mouths[M[1]]();
  if(mood!=='think'&&mood!=='shock'){o.p(lx-1,ey+3,'#ff9aa8');o.p(rx+2,ey+3,'#ff9aa8');}
}
function props(o,mood){
  if(mood==='shock'){o.r(26,6,2,3,TEAR);o.p(26,5,TEAR);}
  if(mood==='sad'){o.r(12,17,1,2,TEAR);o.r(20,17,1,2,TEAR);}
  if(mood==='spark'){for(const [x,y] of [[3,6],[28,4],[27,13]]){o.p(x,y,SPARK);o.p(x-1,y,SPARK);o.p(x+1,y,SPARK);o.p(x,y-1,SPARK);o.p(x,y+1,SPARK);}}
  if(mood==='think'){o.p(26,3,'#8a8a9a');o.p(28,2,'#8a8a9a');o.p(30,1,'#8a8a9a');}
}
const DEF={
  doc:(o,m)=>human(o,{hair:'#23232b',streak:'#f2f2f2',streakX:12,coat:'#f4f6f8',inner:'#2b2b35',tie:'#c8442f',glasses:1,eye:'#3a2a5a'},m),
  haru:(o,m)=>human(o,{hair:'#f29bc0',buns:1,streak:'#2b3a78',streakX:12,coat:'#f4f6f8',inner:'#c9b6f2',eye:'#3d7bd9'},m),
  sia:(o,m)=>human(o,{hair:'#3f2a22',bob:1,clip:'#3fb37f',coat:'#8fd9c0',inner:'#ffffff',eye:'#3a2a22'},m),
  moa:(o,m)=>human(o,{hair:'#c8743a',tail:1,coat:'#f5c84c',inner:'#ffffff',eye:'#5a3a1a'},m),
  fly:(o,m)=>{ // 초파리 연구원
    const W='rgba(190,225,255,0.75)';o.r(1,12,8,7,W);o.r(2,11,6,1,W);o.r(23,12,8,7,W);o.r(24,11,6,1,W);
    for(const x of [11,15,19]){o.r(x,27,1,3,DK);o.p(x-1,30,DK);}
    o.r(10,15,12,12,'#2a2a33');o.r(9,17,14,8,'#2a2a33');o.r(11,19,10,8,'#f4f6f8');o.r(15,19,2,8,'#2a2a33');
    o.r(9,3,14,6,'#3a6fd8');o.r(8,5,16,3,'#3a6fd8');o.r(8,6,16,1,'#e2b13c');o.r(23,3,1,2,'#ff8fb8');o.r(24,2,1,2,'#ff8fb8');o.r(23,5,2,1,'#6fb6ff');o.r(25,4,1,2,'#6fb6ff');
    o.r(9,9,14,6,'#2a2a33');o.r(10,15,12,1,'#2a2a33');
    const R='#d8323c',RD='#9e1f2a';
    const ey=(m==='happy'||m==='spark')?1:0;
    o.r(8,9,5,5-ey,R);o.r(19,9,5,5-ey,R);o.p(9,10,'#ff8a8a');o.p(20,10,'#ff8a8a');
    for(const [x,y] of [[10,11],[12,12],[21,11],[23,12],[11,13],[20,13]])if(y<14-ey)o.p(x,y,RD);
    if(m==='think'){o.r(8,9,5,2,'#2a2a33');o.r(19,9,5,2,'#2a2a33');}
    const my=14;const Mc='#ffb0b8';
    if(m==='happy'||m==='spark'||m==='point'){o.r(14,my,4,1,Mc);}
    else if(m==='shock'){o.r(15,my,2,1,Mc);}
    else if(m==='sad'){o.p(14,my,Mc);o.p(17,my,Mc);}
    else {o.r(15,my,2,1,Mc);}
    if(m==='point'){o.r(22,17,4,2,'#2a2a33');o.p(26,17,'#2a2a33');}
  },
  robo:(o,m)=>{ // 주판봇
    o.r(15,0,2,3,'#8a8f99');o.r(14,0,4,1,'#e2554e');
    o.r(8,3,16,11,'#cfd4dc');o.r(9,2,14,1,'#cfd4dc');o.r(10,5,12,7,'#1b1d24');
    const Y='#ffd23f';
    if(m==='happy'||m==='spark'){for(const x of [12,18]){o.p(x,8,Y);o.p(x+1,7,Y);o.p(x+2,8,Y);}}
    else if(m==='shock'){o.r(12,6,2,3,Y);o.r(18,6,2,3,Y);o.r(15,10,2,1,Y);}
    else if(m==='sad'){o.r(12,8,2,1,Y);o.r(18,8,2,1,Y);o.p(12,7,Y);o.p(19,7,Y);o.r(13,10,1,1,TEAR);}
    else if(m==='think'){o.r(12,8,3,1,Y);o.r(18,8,3,1,Y);}
    else if(m==='firm'){o.r(12,7,3,2,Y);o.r(18,7,3,2,Y);o.p(12,6,'#1b1d24');o.p(20,6,'#1b1d24');}
    else {o.r(12,7,2,2,Y);o.r(18,7,2,2,Y);o.r(14,10,4,1,Y);}
    o.r(7,15,18,13,'#8a5a32');o.r(9,17,14,9,'#f3e6cf');
    for(const y of [18,21,24])o.r(9,y,14,1,'#6b4224');
    const B=[['#e2554e',[10,13,19]],['#3d7bd9',[11,16,20]],['#3fb37f',[12,14,18]]];
    [18,21,24].forEach((y,k)=>{const [c,xs]=B[k];xs.forEach(x=>o.r(x,y-1,2,3,c));});
    o.r(4,17,3,2,'#cfd4dc');o.r(25,17,3,2,'#cfd4dc');
    if(m==='point'||m==='spark'){o.r(25,12,2,5,'#cfd4dc');}
    o.r(9,28,4,2,'#5a5f69');o.r(19,28,4,2,'#5a5f69');
  },
  x:(o,m,s)=>{ // X1·X2·X3 (특징 요정)
    const n=s.n;for(let k=0;k<n;k++){const x=16+(k-(n-1)/2)*5|0;o.r(x,4,1,5,'#5a5f69');o.disc(x,3,1.5,SPARK);}
    o.r(9,9,14,17,s.c);o.r(8,10,16,15,s.c);o.r(10,10,4,2,s.hi);o.r(9,12,2,3,s.hi);
    for(const x of [11,18]){o.r(x,14,3,3,WH);}
    if(m==='happy'||m==='spark'){for(const x of [11,18]){o.r(x,14,3,3,s.c);o.p(x,16,DK);o.p(x+1,15,DK);o.p(x+2,16,DK);}}
    else if(m==='shock'){o.r(12,15,1,1,DK);o.r(19,15,1,1,DK);}
    else if(m==='think'){for(const x of [11,18]){o.r(x,14,3,1,s.c);o.r(x+1,15,2,2,DK);}}
    else {o.r(12,15,2,2,DK);o.r(19,15,2,2,DK);o.p(12,15,WH);o.p(19,15,WH);}
    if(m==='shock')o.r(15,20,2,2,DK);else if(m==='sad')o.r(14,21,4,1,DK);else{o.p(14,20,DK);o.r(15,21,2,1,DK);o.p(17,20,DK);}
    o.r(11,26,3,2,s.dk);o.r(18,26,3,2,s.dk);
  }
};
const X={x1:{n:1,c:'#e8554e',hi:'#ff9a8f',dk:'#9e2f2a'},x2:{n:2,c:'#3fb37f',hi:'#8fe0b8',dk:'#23744f'},x3:{n:3,c:'#3d7bd9',hi:'#8fb8ff',dk:'#25488a'}};
/* 정식 캐릭터 그림(fruitfly-lab-expressions 표정 라이브러리)을 쓴다. 위 코드 그림은 그림 파일이 없을 때만 대신 쓴다. */
const BASE=(document.currentScript&&document.currentScript.src||'').replace(/assets\/sprites\.js.*$/,'');
const MOODS=['smile','happy','spark','shock','think','sad','point','firm'];
const cache={};
function draw(who,mood){if(!MOODS.includes(mood))mood='smile';return BASE+'assets/chars/'+who+'_'+mood+'.webp';}
function drawPixel(who,mood){const key=who+'_'+mood;if(cache[key])return cache[key];
  const o=mk();if(X[who])DEF.x(o,mood,X[who]);else DEF[who](o,mood);props(o,mood);
  outline(o.g,['rgba(190,225,255,0.75)']);
  const c=document.createElement('canvas');c.width=c.height=N;const x=c.getContext('2d');
  for(let y=0;y<N;y++)for(let i=0;i<N;i++)if(o.g[y][i]){x.fillStyle=o.g[y][i];x.fillRect(i,y,1,1);}
  return cache[key]=c.toDataURL();}
const NAMES={doc:'박사',haru:'하루',sia:'시아',moa:'모아',fly:'초파리',robo:'주판봇',x1:'X1',x2:'X2',x3:'X3'};
function paint(root){(root||document).querySelectorAll('img[data-spr]').forEach(im=>{const [w,m]=im.dataset.spr.split(':');const src=draw(w,m||'smile');
  if(im.dataset.cur===src)return;im.dataset.cur=src;im.onerror=()=>{im.onerror=null;im.src=drawPixel(w,m||'smile');};im.src=src;if(!im.hasAttribute('alt'))im.alt='';im.setAttribute('aria-hidden','true');});}
G.SPR={draw,drawPixel,paint,NAMES,grid:N,_def:DEF};
})(window);
