/* part3.js — 파트 3 실험 */
(function(){const {Plot,f1,f2,pct}=LAB,D=DS,S=D.sep;
const band=(P,u,lo,hi,fill)=>{const pp=[-u[1],u[0]],L=30,pt=(t,s)=>[t*u[0]+s*pp[0],t*u[1]+s*pp[1]];const q=[pt(lo,-L),pt(lo,L),pt(hi,L),pt(hi,-L)];
  P.add('under','polygon',{points:q.map(p=>P.sx(p[0])+','+P.sy(p[1])).join(' '),fill:fill||'rgba(241,198,74,0.28)'});};
const corridor=(P,w,b,opts)=>{const n=Math.hypot(w[0],w[1]),u=[w[0]/n,w[1]/n];band(P,u,(-1-b)/n,(1-b)/n,opts&&opts.fill);
  P.lineEq('under',w[0],w[1],b-1,{stroke:'#c9a227','stroke-width':1.5,'stroke-dasharray':'6 4'});P.lineEq('under',w[0],w[1],b+1,{stroke:'#c9a227','stroke-width':1.5,'stroke-dasharray':'6 4'});
  P.lineEq('under',w[0],w[1],b,{stroke:'#4a475a','stroke-width':2.5});};
/* 챕터 9 */
(function(){const P=Plot(document.getElementById('p9'),{aria:'손잡이로 줄 움직이기'});const a=document.getElementById('s9a'),bb=document.getElementById('s9b'),c=document.getElementById('s9c');let sel=null;
 function draw(){const w=[+a.value,+bb.value],b=+c.value;['v9a','v9b','v9c'].forEach((id,i)=>document.getElementById(id).textContent=f1([w[0],w[1],b][i]));
  P.region((x,y)=>w[0]*x+w[1]*y+b>0?1:0,30);P.clear('under');P.lineEq('under',w[0],w[1],b,{stroke:'#4a475a','stroke-width':2.5});P.clear('main');P.clear('over');const nw=Math.hypot(w[0],w[1]);if(nw>0.05){const t=-b/nw,cx=3,cy=3,k=(t-(w[0]*cx+w[1]*cy)/nw),f0=[cx+k*w[0]/nw,cy+k*w[1]/nw];P.arrow('over',f0[0],f0[1],f0[0]+0.9*w[0]/nw,f0[1]+0.9*w[1]/nw,'#7b4fd6');}
  let ok=0;S.Xtr.forEach((p,i)=>{const pr=w[0]*p[0]+w[1]*p[1]+b>0?1:0;if(pr===S.ytr[i])ok++;P.dot('main',p[0],p[1],S.ytr[i],{ring:pr!==S.ytr[i]?'#d64545':(sel===i?'#7b4fd6':null)});});
  let t=`<div class="big">${ok} / ${S.Xtr.length}명 제 편</div><span class="note">빨강 테두리 = 줄 반대편에 선 학생</span>`;
  if(sel!==null){const p=S.Xtr[sel],sc=w[0]*p[0]+w[1]*p[1]+b;t+=`<br>고른 학생 (${p.join(', ')}): ${f1(w[0])}×${p[0]} + ${f1(w[1])}×${p[1]} + (${f1(b)}) = <b>${f2(sc)}</b> → ${sc>0?'빨강 쪽':'파랑 쪽'}`;}else t+='<br><span class="note">학생을 누르면 점수 계산을 보여 줘요.</span>';
  document.getElementById('r9').innerHTML=t;}
 P.onClick((x,y)=>{let bi=-1,bd=0.4;S.Xtr.forEach((p,i)=>{const d=Math.hypot(p[0]-x,p[1]-y);if(d<bd){bd=d;bi=i;}});sel=bi>=0?bi:null;draw();});
 [a,bb,c].forEach(e=>e.oninput=draw);document.getElementById('b9a').onclick=()=>{a.value=1;bb.value=1;c.value=-6;draw();};draw();})();
/* 챕터 10 */
function bestGap(X,y,deg){const u=[Math.cos(deg*Math.PI/180),Math.sin(deg*Math.PI/180)];let lo=1e9,hi=-1e9;X.forEach((p,i)=>{const z=u[0]*p[0]+u[1]*p[1];if(y[i])lo=Math.min(lo,z);else hi=Math.max(hi,z);});return {u,lo,hi,gap:lo-hi};}
const hard=ML.svm(S.Xtr,S.ytr,{C:1000});
(function(){const P=Plot(document.getElementById('p10'),{aria:'가장 넓은 복도'});const sl=document.getElementById('s10');
 let best=0,bdeg=0;for(let d=0;d<=90;d+=0.05){const g=bestGap(S.Xtr,S.ytr,d).gap;if(g>best){best=g;bdeg=d;}}
 function draw(){const d=+sl.value;document.getElementById('v10').textContent=d+'°';const r=bestGap(S.Xtr,S.ytr,d);P.clear('under');P.clear('main');P.clear('over');
  if(r.gap>0){band(P,r.u,r.hi,r.lo);P.lineEq('under',r.u[0],r.u[1],-(r.lo+r.hi)/2,{stroke:'#4a475a','stroke-width':2.5});
   [r.lo,r.hi].forEach(t=>P.lineEq('under',r.u[0],r.u[1],-t,{stroke:'#c9a227','stroke-dasharray':'6 4','stroke-width':1.5}));}
  let nsv=0;S.Xtr.forEach((p,i)=>{const z=r.u[0]*p[0]+r.u[1]*p[1],on=r.gap>0&&Math.abs(z-(S.ytr[i]?r.lo:r.hi))<1e-6;if(on)nsv++;P.dot('main',p[0],p[1],S.ytr[i],{ring:on?'#22a45d':null});});
  P.arrow('over',1,5,1+0.9*r.u[0],5+0.9*r.u[1],'#7b4fd6');P.text('over',0.5,5.6,'방향',{fill:'#7b4fd6','font-size':11});
  document.getElementById('r10').innerHTML=`<div>이 방향의 복도 폭<b>${r.gap>0?f2(r.gap)+'눈금':'복도 없음'}</b></div><div>벽에 닿은 학생<b>${r.gap>0?nsv+'명':'—'}</b></div><div>가장 넓은 복도(${f1(bdeg)}°)<b>${f2(best)}눈금</b></div><div>SVM 계산기의 2 ÷ ‖w‖<b>${f2(hard.margin)}눈금</b></div>`;}
 sl.oninput=draw;document.getElementById('b10a').onclick=()=>{sl.value=Math.round(bdeg);draw();};draw();window.__P3a={best,bdeg,margin:hard.margin,w:hard.w,b:hard.bias,nsv:hard.sv.length};})();
/* 챕터 11 */
(function(){const P=Plot(document.getElementById('p11'),{aria:'서포트 벡터'});const off=new Set();
 function draw(){const idx=S.Xtr.map((_,i)=>i).filter(i=>!off.has(i)),X=idx.map(i=>S.Xtr[i]),y=idx.map(i=>S.ytr[i]);P.clear('under');P.clear('main');P.clear('over');
  const ok=y.includes(0)&&y.includes(1);let m=null;if(ok){m=ML.svm(X,y,{C:1000});corridor(P,m.w,m.bias);}
  const svIdx=new Set(m?m.sv.map(k=>idx[k]):[]);
  S.Xtr.forEach((p,i)=>off.has(i)?P.dot('main',p[0],p[1],S.ytr[i],{fill:'#cfcbd9'}):P.dot('main',p[0],p[1],S.ytr[i],{ring:svIdx.has(i)?'#22a45d':null}));
  const r=document.getElementById('r11');if(!m){r.innerHTML='두 동아리가 모두 있어야 복도를 낼 수 있어요.';return;}
  r.innerHTML=`<div class="big">복도 폭 ${f2(m.margin)}눈금</div>남은 학생 ${idx.length}명 중 서포트 벡터 <b>${m.sv.length}명</b><br>`+m.sv.map(k=>{const p=X[k],sc=m.w[0]*p[0]+m.w[1]*p[1]+m.bias;return `(${p.join(', ')}): y × 점수 = ${f2((y[k]?1:-1)*sc)}`;}).join('<br>');}
 P.onClick((x,y)=>{let bi=-1,bd=0.4;S.Xtr.forEach((p,i)=>{const d=Math.hypot(p[0]-x,p[1]-y);if(d<bd){bd=d;bi=i;}});if(bi>=0){off.has(bi)?off.delete(bi):off.add(bi);draw();}});
 document.getElementById('b11a').onclick=()=>{off.clear();draw();};draw();})();
/* 챕터 12 */
const Cs=[0.1,0.3,1,3,10,100,1000],Xo=S.Xtr.concat([D.outlier]),yo=S.ytr.concat([1]);
(function(){const P=Plot(document.getElementById('p12'),{aria:'C 손잡이'});const sl=document.getElementById('s12');const cache={};
 function draw(){const C=Cs[+sl.value];document.getElementById('v12').textContent=C;const m=cache[C]||(cache[C]=ML.svm(Xo,yo,{C}));
  P.region((x,y)=>m.predict([x,y]),30);P.clear('under');P.clear('main');P.clear('over');corridor(P,m.w,m.bias);const sv=new Set(m.sv);
  Xo.forEach((p,i)=>P.dot('main',p[0],p[1],yo[i],{ring:sv.has(i)?'#22a45d':null,stroke:i===Xo.length-1?'#d64545':'#fff',r:i===Xo.length-1?7:5.5}));
  document.getElementById('r12').innerHTML=`<div>복도 폭<b>${f2(m.margin)}눈금</b></div><div>서포트 벡터<b>${m.sv.length}명</b></div><div>훈련 학생 맞힌 비율<b>${pct(ML.acc(Xo.map(m.predict),yo))}</b></div><div>처음 보는 학생 맞힌 비율<b>${pct(ML.acc(S.Xte.map(m.predict),S.yte))}</b></div>`;}
 sl.oninput=draw;draw();})();
/* 챕터 13 SVR */
(function(){let s=11;const rnd=()=>{s=(s*16807)%2147483647;return s/2147483647;};const gs=()=>{const u=rnd()||1e-9,v=rnd();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);};
 const X=[],Y=[];for(let i=0;i<14;i++){const x=0.4+i*0.4+rnd()*0.2;X.push(+x.toFixed(2));Y.push(+(3+4*x+gs()*2.2).toFixed(1));}
 const P=Plot(document.getElementById('p13'),{xr:[0,6],yr:[0,32],yticks:5,xlab:'집에서 학교까지 거리(km)',ylab:'등교 시간(분)',aria:'SVR 튜브'});const sl=document.getElementById('s13');
 function fit(eps){let best=[1e18,0,0];for(let w=0;w<=8;w+=0.02)for(let b=-5;b<=15;b+=0.05){let L=0.5*w*w;for(let i=0;i<X.length;i++){const e=Math.abs(Y[i]-(w*X[i]+b))-eps;if(e>0)L+=e;}if(L<best[0])best=[L,w,b];}return best;}
 const cache={};function draw(){const e=+sl.value;document.getElementById('v13').textContent=f1(e);const [,w,b]=cache[e]||(cache[e]=fit(e));
  P.clear('under');P.clear('main');P.add('under','polygon',{points:[[0,b-e],[6,6*w+b-e],[6,6*w+b+e],[0,b+e]].map(p=>P.sx(p[0])+','+P.sy(p[1])).join(' '),fill:'rgba(241,198,74,0.28)'});
  P.line('under',0,b,6,6*w+b,{stroke:'#4a475a','stroke-width':2.5});let out=0;
  X.forEach((x,i)=>{const o=Math.abs(Y[i]-(w*x+b))>e+1e-9;if(o)out++;P.dot('main',x,Y[i],0,{fill:'#7b4fd6',ring:o?'#d64545':null});});
  document.getElementById('r13').innerHTML=`예측선: 등교 시간 ≈ <b>${f2(w)}</b> × 거리 + ${f1(b)}<br><div class="big">튜브 밖 ${out}명 / ${X.length}명</div><span class="note">빨강 테두리 = 예측이 ${f1(e)}분 넘게 빗나간 학생(벌점). 이 그림은 C = 1로 계산했어요.</span>`;}
 sl.oninput=draw;draw();})();
/* 라운드 3 */
const fly=ML.acc(S.Xte.map(q=>ML.knn(S.Xtr,S.ytr,q,3).label),S.yte),m10=ML.svm(S.Xtr,S.ytr,{C:10}),robo=ML.acc(S.Xte.map(m10.predict),S.yte);
LAB.battle('arena3',{fly,robo,flyMood:fly>robo+0.03?'happy':(robo>fly+0.03?'sad':'think'),roboMood:robo>fly+0.03?'happy':(fly>robo+0.03?'sad':'think')});
const chk=(w,b)=>S.Xtr.every((p,i)=>((w[0]*p[0]+w[1]*p[1]+b>0)?1:0)===S.ytr[i]);
window.__P3={fly,robo,c1000:(()=>{const m=ML.svm(Xo,yo,{C:1000});return [m.margin,ML.acc(S.Xte.map(m.predict),S.yte),ML.acc(Xo.map(m.predict),yo)];})(),
 c10:(()=>{const m=ML.svm(Xo,yo,{C:10});return [m.margin,ML.acc(S.Xte.map(m.predict),S.yte),ML.acc(Xo.map(m.predict),yo),m.sv.length];})(),sep11:chk([1,1],-6),sep12:chk([1.2,1],-6)};
})();
