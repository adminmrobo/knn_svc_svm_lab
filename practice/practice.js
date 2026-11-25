/* practice.js — 실전 연습장: 네 사업장 시뮬레이터 */
(function(){const {Plot,el,f1,f2,pct,COL}=LAB;
/* 난수(같은 조건이면 같은 데이터) */
function rng(seed){let s=seed>>>0||1;return ()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};}
function gauss(r){const u=r()||1e-9,v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
const say=(who,mood,txt)=>`<div class="say ${who}"><img class="px" data-spr="${who}:${mood}" alt="" aria-hidden="true"><div><span class="who">${SPR.NAMES[who]}</span>${txt}</div></div>`;
function talk(id,lines){const h=document.getElementById(id);h.innerHTML=lines.map(l=>say(...l)).join('');SPR.paint(h);}
function score(id,items){document.getElementById(id).innerHTML=items.map(([n,v,good])=>`<div><span>${n}</span><b class="${good===true?'good':(good===false?'badc':'')}">${v}</b></div>`).join('');}
function missions(id,ms,state){const h=document.getElementById(id);h.innerHTML=ms.map((m,i)=>{const ok=state.touched&&m.test(state);if(ok)m.done=true;return `<li class="${m.done?'pass':''}"><b>${m.done?'✅ 통과':'⬜ 미션 '+(i+1)}</b> ${m.text}</li>`;}).join('');}
/* 곡선 그리기 */
function curve(P,xs,ys,o){P.clear('main');P.clear('over');for(let i=1;i<xs.length;i++)P.line('main',xs[i-1],ys[i-1],xs[i],ys[i],{stroke:o.color||'#7b4fd6','stroke-width':2.5,'stroke-dasharray':o.dash||''});
  if(o.ys2)for(let i=1;i<xs.length;i++)P.line('main',xs[i-1],o.ys2[i-1],xs[i],o.ys2[i],{stroke:'#9a97aa','stroke-width':2,'stroke-dasharray':'5 4'});
  P.line('over',o.best,P.o.yr[0],o.best,P.o.yr[1],{stroke:'#d98a1c','stroke-width':2,'stroke-dasharray':'4 3'});P.line('over',o.mine,P.o.yr[0],o.mine,P.o.yr[1],{stroke:'#22a45d','stroke-width':2.5});
  P.text('over',P.o.xr[0]+(P.o.xr[1]-P.o.xr[0])*0.03,P.o.yr[1]-(P.o.yr[1]-P.o.yr[0])*0.08,'초록 = 내 선택 · 주황 점선 = 가장 좋은 곳',{'font-size':10.5,fill:'#4a475a'});}
const T={};let cur='';
/* ───── 1. 깃발 본부 (LDA) ───── */
T.flag=(function(){const st={rho:0.85,ang:0,touched:false};
 function data(rho,n,seed){const r=rng(seed),X=[],y=[];const a=Math.sqrt(0.45);for(let c=0;c<2;c++)for(let i=0;i<n;i++){const z1=gauss(r),z2=gauss(r),e1=z1,e2=rho*z1+Math.sqrt(1-rho*rho)*z2;const m=c?[3.6,3.0]:[2.4,3.0];X.push([m[0]+a*e1,m[1]+a*e2]);y.push(c);}return {X,y};}
 let tr,va,m0,m1,wF,dm;const mean=(X,y,c)=>{const p=X.filter((_,i)=>y[i]===c);return [p.reduce((s,v)=>s+v[0],0)/p.length,p.reduce((s,v)=>s+v[1],0)/p.length];};
 const ang=w=>{let g=Math.atan2(w[1],w[0])*180/Math.PI;if(g>90)g-=180;if(g<-90)g+=180;return g;};
 function prep(){tr=data(st.rho,25,101);va=data(st.rho,100,202);m0=mean(tr.X,tr.y,0);m1=mean(tr.X,tr.y,1);dm=[m1[0]-m0[0],m1[1]-m0[1]];let a=0,b=0,c=0;tr.X.forEach((p,i)=>{const m=tr.y[i]?m1:m0,dx=p[0]-m[0],dy=p[1]-m[1];a+=dx*dx;b+=dx*dy;c+=dy*dy;});const det=a*c-b*b;wF=[(c*dm[0]-b*dm[1])/det,(-b*dm[0]+a*dm[1])/det];}
 const rule=g=>{const u=[Math.cos(g*Math.PI/180),Math.sin(g*Math.PI/180)],t=u[0]*(m0[0]+m1[0])/2+u[1]*(m0[1]+m1[1])/2,sg=Math.sign(u[0]*m1[0]+u[1]*m1[1]-t)||1;return {u,t,pred:p=>((u[0]*p[0]+u[1]*p[1]-t)*sg>0)?1:0};};
 const acc=(g,D)=>{const r=rule(g);return ML.acc(D.X.map(r.pred),D.y);};
 const J=g=>{const u=[Math.cos(g*Math.PI/180),Math.sin(g*Math.PI/180)],z0=[],z1=[];tr.X.forEach((p,i)=>(tr.y[i]?z1:z0).push(u[0]*p[0]+u[1]*p[1]));const mu=v=>v.reduce((s,x)=>s+x,0)/v.length,va2=v=>{const m=mu(v);return v.reduce((s,x)=>s+(x-m)**2,0)/v.length;};return (mu(z1)-mu(z0))**2/(va2(z0)+va2(z1));};
 let P,C;const ms=[{text:'그림자 방향을 Fisher 방향(가장 잘 갈리는 방향) ±5° 안으로 맞추기',test:s=>Math.abs(s.ang-ang(wF))<=5},
  {text:'함정 관찰: 길쭉함 0.8 이상에서 <b>깃발 잇는 방향</b>(±3°)을 골라, 검증 정확도가 Fisher 방향보다 5%p 넘게 낮은 것 확인하기',test:s=>s.rho>=0.8&&Math.abs(s.ang-ang(dm))<=3&&acc(ang(wF),va)-acc(s.ang,va)>0.05},
  {text:'조건 바꾸기: 길쭉함을 0.1 이하(거의 동그라미)로 바꾸면 깃발 방향과 Fisher 방향이 10° 안으로 가까워지는지 확인하고, 그 방향(±5°)을 골라 보기',test:s=>s.rho<=0.1&&Math.abs(ang(dm)-ang(wF))<=10&&Math.abs(s.ang-ang(wF))<=5}];
 function draw(){prep();const g=st.ang,r=rule(g),aV=acc(g,va),aF=acc(ang(wF),va),j=J(g),jF=J(ang(wF));
  document.getElementById('flag-v1').textContent=f2(st.rho);document.getElementById('flag-v2').textContent=Math.round(g)+'°';
  P.region((x,y)=>r.pred([x,y]),30);P.clear('under');P.clear('main');P.clear('over');P.lineEq('under',r.u[0],r.u[1],-r.t,{stroke:'#4a475a','stroke-width':2.5});P.points('main',tr.X,tr.y,{r:4.5});
  P.flag('over',m0[0],m0[1],'#3d7bd9');P.flag('over',m1[0],m1[1],'#e0533d');const c0=[(m0[0]+m1[0])/2,(m0[1]+m1[1])/2];P.arrow('over',c0[0],c0[1],c0[0]+1.3*r.u[0],c0[1]+1.3*r.u[1],'#22a45d');
  const gs=[],ys=[];for(let k=-90;k<=90;k+=3){gs.push(k);ys.push(acc(k,va));}curve(C,gs,ys,{best:ang(wF),mine:g});
  score('flag-score',[['검증 학생 맞힌 비율',pct(aV),aV>=aF-0.02],['J = 떨어짐 ÷ 퍼짐',f1(j),j>=jF*0.9],['Fisher 방향과 차이',f1(Math.abs(g-ang(wF)))+'°',Math.abs(g-ang(wF))<=5],['깃발 방향과 Fisher 차이',f1(Math.abs(ang(dm)-ang(wF)))+'°',null]]);
  const good=aV>=aF-0.02;
  talk('flag-talk',[['doc',good?'point':'think',good?`판정: 좋은 방향입니다. 검증 ${pct(aV)}로 가장 좋은 쪽(${pct(aF)})과 거의 같아요.`:`판정: 아직이에요. 가장 좋은 방향은 검증 ${pct(aF)}인데 지금은 ${pct(aV)}입니다.`],
   ['haru','firm',`보고해요. 지금 방향 ${Math.round(g)}°, J ${f1(j)}. Fisher 방향은 약 ${Math.round(ang(wF))}°, J ${f1(jF)}이에요.`],
   ['fly','point',st.rho>0.6?'무리가 이렇게 길쭉한데 깃발만 보면 안 되지. 그림자가 겹치는지 봐.':'무리가 거의 동그라면 깃발 방향도 꽤 괜찮을걸? 직접 비교해 봐.'],
   ['robo',good?'happy':'firm',good?'봐, 정교하게 고르면 이렇게 나온다.':'각도 하나 차이야. 대충 맞으면 되는 거 아니야?']]);
  missions('flag-ms',ms,st);}
 return {init(){P=Plot(document.getElementById('flag-p'),{aria:'깃발 본부 운동장'});C=Plot(document.getElementById('flag-c'),{xr:[-90,90],yr:[0.4,1],ticks:30,yticks:0.1,H:240,xlab:'그림자 방향(°)',ylab:'검증 맞힌 비율',aria:'방향별 검증 정확도'});
   const s1=document.getElementById('flag-s1'),s2=document.getElementById('flag-s2');s1.oninput=()=>{st.rho=+s1.value;st.touched=true;draw();};s2.oninput=()=>{st.ang=+s2.value;st.touched=true;draw();};draw();},draw,st,api:()=>({fisher:ang(wF),flag:ang(dm),acc,ms})};})();
/* ───── 2. 동아리 배정 사무실 (KNN) ───── */
T.knn=(function(){const st={sig:1,k:1,sc:false,touched:false};
 function data(sig,n,seed){const r=rng(seed),X=[],y=[];for(let c=0;c<2;c++)for(let i=0;i<n;i++){X.push([Math.round((c?250:290)+35*sig*gauss(r)),Math.round(((c?13:11)+0.9*sig*gauss(r))*10)/10]);y.push(c);}return {X,y};}
 let tr,va,mm;const ks=[];for(let k=1;k<=31;k+=2)ks.push(k);
 const acc=(k,sc,D)=>{const f=sc?mm.f:(v=>v),A=tr.X.map(f);return ML.acc(D.X.map(q=>ML.knn(A,tr.y,f(q),k).label),D.y);};
 let P,C;const ms=[{text:'검증 정확도가 가장 높은 조합(k, 단위 맞춤)을 찾기 (가장 좋은 값과 1%p 이내)',test:s=>s.cur>=s.best-0.01},
  {text:'함정 관찰: k = 1, 원래 단위에서 훈련은 100%인데 검증은 그보다 20%p 넘게 낮은 것 확인하기',test:s=>s.k===1&&!s.sc&&s.trA===1&&s.trA-s.cur>0.2},
  {text:'조건 바꾸기: 섞임을 1.3 이상으로 올려도 "단위 맞춤 + k ≥ 5"가 "k = 1, 원래 단위"보다 10%p 넘게 높은지 확인하기',test:s=>s.sig>=1.3&&s.sc&&s.k>=5&&s.cur-acc(1,false,va)>0.1}];
 function draw(){tr=data(st.sig,20,303);va=data(st.sig,100,404);mm=ML.minmax(tr.X);const f=st.sc?mm.f:(v=>v),A=tr.X.map(f);
  document.getElementById('knn-v1').textContent=f2(st.sig);document.getElementById('knn-v2').textContent=st.k;
  P.region((x,y)=>ML.knn(A,tr.y,f([x,y]),st.k).label,34);P.clear('main');P.points('main',tr.X,tr.y,{r:4.5});
  const ysS=ks.map(k=>acc(k,true,va)),ysR=ks.map(k=>acc(k,false,va)),ys=st.sc?ysS:ysR;let best=0,bk=1,bs=false;ks.forEach((k,i)=>{if(ysS[i]>best){best=ysS[i];bk=k;bs=true;}if(ysR[i]>best){best=ysR[i];bk=k;bs=false;}});
  curve(C,ks,ys,{best:bk,mine:st.k,ys2:st.sc?ysR:ysS});
  const cur=acc(st.k,st.sc,va),trA=acc(st.k,st.sc,tr);Object.assign(st,{cur,trA,best});
  score('knn-score',[['검증 학생 맞힌 비율',pct(cur),cur>=best-0.01],['훈련 학생 맞힌 비율',pct(trA),null],['외운 정도(훈련 − 검증)',f1((trA-cur)*100)+'%p',trA-cur<0.1],['판정 한 번에 거리 계산',tr.X.length+'번',null]]);
  const good=cur>=best-0.01;
  talk('knn-talk',[['doc',good?'point':'think',good?`판정: 좋습니다. 검증 ${pct(cur)}로 이 조건에서 가장 좋은 쪽(${pct(best)}, k = ${bk}, ${bs?'단위 맞춤':'원래 단위'})과 거의 같아요.`:`판정: 더 좋은 조합이 있어요. 가장 좋은 쪽은 검증 ${pct(best)}입니다.`],
   ['haru','firm',`보고해요. 훈련 ${pct(trA)}, 검증 ${pct(cur)}. 그래프의 회색 점선은 ${st.sc?'원래 단위':'단위 맞춤'}일 때예요.`],
   ['fly','point',st.k===1?'k = 1이면 훈련 100%는 당연해. 검증을 봐야지.':(st.sc?'단위는 맞췄네. 이제 k를 몇으로 할지 곡선에서 골라 봐.':'분과 시간이 섞여 있는데 단위를 안 맞췄어? 경계가 세로로만 그어지잖아.')],
   ['robo',st.k===1?'happy':'firm',st.k===1?'훈련 100%! 이게 최고 아니야?':'k를 키우면 정보가 흐려지는 거 아닌가?']]);
  missions('knn-ms',ms,st);}
 return {init(){P=Plot(document.getElementById('knn-p'),{xr:[140,420],yr:[7,17],ticks:40,yticks:2,xlab:'일주일 운동 시간(분)',ylab:'한 달 독서 시간(시간)',aria:'동아리 배정 경계'});
   C=Plot(document.getElementById('knn-c'),{xr:[1,31],yr:[0.4,1],ticks:5,yticks:0.1,H:240,xlab:'k',ylab:'검증 맞힌 비율',aria:'k별 검증 정확도'});
   const s1=document.getElementById('knn-s1'),s2=document.getElementById('knn-s2'),b=document.getElementById('knn-b');
   s1.oninput=()=>{st.sig=+s1.value;st.touched=true;draw();};s2.oninput=()=>{st.k=+s2.value;st.touched=true;draw();};b.onclick=()=>{st.sc=!st.sc;b.classList.toggle('on',st.sc);b.textContent=st.sc?'단위 맞춤: 켬':'단위 맞춤: 끔';st.touched=true;draw();};draw();},draw,st,api:()=>({acc,ms})};})();
/* ───── 3. 복도 공사 현장 (선형 SVM) ───── */
T.corridor=(function(){const D=DS.sep,Cs=[0.01,0.03,0.1,0.3,1,3,10,30,100,1000];const st={on:true,pos:5.4,ci:9,touched:false};const cache={};
 const fit=(on,pos,C)=>{const key=on+'_'+pos+'_'+C;if(cache[key])return cache[key];const X=on?D.Xtr.concat([[pos/2+0.3,pos/2-0.3]]):D.Xtr,y=on?D.ytr.concat([1]):D.ytr;return cache[key]={m:ML.svm(X,y,{C}),X,y};};
 const vacc=r=>ML.acc(D.Xte.map(r.m.predict),D.yte);
 let P,Cc;const ms=[{text:'검증 정확도가 가장 높은 C 찾기 (가장 좋은 값과 0.5%p 이내)',test:s=>s.cur>=s.best-0.005},
  {text:'함정 관찰: 이상한 학생을 켜고 C = 1000으로 두어, 복도 폭이 0.2보다 좁아지는 것 확인하기',test:s=>s.on&&Cs[s.ci]===1000&&s.margin<0.2},
  {text:'조건 바꾸기: 이상한 학생을 끄면 C = 10과 C = 1000의 복도 폭이 같아지는지 확인하기(C ≥ 10에서 폭 0.8 이상)',test:s=>!s.on&&Cs[s.ci]>=10&&s.margin>0.8}];
 function draw(){const C=Cs[st.ci],r=fit(st.on,st.pos,C),m=r.m;document.getElementById('cor-v1').textContent=f1(st.pos);document.getElementById('cor-v2').textContent=C;
  P.region((x,y)=>m.predict([x,y]),30);P.clear('under');P.clear('main');P.clear('over');const n=Math.hypot(...m.w),u=[m.w[0]/n,m.w[1]/n],lo=(-1-m.bias)/n,hi=(1-m.bias)/n,pp=[-u[1],u[0]];
  const q=[[lo,-30],[lo,30],[hi,30],[hi,-30]].map(([t,s])=>[t*u[0]+s*pp[0],t*u[1]+s*pp[1]]);P.add('under','polygon',{points:q.map(p=>P.sx(p[0])+','+P.sy(p[1])).join(' '),fill:'rgba(241,198,74,0.28)'});
  P.lineEq('under',m.w[0],m.w[1],m.bias,{stroke:'#4a475a','stroke-width':2.5});const sv=new Set(m.sv);
  r.X.forEach((p,i)=>P.dot('main',p[0],p[1],r.y[i],{ring:sv.has(i)?'#22a45d':null,r:(st.on&&i===r.X.length-1)?7.5:5.5}));
  const ys=Cs.map(c=>vacc(fit(st.on,st.pos,c))),lx=Cs.map(c=>Math.log10(c));let bi=0;ys.forEach((v,i)=>{if(v>ys[bi])bi=i;});curve(Cc,lx,ys,{best:lx[bi],mine:Math.log10(C)});
  const cur=vacc(r),trA=ML.acc(r.X.map(m.predict),r.y);Object.assign(st,{cur,best:ys[bi],margin:m.margin});
  score('cor-score',[['복도 폭',f2(m.margin)+'눈금',m.margin>0.5],['서포트 벡터',m.sv.length+'명',null],['훈련 학생 맞힌 비율',pct(trA),null],['검증 학생 맞힌 비율',pct(cur),cur>=ys[bi]-0.005]]);
  const good=cur>=ys[bi]-0.005;
  talk('cor-talk',[['doc',good?'point':'think',good?`판정: 좋은 복도예요. 검증 ${pct(cur)}.`:`판정: 더 좋은 C가 있어요(C = ${Cs[bi]}에서 검증 ${pct(ys[bi])}).`],
   ['haru','firm',`보고해요. 복도 폭 ${f2(m.margin)}, 서포트 벡터 ${m.sv.length}명, 훈련 ${pct(trA)}.`],
   ['fly','point',st.on&&C>=100?'이상한 학생 하나 때문에 복도가 거의 없잖아. 그 학생 기록이 맞는지부터 의심해 봐.':(C<=0.03?'너무 너그러워서 여러 명을 대충 봐주는 거 아니야? 복도가 운동장 전체야.':'복도 폭이랑 검증 점수를 같이 봐.')],
   ['robo',C>=100?'happy':'firm',C>=100?'C = 1000이면 훈련 학생 하나도 안 틀린다고!':'C를 낮추면 틀리는 학생이 생기잖아. 불안한데.']]);
  missions('cor-ms',ms,st);}
 return {init(){P=Plot(document.getElementById('cor-p'),{aria:'복도 공사 현장'});Cc=Plot(document.getElementById('cor-c'),{xr:[-2,3],yr:[0.4,1],ticks:1,yticks:0.1,H:240,xlab:'log₁₀ C (−2 = 0.01, 3 = 1000)',ylab:'검증 맞힌 비율',aria:'C별 검증 정확도'});
   const s1=document.getElementById('cor-s1'),s2=document.getElementById('cor-s2'),b=document.getElementById('cor-b');
   s1.oninput=()=>{st.pos=+s1.value;st.touched=true;draw();};s2.oninput=()=>{st.ci=+s2.value;st.touched=true;draw();};b.onclick=()=>{st.on=!st.on;b.classList.toggle('on',st.on);b.textContent=st.on?'이상한 학생: 있음':'이상한 학생: 없음';st.touched=true;draw();};draw();},draw,st,api:()=>({fit,vacc,Cs,ms})};})();
/* ───── 4. 무대 조명실 (RBF SVM) ───── */
T.stage=(function(){const Gs=[0.03,0.1,0.3,1,3,10,30],Cs=[0.1,1,10,100];const st={blur:1,gi:3,ci:1,touched:false};const cache={};
 function data(b,n,seed){const r=rng(seed),X=[],y=[];for(let i=0;i<n;i++){const a=r()*2*Math.PI,rad=2.25+0.3*b*gauss(r);X.push([3+rad*Math.cos(a),3+rad*Math.sin(a)]);y.push(0);}
  for(let i=0;i<n;i++){const a=r()*2*Math.PI,rad=Math.abs(0.75+0.35*b*gauss(r));X.push([3+rad*Math.cos(a),3+rad*Math.sin(a)]);y.push(1);}return {X,y};}
 let tr,va;const fit=(gi,ci)=>{const k=st.blur+'_'+gi+'_'+ci;return cache[k]||(cache[k]=ML.svm(tr.X,tr.y,{kernel:'rbf',gamma:Gs[gi],C:Cs[ci]}));};
 let P,Cc;const ms=[{text:'검증 정확도가 가장 높은 γ·C 조합 찾기 (이 흐림에서 가장 좋은 값과 1%p 이내)',test:s=>s.cur>=s.best-0.01},
  {text:'함정 관찰: γ = 30에서 훈련은 99% 이상인데 검증이 15%p 넘게 낮은 것 확인하기',test:s=>Gs[s.gi]===30&&s.trA>=0.99&&s.trA-s.cur>0.15},
  {text:'조건 바꾸기: 흐림을 1.6 이상으로 올려도 γ를 0.3~1로 두면 검증 85% 이상이 유지되는지 확인하기',test:s=>s.blur>=1.6&&Gs[s.gi]>=0.3&&Gs[s.gi]<=1&&s.cur>=0.85}];
 function draw(){tr=data(st.blur,20,505);va=data(st.blur,100,606);const m=fit(st.gi,st.ci);document.getElementById('stg-v1').textContent=f1(st.blur);document.getElementById('stg-v2').textContent=Gs[st.gi];document.getElementById('stg-v3').textContent=Cs[st.ci];
  P.region((x,y)=>m.predict([x,y]),34);P.clear('main');const sv=new Set(m.sv);tr.X.forEach((p,i)=>P.dot('main',p[0],p[1],tr.y[i],{r:4.5,fill:tr.y[i]?'#f08a24':undefined,ring:sv.has(i)?'#22a45d':null}));
  let best=0;const grid={};Gs.forEach((g,gi)=>Cs.forEach((c,ci)=>{const a=ML.acc(va.X.map(fit(gi,ci).predict),va.y);grid[gi+'_'+ci]=a;if(a>best)best=a;}));
  const lx=Gs.map(g=>Math.log10(g)),ys=Gs.map((g,gi)=>grid[gi+'_'+st.ci]);let bi=0;ys.forEach((v,i)=>{if(v>ys[bi])bi=i;});curve(Cc,lx,ys,{best:lx[bi],mine:Math.log10(Gs[st.gi])});
  const cur=grid[st.gi+'_'+st.ci],trA=ML.acc(tr.X.map(m.predict),tr.y);Object.assign(st,{cur,trA,best});
  score('stg-score',[['검증 학생 맞힌 비율',pct(cur),cur>=best-0.01],['훈련 학생 맞힌 비율',pct(trA),null],['서포트 벡터(모닥불)',m.sv.length+' / 40명',m.sv.length<35],['외운 정도(훈련 − 검증)',f1((trA-cur)*100)+'%p',trA-cur<0.1]]);
  const good=cur>=best-0.01;
  talk('stg-talk',[['doc',good?'spark':'think',good?`판정: 조명이 딱 맞아요. 검증 ${pct(cur)}.`:`판정: 이 흐림에서 가능한 가장 좋은 검증은 ${pct(best)}예요. 손잡이를 더 돌려 보세요.`],
   ['haru','firm',`보고해요. 훈련 ${pct(trA)}, 검증 ${pct(cur)}, 모닥불 ${m.sv.length}개.`],
   ['fly','point',Gs[st.gi]>=10?'모닥불이 너무 좁아. 학생마다 섬이 생겼잖아. 외운 거야.':(Gs[st.gi]<=0.03?'모닥불이 너무 넓어서 무대랑 트랙이 다 같은 온기야. 경계가 거의 곧은 줄이네.':'적당해 보여. 그래도 C도 바꿔서 확인해 봐.')],
   ['robo',st.trA===1?'happy':'firm',st.trA===1?'훈련 100%면 된 거 아니야?':'γ를 확 올려서 다 맞혀 버리자.']]);
  missions('stg-ms',ms,st);}
 return {init(){P=Plot(document.getElementById('stg-p'),{aria:'무대 조명실 경계'});Cc=Plot(document.getElementById('stg-c'),{xr:[-1.6,1.6],yr:[0.4,1],ticks:0.5,yticks:0.1,H:240,xlab:'log₁₀ γ (−1.5 ≈ 0.03, 1.5 ≈ 30)',ylab:'검증 맞힌 비율',aria:'γ별 검증 정확도'});
   const s1=document.getElementById('stg-s1'),s2=document.getElementById('stg-s2'),s3=document.getElementById('stg-s3');
   s1.oninput=()=>{st.blur=+s1.value;st.touched=true;draw();};s2.oninput=()=>{st.gi=+s2.value;st.touched=true;draw();};s3.oninput=()=>{st.ci=+s3.value;st.touched=true;draw();};draw();},draw,st,api:()=>({fit,Gs,Cs,ms,data})};})();
/* 탭 */
const inited={};function open(name){if(!T[name])name='flag';cur=name;document.querySelectorAll('.scene').forEach(s=>s.classList.toggle('hidden',s.id!=='sc-'+name));
 document.querySelectorAll('.tabs button').forEach(b=>b.classList.toggle('on',b.dataset.t===name));if(!inited[name]){T[name].init();inited[name]=true;}if(location.hash!=='#'+name)history.replaceState(null,'','#'+name);}
document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>open(b.dataset.t));window.addEventListener('hashchange',()=>open(location.hash.slice(1)));
open(location.hash.slice(1)||'flag');window.__PR=T;
})();
