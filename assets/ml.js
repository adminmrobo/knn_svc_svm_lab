/* ml.js — 이 페이지의 계산기: 거리, KNN, SVM(SMO). 외부 라이브러리 없음 */
(function(G){
const ML={};
ML.dist=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
ML.dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
ML.minmax=X=>{const d=X[0].length,mn=[],mx=[];for(let j=0;j<d;j++){mn[j]=Math.min(...X.map(r=>r[j]));mx[j]=Math.max(...X.map(r=>r[j]));}
  return {mn,mx,f:r=>r.map((v,j)=>(v-mn[j])/(mx[j]-mn[j]))};};
/* KNN: 가까운 k명 투표. 반환 {label, nb:[{i,d}], votes} */
ML.knn=(X,y,q,k,reg)=>{const nb=X.map((p,i)=>({i,d:ML.dist(p,q)})).sort((a,b)=>a.d-b.d||a.i-b.i).slice(0,k);
  if(reg){return {label:nb.reduce((s,n)=>s+y[n.i],0)/k,nb};}
  const votes={};nb.forEach(n=>votes[y[n.i]]=(votes[y[n.i]]||0)+1);
  let best=null,bv=-1;Object.keys(votes).forEach(c=>{if(votes[c]>bv){bv=votes[c];best=+c;}});
  /* 동점이면 가장 가까운 이웃의 반을 따른다 */
  const tied=Object.keys(votes).filter(c=>votes[c]===bv);if(tied.length>1){best=y[nb.find(n=>tied.includes(String(y[n.i]))).i];}
  return {label:best,nb,votes};};
ML.acc=(pred,y)=>pred.filter((p,i)=>p===y[i]).length/y.length;
/* 커널 */
ML.kern=(type,g,deg)=>{
  if(type==='linear')return (a,b)=>ML.dot(a,b);
  if(type==='poly')return (a,b)=>Math.pow(g*ML.dot(a,b)+1,deg||2);
  if(type==='rbf')return (a,b)=>{let s=0;for(let i=0;i<a.length;i++){const t=a[i]-b[i];s+=t*t;}return Math.exp(-g*s);};
  if(type==='sigmoid')return (a,b)=>Math.tanh(g*ML.dot(a,b)-1);
};
/* SVM: SMO(Platt) — 라벨 0/1을 -1/+1로 바꿔 학습. 결정적(난수 없음). */
ML.svm=(X,y01,opt)=>{
  const C=opt.C, K=ML.kern(opt.kernel||'linear',opt.gamma||1,opt.degree), tol=1e-3, eps=1e-6, n=X.length;
  const y=y01.map(v=>v?1:-1), a=new Float64Array(n); let b=0;
  const Km=[];for(let i=0;i<n;i++){Km[i]=new Float64Array(n);for(let j=0;j<n;j++)Km[i][j]=K(X[i],X[j]);}
  const E=new Float64Array(n);for(let i=0;i<n;i++)E[i]=-y[i]; /* f(x)=0 처음 */
  const f=i=>{let s=-b;for(let j=0;j<n;j++)if(a[j]>0)s+=a[j]*y[j]*Km[i][j];return s;};
  function take(i1,i2){ if(i1===i2)return 0;
    const a1=a[i1],a2=a[i2],y1=y[i1],y2=y[i2],E1=E[i1],E2=E[i2],s=y1*y2;
    let L,H; if(y1!==y2){L=Math.max(0,a2-a1);H=Math.min(C,C+a2-a1);}else{L=Math.max(0,a2+a1-C);H=Math.min(C,a2+a1);}
    if(L>=H)return 0; const k11=Km[i1][i1],k12=Km[i1][i2],k22=Km[i2][i2],eta=k11+k22-2*k12; let A2;
    if(eta>0){A2=a2+y2*(E1-E2)/eta;if(A2<L)A2=L;else if(A2>H)A2=H;}
    else{ const f1=y1*(E1+b)-a1*k11-s*a2*k12,f2=y2*(E2+b)-s*a1*k12-a2*k22,L1=a1+s*(a2-L),H1=a1+s*(a2-H);
      const Lo=L1*f1+L*f2+.5*L1*L1*k11+.5*L*L*k22+s*L*L1*k12,Hi=H1*f1+H*f2+.5*H1*H1*k11+.5*H*H*k22+s*H*H1*k12;
      A2= Lo<Hi-eps?L:(Lo>Hi+eps?H:a2);}
    if(Math.abs(A2-a2)<eps*(A2+a2+eps))return 0;
    let A1=a1+s*(a2-A2); if(A1<0){A2+=s*A1;A1=0;}else if(A1>C){A2+=s*(A1-C);A1=C;}
    const b1=E1+y1*(A1-a1)*k11+y2*(A2-a2)*k12+b, b2=E2+y1*(A1-a1)*k12+y2*(A2-a2)*k22+b;
    const nb=(A1>0&&A1<C)?b1:((A2>0&&A2<C)?b2:(b1+b2)/2);
    const d1=y1*(A1-a1),d2=y2*(A2-a2);
    for(let i=0;i<n;i++)E[i]+=d1*Km[i1][i]+d2*Km[i2][i]+b-nb;
    b=nb;a[i1]=A1;a[i2]=A2;return 1;}
  function examine(i2){ const y2=y[i2],a2=a[i2],r2=E[i2]*y2;
    if((r2<-tol&&a2<C)||(r2>tol&&a2>0)){
      let i1=-1,mx=0;for(let i=0;i<n;i++)if(a[i]>0&&a[i]<C){const d=Math.abs(E[i]-E[i2]);if(d>mx){mx=d;i1=i;}}
      if(i1>=0&&take(i1,i2))return 1;
      for(let t=0;t<n;t++){const i=(i2+t)%n;if(a[i]>0&&a[i]<C&&take(i,i2))return 1;}
      for(let t=0;t<n;t++){const i=(i2+t)%n;if(take(i,i2))return 1;}}
    return 0;}
  let changed=0,all=1,it=0;
  while((changed>0||all)&&it<20000){changed=0;it++;
    if(all){for(let i=0;i<n;i++)changed+=examine(i);}else{for(let i=0;i<n;i++)if(a[i]>0&&a[i]<C)changed+=examine(i);}
    if(all)all=0;else if(changed===0)all=1;}
  const sv=[];for(let i=0;i<n;i++)if(a[i]>1e-7)sv.push(i);
  const model={a,b,y,X,K,sv,C,kernel:opt.kernel||'linear',
    score:q=>{let s=-b;for(const j of sv)s+=a[j]*y[j]*K(X[j],q);return s;},
    predict:q=>model.score(q)>=0?1:0};
  if(model.kernel==='linear'){const w=[0,0];for(const j of sv){w[0]+=a[j]*y[j]*X[j][0];w[1]+=a[j]*y[j]*X[j][1];}
    model.w=w;model.bias=-b;model.margin=2/Math.hypot(w[0],w[1]);}
  return model;};
G.ML=ML; if(typeof module!=='undefined')module.exports=ML;
})(typeof window!=='undefined'?window:globalThis);
