/* part4.js — 파트 4 실험 */
(function(){const {Plot,el,f1,f2,pct,COL}=LAB,D=DS,R=D.ring;
const lin=ML.svm(R.Xtr,R.ytr,{C:1});const linTe=ML.acc(R.Xte.map(lin.predict),R.yte),linTr=ML.acc(R.Xtr.map(lin.predict),R.ytr);
/* 챕터 14 */
(function(){const A=Plot(document.getElementById('p14a'),{aria:'곧은 줄 SVM의 실패'});A.region((x,y)=>lin.predict([x,y]),30);A.lineEq('under',lin.w[0],lin.w[1],lin.bias,{stroke:'#4a475a','stroke-width':2.5});A.points('main',R.Xtr,R.ytr,{r:4.5});
 A.text('over',0.2,5.6,'곧은 줄 SVM',{'font-weight':700,fill:'#4a475a'});
 const xs=[-2.8,-2.3,-1.8,1.7,2.2,2.6,-1.1,-0.7,-0.3,0.2,0.6,1.0],ys=[0,0,0,0,0,0,1,1,1,1,1,1];
 const B=Plot(document.getElementById('p14b'),{xr:[-3,3],yr:[-0.5,9],yticks:2,xlab:'수직선 위 위치 x',ylab:'높이 = x² × 들어 올린 정도',aria:'들어 올리기'});const sl=document.getElementById('s14');
 function draw(){const t=+sl.value/100;document.getElementById('v14').textContent=Math.round(t*100);B.clear('main');B.clear('under');B.clear('over');
  B.line('under',-3,0,3,0,{stroke:'#9a97aa'});xs.forEach((x,i)=>{B.line('under',x,0,x,t*x*x,{stroke:'#d9d6e3','stroke-dasharray':'2 3'});B.dot('main',x,t*x*x,ys[i]);});
  const hi=Math.max(...xs.filter((_,i)=>ys[i]).map(x=>t*x*x)),lo=Math.min(...xs.filter((_,i)=>!ys[i]).map(x=>t*x*x));let msg;
  if(lo>hi+0.05){const h=(lo+hi)/2;B.line('over',-3,h,3,h,{stroke:'#7b4fd6','stroke-width':2.5});msg=`<div class="big good">수평선 하나로 12명 모두 갈림</div>수평선 높이 ≈ ${f2(h)}`;}
  else msg='<div class="big badc">아직 수평선 하나로는 못 가름</div>수직선 위에서는 합창부가 가운데, 육상부가 양끝이라 경계가 두 군데 필요해요.';
  document.getElementById('r14').innerHTML=`<b>곧은 줄 SVM(왼쪽)</b>: 훈련 ${pct(linTr)}, 처음 보는 학생 ${pct(linTe)}<br><b>들어 올리기(오른쪽)</b>: ${msg}`;}
 sl.oninput=draw;draw();})();
/* 챕터 15 */
const Z=p=>(p[0]-3)**2+(p[1]-3)**2;
(function(){const host=document.getElementById('p15');const W=360,H=330;const svg=el('svg',{viewBox:`0 0 ${W} ${H}`,role:'img','aria-label':'3차원으로 들어 올린 운동장'},host);
 const sa=document.getElementById('s15a'),sb=document.getElementById('s15b'),sc=document.getElementById('s15c');
 const B=Plot(document.getElementById('p15b'),{aria:'내려놓은 경계',H:260,W:300});
 function prj(x,y,z,t,A){const X=x-3,Y=y-3,c=Math.cos(A),s=Math.sin(A),Xr=X*c-Y*s,Yr=X*s+Y*c;return [W/2+Xr*42,H*0.72+Yr*20-z*t*20];}
 function draw(){const t=+sa.value/100,A=+sb.value*Math.PI/180,h=+sc.value;['v15a','v15b','v15c'].forEach((id,i)=>document.getElementById(id).textContent=[Math.round(t*100),sb.value,f2(h)][i]);
  svg.innerHTML='';const g=[[0,0],[6,0],[6,6],[0,6]];el('polygon',{points:g.map(p=>prj(p[0],p[1],0,t,A).join(',')).join(' '),fill:'#f3f1f8',stroke:'#cfcbd9'},svg);
  const pts=R.Xtr.map((p,i)=>({p,c:R.ytr[i],z:Z(p)}));const below=pts.filter(o=>o.z<h),above=pts.filter(o=>o.z>=h);
  const dot=o=>{const [X,Y]=prj(o.p[0],o.p[1],o.z,t,A),[X0,Y0]=prj(o.p[0],o.p[1],0,t,A);el('line',{x1:X0,y1:Y0,x2:X,y2:Y,stroke:'#d9d6e3'},svg);
   if(o.c===1)el('path',{d:`M${X},${Y-6}L${X+6},${Y+5}L${X-6},${Y+5}Z`,fill:'#f08a24',stroke:'#fff'},svg);else el('circle',{cx:X,cy:Y,r:5,fill:COL[0],stroke:'#fff'},svg);};
  below.forEach(dot);el('polygon',{points:g.map(p=>prj(p[0],p[1],h,t,A).join(',')).join(' '),fill:'rgba(123,79,214,0.18)',stroke:'#7b4fd6','stroke-width':1.5},svg);above.forEach(dot);
  const ok=pts.filter(o=>(o.z<h?1:0)===o.c).length,te=R.Xte.filter((p,i)=>(Z(p)<h?1:0)===R.yte[i]).length/R.yte.length;
  document.getElementById('r15').innerHTML=`판자 높이 ${f2(h)} → 내려놓은 경계: 반지름 √${f2(h)} ≈ <b>${f2(Math.sqrt(h))}</b>인 동그라미<div class="big">훈련 ${ok} / 40명 · 처음 보는 학생 ${pct(te)}</div><span class="note">보라 판자 아래 = 합창부로 판정</span>`;
  B.clear('main');B.clear('under');B.add('under','circle',{cx:B.sx(3),cy:B.sy(3),r:B.sx(3+Math.sqrt(h))-B.sx(3),fill:'rgba(240,138,36,0.12)',stroke:'#7b4fd6','stroke-width':2.5});
  R.Xtr.forEach((p,i)=>B.dot('main',p[0],p[1],R.ytr[i],{r:4,fill:R.ytr[i]?'#f08a24':undefined}));}
 [sa,sb,sc].forEach(e=>e.oninput=draw);draw();
 let best=0,bh=0;for(let h=0;h<=8;h+=0.25){const ok=R.Xtr.filter((p,i)=>(Z(p)<h?1:0)===R.ytr[i]).length;if(ok>best){best=ok;bh=h;}}window.__P4a={best,bh};})();
/* 챕터 16 */
const Gs=[0.05,0.1,0.5,1,5,50];
(function(){const P=Plot(document.getElementById('p16'),{xr:[0,5],yr:[0,5],aria:'두 학생의 닮음'});const sl=document.getElementById('s16');let a=[1,2],b=[3,1];
 const C=Plot(document.getElementById('p16b'),{xr:[0,5],yr:[0,1],H:200,W:340,yticks:0.25,xlab:'두 학생 사이 거리',ylab:'RBF 닮음',aria:'거리에 따른 닮음'});
 function draw(){const g=Gs[+sl.value];document.getElementById('v16').textContent=g;P.clear('main');P.clear('over');P.clear('under');
  P.line('under',a[0],a[1],b[0],b[1],{stroke:'#7b4fd6','stroke-dasharray':'5 4'});P.dot('over',a[0],a[1],0,{r:8});P.dot('over',b[0],b[1],1,{r:8});P.text('over',a[0]+0.15,a[1]+0.2,'a',{'font-weight':700});P.text('over',b[0]+0.15,b[1]+0.2,'b',{'font-weight':700});
  const dt=a[0]*b[0]+a[1]*b[1],d2=(a[0]-b[0])**2+(a[1]-b[1])**2,r2=Math.SQRT2,pa=[a[0]**2,r2*a[0]*a[1],a[1]**2],pb=[b[0]**2,r2*b[0]*b[1],b[1]**2],pp=pa[0]*pb[0]+pa[1]*pb[1]+pa[2]*pb[2],K=Math.exp(-g*d2);
  document.getElementById('r16').innerHTML=`a = (${f1(a[0])}, ${f1(a[1])}), b = (${f1(b[0])}, ${f1(b[1])})<div class="tbl"><table><tr><th>원래 카드로</th><th>올라간 카드로</th></tr><tr><td>(a·b)² = ${f2(dt)}² = <b>${f2(dt*dt)}</b></td><td>φ(a)·φ(b) = ${f2(pa[0]*pb[0])} + ${f2(pa[1]*pb[1])} + ${f2(pa[2]*pb[2])} = <b>${f2(pp)}</b></td></tr></table></div>거리² = ${f2(d2)} → RBF 닮음 exp(−${g} × ${f2(d2)}) = <b>${f2(K)}</b>`;
  C.clear('main');C.clear('over');let prev=null;for(let d=0;d<=5.001;d+=0.05){const k=Math.exp(-g*d*d);if(prev)C.line('main',prev[0],prev[1],d,k,{stroke:'#e07a3d','stroke-width':2.5});prev=[d,k];}
  C.dot('over',Math.min(5,Math.sqrt(d2)),K,0,{fill:'#7b4fd6',r:6});}
 const snap=v=>Math.round(v*10)/10;P.drag(()=>[a,b],(k,x,y)=>{(k?b:a).splice(0,2,snap(x),snap(y));draw();});sl.oninput=draw;draw();})();
/* 챕터 17 */
const G7=[0.1,0.5,1,5,50],cache={};
const model=(k,g,C)=>{const key=k+g+'_'+C;return cache[key]||(cache[key]=ML.svm(R.Xtr,R.ytr,{C,kernel:k,gamma:k==='poly'?0.3:g,degree:2}));};
(function(){const P=Plot(document.getElementById('p17'),{aria:'커널 SVM 경계'});const sl=document.getElementById('s17a');let k='rbf',C=1;
 function draw(){const g=G7[+sl.value];document.getElementById('v17a').textContent=k==='rbf'?g:(k==='poly'?'0.3 (다항은 고정)':'— (선형은 안 씀)');const m=model(k,g,C);
  P.region((x,y)=>m.predict([x,y]),36);P.clear('main');const sv=new Set(m.sv);R.Xtr.forEach((p,i)=>P.dot('main',p[0],p[1],R.ytr[i],{r:4.5,fill:R.ytr[i]?'#f08a24':undefined,ring:sv.has(i)?'#22a45d':null}));
  const tr=ML.acc(R.Xtr.map(m.predict),R.ytr),te=ML.acc(R.Xte.map(m.predict),R.yte);
  document.getElementById('r17').innerHTML=`<div>훈련 학생<b>${pct(tr)}</b></div><div>처음 보는 학생<b>${pct(te)}</b></div><div>서포트 벡터(모닥불)<b>${m.sv.length} / 40명</b></div><div>판정<b>${tr-te>0.15?'외우기 의심':(te>=0.95?'좋음':'보통')}</b></div>`;}
 sl.oninput=draw;document.querySelectorAll('#k17 button').forEach(b=>b.onclick=()=>{k=b.dataset.k;document.querySelectorAll('#k17 button').forEach(x=>x.classList.toggle('on',x===b));draw();});
 document.querySelectorAll('#c17 button').forEach(b=>b.onclick=()=>{C=+b.dataset.c;document.querySelectorAll('#c17 button').forEach(x=>x.classList.toggle('on',x===b));draw();});draw();})();
/* 결승 */
const fly=ML.acc(R.Xte.map(q=>ML.knn(R.Xtr,R.ytr,q,5).label),R.yte),rm=model('rbf',0.5,1),robo=ML.acc(R.Xte.map(rm.predict),R.yte);
LAB.battle('arena4',{fly,robo,flyMood:fly>robo+0.03?'happy':(robo>fly+0.03?'sad':'think'),roboMood:robo>fly+0.03?'happy':(fly>robo+0.03?'sad':'think'),docMood:Math.abs(fly-robo)<=0.03?'spark':'point'});
window.__P4={fly,robo,linTe,linTr,nsv:rm.sv.length,g50:(()=>{const m=model('rbf',50,1);return [ML.acc(R.Xte.map(m.predict),R.yte),m.sv.length];})(),poly:ML.acc(R.Xte.map(model('poly',0,1).predict),R.yte)};
})();
