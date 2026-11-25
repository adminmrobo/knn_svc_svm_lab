/* part2.js — 파트 2 실험 */
(function(){const {Plot,f1,f2,pct}=LAB,D=DS;
const knnAcc=(Xtr,ytr,Xte,yte,k,f)=>{f=f||(v=>v);const A=Xtr.map(f);return ML.acc(Xte.map(q=>ML.knn(A,ytr,f(q),k).label),yte);};
/* 챕터 6 */
(function(){const K=D.knn3,P=Plot(document.getElementById('p6'),{aria:'이웃 투표'});const sl=document.getElementById('s6');let s=[2.5,1.9],reg=false;
 function draw(){const k=+sl.value;document.getElementById('v6').textContent=k;const r=ML.knn(K.X,reg?K.t:K.y,s,k,reg),rad=r.nb[k-1].d;
  P.clear('under');P.clear('main');P.clear('over');P.add('under','circle',{cx:P.sx(s[0]),cy:P.sy(s[1]),r:P.sx(s[0]+rad)-P.sx(s[0]),fill:'rgba(34,164,93,0.06)',stroke:'#22a45d','stroke-dasharray':'6 4','stroke-width':2});
  r.nb.forEach(n=>P.line('under',s[0],s[1],K.X[n.i][0],K.X[n.i][1],{stroke:'#22a45d','stroke-width':1.5}));
  P.points('main',K.X,K.y,i=>({ring:r.nb.some(n=>n.i===i)?'#22a45d':null}));if(reg)K.X.forEach((p,i)=>P.text('over',p[0]+0.12,p[1]+0.12,K.t[i]+'분',{'font-size':10,fill:'#555'}));
  P.dot('over',s[0],s[1],'star');const out=document.getElementById('r6');
  const lst=r.nb.map((n,j)=>`${j+1}. ${K.y[n.i]?'<span style="color:#e0533d">빨강</span>':'<span style="color:#3d7bd9">파랑</span>'} (${K.X[n.i].join(', ')}) 거리 ${f2(n.d)}${reg?' · '+K.t[n.i]+'분':''}`).join('<br>');
  if(reg)out.innerHTML=`<b>가까운 ${k}명의 등교 시간 평균</b><div class="big">${f1(r.label)}분</div>${lst}`;
  else{const v0=r.votes[0]||0,v1=r.votes[1]||0;out.innerHTML=`<b>투표</b> 파랑 ${v0}표 · 빨강 ${v1}표<div class="big">→ ${r.label?'<span style="color:#e0533d">빨강(축구부)</span>':'<span style="color:#3d7bd9">파랑(독서부)</span>'}</div>${lst}`;}}
 P.onClick((x,y)=>{s=[Math.round(x*10)/10,Math.round(y*10)/10];draw();},{at:()=>s});sl.oninput=draw;
 const a=document.getElementById('b6a'),b=document.getElementById('b6b');a.onclick=()=>{reg=false;a.classList.add('on');b.classList.remove('on');draw();};b.onclick=()=>{reg=true;b.classList.add('on');a.classList.remove('on');draw();};
 document.getElementById('b6c').onclick=()=>{s=[2.5,1.9];draw();};draw();})();
/* 챕터 7 */
(function(){const N=D.noisy,P=Plot(document.getElementById('p7'),{aria:'k에 따른 경계'});const sl=document.getElementById('s7');let showTe=false;
 const ks=[];for(let k=1;k<=25;k+=2)ks.push(k);const te=ks.map(k=>knnAcc(N.Xtr,N.ytr,N.Xte,N.yte,k)),tr=ks.map(k=>knnAcc(N.Xtr,N.ytr,N.Xtr,N.ytr,k));
 const C=Plot(document.getElementById('p7c'),{xr:[1,25],yr:[0.8,1],H:200,W:360,ticks:4,yticks:0.05,xlab:'k',ylab:'맞힌 비율',aria:'k에 따른 점수'});
 function chart(k){C.clear('main');C.clear('over');const pl=(arr,c,d)=>{for(let i=1;i<ks.length;i++)C.line('main',ks[i-1],arr[i-1],ks[i],arr[i],{stroke:c,'stroke-width':2.5,'stroke-dasharray':d||''});};
  pl(tr,'#9a97aa','5 4');pl(te,'#7b4fd6');C.line('over',k,0.8,k,1,{stroke:'#22a45d','stroke-width':2});C.text('over',2,0.985,'— 처음 보는 학생',{fill:'#7b4fd6','font-size':11,'font-weight':700});C.text('over',2,0.965,'- - 훈련 학생',{fill:'#77748a','font-size':11});}
 function draw(){const k=+sl.value;document.getElementById('v7').textContent=k;const i=ks.indexOf(k);
  P.region((x,y)=>ML.knn(N.Xtr,N.ytr,[x,y],k).label,40);P.clear('main');P.points('main',N.Xtr,N.ytr,{r:4.5});P.clear('over');
  if(showTe)N.Xte.forEach((p,j)=>P.dot('over',p[0],p[1],N.yte[j],{r:3.5,fill:'#fff',stroke:LAB.COL[N.yte[j]]}));
  document.getElementById('r7').innerHTML=`<div>훈련 학생 맞힌 비율<b>${pct(tr[i])}</b></div><div>처음 보는 학생 맞힌 비율<b>${pct(te[i])}</b></div><div>차이(외운 정도)<b>${f1((tr[i]-te[i])*100)}%p</b></div><div>판정<b>${k===1?'외우기 의심':(te[i]>=Math.max(...te)-1e-9?'가장 좋음':'보통')}</b></div>`;chart(k);}
 sl.oninput=draw;document.getElementById('b7a').onclick=e=>{showTe=!showTe;e.target.classList.toggle('on',showTe);draw();};draw();})();
/* 챕터 8 */
const Fr=D.fruit,mm=ML.minmax(Fr.Xtr);
(function(){const P=Plot(document.getElementById('p8'),{xr:[160,400],yr:[8,16],ticks:40,yticks:2,xlab:'일주일 운동 시간(분)',ylab:'한 달 독서 시간(시간)',aria:'단위 맞추기'});
 const sl=document.getElementById('s8');let sc=false,s=[300,12];
 function draw(){const k=+sl.value;document.getElementById('v8').textContent=k;const f=sc?mm.f:(v=>v);const A=Fr.Xtr.map(f),r=ML.knn(A,Fr.ytr,f(s),k);
  P.clear('main');P.clear('over');P.clear('under');r.nb.forEach(n=>P.line('under',s[0],s[1],Fr.Xtr[n.i][0],Fr.Xtr[n.i][1],{stroke:'#22a45d','stroke-width':1.3}));
  P.points('main',Fr.Xtr,Fr.ytr,i=>({ring:r.nb.some(n=>n.i===i)?'#22a45d':null}));P.dot('over',s[0],s[1],'star');
  const acc=knnAcc(Fr.Xtr,Fr.ytr,Fr.Xte,Fr.yte,k,f);
  document.getElementById('r8').innerHTML=`전학생 (${Math.round(s[0])}분, ${f1(s[1])}시간)${sc?` → 맞춘 값 (${f2(mm.f(s)[0])}, ${f2(mm.f(s)[1])})`:''}<br>이웃 ${k}명 투표 → <b>${r.label?'축구부':'독서부'}</b><div class="big">처음 보는 학생 맞힌 비율 ${pct(acc)}</div><span class="note">${sc?'두 특징이 같은 무게로 들어갑니다.':'운동 시간(분) 차이가 거리를 거의 다 정합니다. 이웃이 세로로 길게 뽑혀요.'}</span>`;}
 P.onClick((x,y)=>{s=[Math.round(x),Math.round(y*10)/10];draw();},{at:()=>s});sl.oninput=draw;
 const a=document.getElementById('b8a'),b=document.getElementById('b8b');a.onclick=()=>{sc=false;a.classList.add('on');b.classList.remove('on');draw();};b.onclick=()=>{sc=true;b.classList.add('on');a.classList.remove('on');draw();};draw();})();
/* 라운드 2 */
const fly=knnAcc(Fr.Xtr,Fr.ytr,Fr.Xte,Fr.yte,7,mm.f),robo=knnAcc(Fr.Xtr,Fr.ytr,Fr.Xte,Fr.yte,1);
LAB.battle('arena2',{fly,robo,flyMood:fly>robo+0.03?'happy':(robo>fly+0.03?'sad':'think'),roboMood:robo>fly+0.03?'happy':(fly>robo+0.03?'sad':'think')});
const t=document.getElementById('t2');[1,7].forEach(k=>{const r=t.insertRow();r.innerHTML=`<th>k = ${k}</th><td>${pct(knnAcc(Fr.Xtr,Fr.ytr,Fr.Xte,Fr.yte,k))}</td><td>${pct(knnAcc(Fr.Xtr,Fr.ytr,Fr.Xte,Fr.yte,k,mm.f))}</td>`;});
window.__P2={fly,robo};
})();
