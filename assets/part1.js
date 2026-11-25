/* part1.js — 파트 1 실험 */
(function(){const {Plot,Strip,f1,f2,pct}=LAB,D=DS;
const F=D.flags, mean=(X,y,c)=>{const p=X.filter((_,i)=>y[i]===c);return [p.reduce((s,v)=>s+v[0],0)/p.length,p.reduce((s,v)=>s+v[1],0)/p.length];};
/* 챕터 1 */
(function(){const P=Plot(document.getElementById('p1'),{aria:'운동장 지도와 전학생 카드'});let s=[2.5,1.9];
 function draw(){P.clear('main');P.clear('over');P.points('main',F.X,F.y,{fill:undefined});P.arrow('over',0,0,s[0],s[1],'#7b4fd6');P.dot('over',s[0],s[1],'star');
  P.line('over',s[0],0,s[0],s[1],{stroke:'#e8554e','stroke-dasharray':'4 3','stroke-width':1.5});P.line('over',0,s[1],s[0],s[1],{stroke:'#3fb37f','stroke-width':1.5,'stroke-dasharray':'4 3'});
  document.getElementById('r1').innerHTML=`<div class="big">x = (${f1(s[0])}, ${f1(s[1])})</div><span style="color:#c0392b">X1 · 가로 위치 x₁ = ${f1(s[0])}</span><br><span style="color:#23744f">X2 · 세로 위치 x₂ = ${f1(s[1])}</span><br>숫자가 2개인 카드 → d = 2`;}
 P.onClick((x,y)=>{s=[x,y];draw();},{at:()=>s});draw();})();
/* 챕터 2 */
(function(){const P=Plot(document.getElementById('p2'),{aria:'두 점 사이 거리'});let A=[1,2],B=[4,6];
 function draw(){P.clear('main');P.clear('over');P.line('main',A[0],A[1],B[0],A[1],{stroke:'#e8554e','stroke-dasharray':'5 4'});P.line('main',B[0],A[1],B[0],B[1],{stroke:'#3fb37f','stroke-dasharray':'5 4'});
  P.line('main',A[0],A[1],B[0],B[1],{stroke:'#7b4fd6','stroke-width':3});P.dot('over',A[0],A[1],0,{r:8});P.dot('over',B[0],B[1],1,{r:8});
  P.text('over',A[0],A[1]-0.35,'A',{'font-weight':700});P.text('over',B[0]+0.15,B[1]+0.15,'B',{'font-weight':700});
  const dx=B[0]-A[0],dy=B[1]-A[1],d=Math.hypot(dx,dy);
  document.getElementById('r2').innerHTML=`A = (${f1(A[0])}, ${f1(A[1])}), B = (${f1(B[0])}, ${f1(B[1])})<br>가로 차이 ${f1(dx)}, 세로 차이 ${f1(dy)}<br>√(${f1(dx)}² + ${f1(dy)}²) = √${f2(dx*dx+dy*dy)}<div class="big">거리 ≈ ${f2(d)}</div><span class="note">ㄱ자로 걸으면 ${f2(Math.abs(dx)+Math.abs(dy))} — 대각선이 더 짧아요</span>`;}
 const snap=v=>Math.round(v*10)/10;P.drag(()=>[A,B],(k,x,y)=>{(k?B:A).splice(0,2,snap(x),snap(y));draw();});
 document.getElementById('b2a').onclick=()=>{A=[1,2];B=[4,6];draw();};draw();})();
/* 챕터 3 */
(function(){const P=Plot(document.getElementById('p3'),{aria:'깃발과 전학생'});let s=[2,2],flags=false,bd=false;const m0=mean(F.X,F.y,0),m1=mean(F.X,F.y,1);
 function draw(){P.clear('main');P.clear('over');P.clear('region');P.clear('under');
  if(bd){P.region((x,y)=>Math.hypot(x-m1[0],y-m1[1])<Math.hypot(x-m0[0],y-m0[1])?1:0,30);P.lineEq('under',m1[0]-m0[0],m1[1]-m0[1],-((m1[0]**2+m1[1]**2)-(m0[0]**2+m0[1]**2))/2,{stroke:'#4a475a','stroke-width':2.5});}
  P.points('main',F.X,F.y);P.dot('over',s[0],s[1],'star');const r=document.getElementById('r3');
  if(flags){P.flag('over',m0[0],m0[1],'#3d7bd9');P.flag('over',m1[0],m1[1],'#e0533d');const d0=Math.hypot(s[0]-m0[0],s[1]-m0[1]),d1=Math.hypot(s[0]-m1[0],s[1]-m1[1]);
   P.line('under',s[0],s[1],m0[0],m0[1],{stroke:'#3d7bd9','stroke-dasharray':'4 3'});P.line('under',s[0],s[1],m1[0],m1[1],{stroke:'#e0533d','stroke-dasharray':'4 3'});
   r.innerHTML=`독서부 깃발 (${f1(m0[0])}, ${f1(m0[1])})까지 <b>${f2(d0)}</b><br>축구부 깃발 (${f1(m1[0])}, ${f1(m1[1])})까지 <b>${f2(d1)}</b><div class="big">→ ${Math.abs(d0-d1)<1e-9?'똑같아요(경계선 위)':(d1<d0?'<span style="color:#e0533d">축구부</span>':'<span style="color:#3d7bd9">독서부</span>')}</div>지도를 눌러 전학생을 옮겨 보세요.`;}}
 P.onClick((x,y)=>{s=[x,y];draw();},{at:()=>s});
 document.getElementById('b3a').onclick=e=>{flags=true;e.target.classList.add('on');draw();};
 document.getElementById('b3b').onclick=e=>{flags=true;bd=!bd;e.target.classList.toggle('on',bd);draw();};
 document.getElementById('b3c').onclick=()=>{s=[2,2];draw();};draw();})();
/* 챕터 4 */
(function(){const P=Plot(document.getElementById('p4'),{aria:'그림자 점수'});const S=Strip(document.getElementById('p4s'));let s=[2,2],sh=true;
 const m0=mean(F.X,F.y,0),m1=mean(F.X,F.y,1),w=[m1[0]-m0[0],m1[1]-m0[1]],t=w[0]*(m0[0]+m1[0])/2+w[1]*(m0[1]+m1[1])/2,nw=Math.hypot(...w),u=[w[0]/nw,w[1]/nw];
 const foot=p=>{const k=(p[0]-m0[0])*u[0]+(p[1]-m0[1])*u[1];return [m0[0]+k*u[0],m0[1]+k*u[1]];},z=p=>w[0]*p[0]+w[1]*p[1];
 function draw(){P.clear('main');P.clear('over');P.clear('under');P.clear('region');
  P.region((x,y)=>z([x,y])>t?1:0,30);P.lineEq('under',w[0],w[1],-t,{stroke:'#4a475a','stroke-width':2.5});
  if(sh){P.line('under',m0[0]-3*u[0],m0[1]-3*u[1],m1[0]+3*u[0],m1[1]+3*u[1],{stroke:'#b8b2cc','stroke-width':6,'stroke-linecap':'round'});
   F.X.concat([s]).forEach(p=>{const q=foot(p);P.line('under',p[0],p[1],q[0],q[1],{stroke:'#9a97aa','stroke-dasharray':'2 3','stroke-width':1.2});});}
  P.points('main',F.X,F.y);P.flag('over',m0[0],m0[1],'#3d7bd9');P.flag('over',m1[0],m1[1],'#e0533d');P.arrow('over',m0[0],m0[1],m1[0],m1[1],'#7b4fd6');P.dot('over',s[0],s[1],'star');
  const zs=z(s);S.draw([{vals:F.X.filter((_,i)=>F.y[i]===0).map(z),cls:0},{vals:F.X.filter((_,i)=>F.y[i]===1).map(z),cls:1},{vals:[zs],cls:'star'}],[{v:t,label:'합격선 '+f2(t)}],[Math.min(0,zs-0.5),Math.max(10,zs+0.5)]);
  document.getElementById('r4').innerHTML=`무게 w = (${f1(w[0])}, ${f1(w[1])})<br>점수 z = ${f1(w[0])} × ${f1(s[0])} + ${f1(w[1])} × ${f1(s[1])} = <b>${f2(zs)}</b><div class="big">${zs>t?'<span style="color:#e0533d">'+f2(zs)+' &gt; '+f2(t)+' → 축구부</span>':'<span style="color:#3d7bd9">'+f2(zs)+' ≤ '+f2(t)+' → 독서부</span>'}</div>`;}
 P.onClick((x,y)=>{s=[Math.round(x*10)/10,Math.round(y*10)/10];draw();},{at:()=>s});
 document.getElementById('b4a').onclick=e=>{sh=!sh;e.target.classList.toggle('on',sh);draw();};document.getElementById('b4b').onclick=()=>{s=[2,2];draw();};draw();})();
/* 챕터 5 + 라운드 1 */
const L=D.lda,m0=mean(L.Xtr,L.ytr,0),m1=mean(L.Xtr,L.ytr,1);
function sw(){let a=0,b=0,c=0;L.Xtr.forEach((p,i)=>{const m=L.ytr[i]?m1:m0,dx=p[0]-m[0],dy=p[1]-m[1];a+=dx*dx;b+=dx*dy;c+=dy*dy;});return [a,b,c];}
const [a,b,c]=sw(),det=a*c-b*b,dm=[m1[0]-m0[0],m1[1]-m0[1]];const wF=[(c*dm[0]-b*dm[1])/det,(-b*dm[0]+a*dm[1])/det];
const angOf=w=>{let g=Math.atan2(w[1],w[0])*180/Math.PI;if(g>90)g-=180;if(g<-90)g+=180;return g;};
function rule(u){const t=u[0]*(m0[0]+m1[0])/2+u[1]*(m0[1]+m1[1])/2,sg=Math.sign(u[0]*m1[0]+u[1]*m1[1]-t)||1;return {t,pred:p=>((u[0]*p[0]+u[1]*p[1]-t)*sg>0)?1:0};}
function stats(u){const z0=[],z1=[];L.Xtr.forEach((p,i)=>(L.ytr[i]?z1:z0).push(u[0]*p[0]+u[1]*p[1]));const mu=v=>v.reduce((s,x)=>s+x,0)/v.length,va=v=>{const m=mu(v);return v.reduce((s,x)=>s+(x-m)**2,0)/v.length;};
  const sep=(mu(z1)-mu(z0))**2,spr=va(z0)+va(z1);return {z0,z1,sep,spr,J:sep/spr};}
const accOn=(u,X,y)=>{const r=rule(u);return X.filter((p,i)=>r.pred(p)===y[i]).length/y.length;};
(function(){const P=Plot(document.getElementById('p5'),{aria:'그림자 방향 돌리기'});const S=Strip(document.getElementById('p5s'));const sl=document.getElementById('s5');const c0=[(m0[0]+m1[0])/2,(m0[1]+m1[1])/2];
 function draw(){const g=+sl.value,u=[Math.cos(g*Math.PI/180),Math.sin(g*Math.PI/180)],r=rule(u),st=stats(u);document.getElementById('v5').textContent=g+'°';
  P.clear('region');P.clear('under');P.clear('main');P.clear('over');P.region((x,y)=>r.pred([x,y]),30);P.lineEq('under',u[0],u[1],-r.t,{stroke:'#4a475a','stroke-width':2.5});
  P.line('under',c0[0]-4*u[0],c0[1]-4*u[1],c0[0]+4*u[0],c0[1]+4*u[1],{stroke:'#b8b2cc','stroke-width':5,'stroke-linecap':'round'});
  P.points('main',L.Xtr,L.ytr,{r:4.5});P.flag('over',m0[0],m0[1],'#3d7bd9');P.flag('over',m1[0],m1[1],'#e0533d');P.arrow('over',c0[0]-1.2*u[0],c0[1]-1.2*u[1],c0[0]+1.2*u[0],c0[1]+1.2*u[1],'#7b4fd6');
  const all=st.z0.concat(st.z1);S.draw([{vals:st.z0,cls:0},{vals:st.z1,cls:1}],[{v:r.t,label:'합격선'}],[Math.min(...all)-.2,Math.max(...all)+.2]);
  document.getElementById('r5').innerHTML=`<div>떨어짐(평균 차이²)<b>${f2(st.sep)}</b></div><div>퍼짐의 합<b>${f2(st.spr)}</b></div><div>J = 떨어짐 ÷ 퍼짐<b>${f1(st.J)}</b></div><div>훈련 학생 맞힌 비율<b>${pct(accOn(u,L.Xtr,L.ytr))}</b></div>`;}
 sl.oninput=draw;document.getElementById('b5a').onclick=()=>{sl.value=Math.round(angOf(dm));draw();};document.getElementById('b5b').onclick=()=>{sl.value=Math.round(angOf(wF));draw();};draw();})();
const nz=w=>{const n=Math.hypot(...w);return [w[0]/n,w[1]/n];};
const fly=accOn(nz(dm),L.Xte,L.yte),robo=accOn(nz(wF),L.Xte,L.yte);
LAB.battle('arena1',{fly,robo,flyMood:fly>robo+0.03?'happy':(robo>fly+0.03?'sad':'think'),roboMood:robo>fly+0.03?'happy':(fly>robo+0.03?'sad':'think')});
window.__P1={fly,robo,angF:angOf(wF),angD:angOf(dm)};
})();
