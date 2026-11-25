/* engine.js — 그래프·퀴즈·대회·지식 색인 공용 동작. 외부 라이브러리 없음 */
(function(G){
const NS='http://www.w3.org/2000/svg';
const COL={0:'#3d7bd9',1:'#e0533d'},SOFT={0:'rgba(61,123,217,0.13)',1:'rgba(224,83,61,0.13)'};
function el(t,a,p){const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e;}
const f1=v=>(Math.round(v*10)/10).toLocaleString('ko-KR',{maximumFractionDigits:1});
const f2=v=>(Math.round(v*100)/100).toLocaleString('ko-KR',{maximumFractionDigits:2});
const pct=v=>(Math.round(v*1000)/10).toFixed(1)+'%';
/* 좌표평면 */
function Plot(host,o){o=Object.assign({xr:[0,6],yr:[0,6],W:360,H:360,xlab:'가로 위치 x₁',ylab:'세로 위치 x₂',ticks:1},o||{});
  const L=40,R=12,T=12,B=38,W=o.W,H=o.H;host.innerHTML='';
  const svg=el('svg',{viewBox:`0 0 ${W} ${H}`,role:'img','aria-label':o.aria||'좌표평면 그래프'},host);
  const sx=x=>L+(x-o.xr[0])/(o.xr[1]-o.xr[0])*(W-L-R), sy=y=>H-B-(y-o.yr[0])/(o.yr[1]-o.yr[0])*(H-T-B);
  const ix=px=>o.xr[0]+(px-L)/(W-L-R)*(o.xr[1]-o.xr[0]), iy=py=>o.yr[0]+(H-B-py)/(H-T-B)*(o.yr[1]-o.yr[0]);
  const cid='c'+Math.random().toString(36).slice(2,8);const defs=el('defs',{},svg);const cp=el('clipPath',{id:cid},defs);el('rect',{x:L,y:T,width:W-L-R,height:H-T-B},cp);
  const layers={};['bg','grid','region','under','main','over','top'].forEach(n=>layers[n]=el('g',(n==='region'||n==='under')?{'clip-path':`url(#${cid})`}:{},svg));
  el('rect',{x:L,y:T,width:W-L-R,height:H-T-B,fill:'#fff',stroke:'#d9d6e3'},layers.bg);
  const st=o.ticks;for(let v=Math.ceil(o.xr[0]/st)*st;v<=o.xr[1]+1e-9;v+=st){el('line',{x1:sx(v),x2:sx(v),y1:T,y2:H-B,stroke:'#f0eef5'},layers.grid);const t=el('text',{x:sx(v),y:H-B+15,'text-anchor':'middle','font-size':11,fill:'#77748a'},layers.grid);t.textContent=+v.toFixed(2);}
  const sty=o.yticks||st;for(let v=Math.ceil(o.yr[0]/sty)*sty;v<=o.yr[1]+1e-9;v+=sty){el('line',{y1:sy(v),y2:sy(v),x1:L,x2:W-R,stroke:'#f0eef5'},layers.grid);const t=el('text',{x:L-6,y:sy(v)+4,'text-anchor':'end','font-size':11,fill:'#77748a'},layers.grid);t.textContent=+v.toFixed(2);}
  const xl=el('text',{x:(L+W-R)/2,y:H-4,'text-anchor':'middle','font-size':12,fill:'#4a475a','font-weight':600},layers.grid);xl.textContent=o.xlab;
  const yl=el('text',{x:12,y:(T+H-B)/2,'text-anchor':'middle','font-size':12,fill:'#4a475a','font-weight':600,transform:`rotate(-90 12 ${(T+H-B)/2})`},layers.grid);yl.textContent=o.ylab;
  const P={svg,sx,sy,ix,iy,L,R,T,B,W,H,o,layers,
    clear(n){layers[n].innerHTML='';},
    add(n,t,a){return el(t,a,layers[n]);},
    line(n,x1,y1,x2,y2,a){return el('line',Object.assign({x1:sx(x1),y1:sy(y1),x2:sx(x2),y2:sy(y2),stroke:'#333','stroke-width':2},a||{}),layers[n]);},
    text(n,x,y,s,a){const t=el('text',Object.assign({x:sx(x),y:sy(y),'font-size':12,fill:'#333'},a||{}),layers[n]);t.textContent=s;return t;},
    dot(n,x,y,c,a){a=a||{};const r=a.r||5.5,X=sx(x),Y=sy(y);let e;
      if(c===1){e=el('path',{d:`M${X},${Y-r-1}L${X+r+1},${Y+r}L${X-r-1},${Y+r}Z`,fill:a.fill||COL[1],stroke:a.stroke||'#fff','stroke-width':1.3},layers[n]);}
      else if(c==='star'){const pts=[];for(let i=0;i<10;i++){const rr=i%2?r*0.9:r*2.1,an=-Math.PI/2+i*Math.PI/5;pts.push((X+rr*Math.cos(an)).toFixed(1)+','+(Y+rr*Math.sin(an)).toFixed(1));}e=el('polygon',{points:pts.join(' '),fill:a.fill||'#22a45d',stroke:'#fff','stroke-width':1.5},layers[n]);}
      else {e=el('circle',{cx:X,cy:Y,r,fill:a.fill||COL[0],stroke:a.stroke||'#fff','stroke-width':1.3},layers[n]);}
      if(a.ring)el('circle',{cx:X,cy:Y,r:r+5,fill:'none',stroke:a.ring,'stroke-width':2},layers[n]);
      return e;},
    points(n,X,y,a){X.forEach((p,i)=>P.dot(n,p[0],p[1],y[i],typeof a==='function'?a(i):a));},
    /* fn(x,y) → 0/1 을 연한 색으로 칠함 */
    region(fn,res){P.clear('region');res=res||36;const dx=(o.xr[1]-o.xr[0])/res,dy=(o.yr[1]-o.yr[0])/res;
      for(let i=0;i<res;i++)for(let j=0;j<res;j++){const x=o.xr[0]+(i+.5)*dx,y=o.yr[0]+(j+.5)*dy,c=fn(x,y);
        el('rect',{x:sx(x-dx/2),y:sy(y+dy/2),width:sx(x+dx/2)-sx(x-dx/2)+.6,height:sy(y-dy/2)-sy(y+dy/2)+.6,fill:SOFT[c]},layers.region);}},
    /* a·x+b=0 직선을 화면 안에서 그림 */
    lineEq(n,w1,w2,b,a){const pts=[];const [x0,x1]=o.xr,[y0,y1]=o.yr;
      if(Math.abs(w2)>1e-9){[x0,x1].forEach(x=>{const y=-(w1*x+b)/w2;if(y>=y0-1e-9&&y<=y1+1e-9)pts.push([x,y]);});}
      if(Math.abs(w1)>1e-9){[y0,y1].forEach(y=>{const x=-(w2*y+b)/w1;if(x>=x0-1e-9&&x<=x1+1e-9)pts.push([x,y]);});}
      if(pts.length<2)return null;pts.sort((p,q)=>p[0]-q[0]||p[1]-q[1]);const A=pts[0],Bp=pts[pts.length-1];
      return P.line(n,A[0],A[1],Bp[0],Bp[1],a);},
    arrow(n,x1,y1,x2,y2,c,a){c=c||'#7b4fd6';const X1=sx(x1),Y1=sy(y1),X2=sx(x2),Y2=sy(y2),an=Math.atan2(Y2-Y1,X2-X1),h=9;
      const g=el('g',{},layers[n]);el('line',Object.assign({x1:X1,y1:Y1,x2:X2-Math.cos(an)*h*.6,y2:Y2-Math.sin(an)*h*.6,stroke:c,'stroke-width':2.5},a||{}),g);
      el('path',{d:`M${X2},${Y2}L${X2-h*Math.cos(an-0.45)},${Y2-h*Math.sin(an-0.45)}L${X2-h*Math.cos(an+0.45)},${Y2-h*Math.sin(an+0.45)}Z`,fill:c},g);return g;},
    flag(n,x,y,c){const X=sx(x),Y=sy(y),g=el('g',{},layers[n]);el('line',{x1:X,y1:Y,x2:X,y2:Y-26,stroke:'#3a3a48','stroke-width':2.5},g);
      el('path',{d:`M${X},${Y-26}L${X+16},${Y-21}L${X},${Y-15}Z`,fill:c,stroke:'#1f1a2e','stroke-width':1},g);el('circle',{cx:X,cy:Y,r:3,fill:'#1f1a2e'},g);return g;},
    pos(ev){const r=svg.getBoundingClientRect();const px=(ev.clientX-r.left)/r.width*W,py=(ev.clientY-r.top)/r.height*H;
      return [Math.max(o.xr[0],Math.min(o.xr[1],ix(px))),Math.max(o.yr[0],Math.min(o.yr[1],iy(py)))];},
    onClick(cb,opt){opt=opt||{};svg.style.cursor='crosshair';svg.addEventListener('pointerdown',e=>{if(e.target.dataset.drag)return;cb(...P.pos(e));});
      if(opt.pick){let k=-1;P.kbd('방향키로 학생을 차례로 고르고 Enter나 Space로 누르세요',(dx,dy,act)=>{const pts=opt.pick();if(!pts.length)return;
        if(act){if(k>=0)cb(pts[k][0],pts[k][1]);return;}k=((k<0?0:k+(dx+dy>0?1:-1))+pts.length)%pts.length;
        P.clear('top');P.add('top','circle',{cx:sx(pts[k][0]),cy:sy(pts[k][1]),r:12,fill:'none',stroke:'#7b4fd6','stroke-width':3,'stroke-dasharray':'4 3'});
        P.say('고른 학생 ('+pts[k].map(v=>+v.toFixed(2)).join(', ')+')');});}
      else P.kbd('방향키로 별을 옮겨요 (Shift를 누르면 크게)',(dx,dy,act,big)=>{if(act)return;const c=opt.at?opt.at():[(o.xr[0]+o.xr[1])/2,(o.yr[0]+o.yr[1])/2];
        const stx=(o.xr[1]-o.xr[0])/60*(big?5:1),sty=(o.yr[1]-o.yr[0])/60*(big?5:1);const x=Math.max(o.xr[0],Math.min(o.xr[1],c[0]+dx*stx)),y=Math.max(o.yr[0],Math.min(o.yr[1],c[1]+dy*sty));
        cb(x,y);P.say('위치 ('+(+x.toFixed(1))+', '+(+y.toFixed(1))+')');});},
    /* 키보드 조작: 그림에 초점을 주고 방향키·Enter·Space를 받는다 */
    kbd(help,fn){svg.setAttribute('tabindex','0');svg.setAttribute('aria-label',(o.aria||'그래프')+'. '+help);
      if(!P._live){P._live=document.createElement('p');P._live.className='note kbdhint';P._live.setAttribute('aria-live','polite');P._live.textContent='⌨️ '+help;host.appendChild(P._live);}
      svg.addEventListener('keydown',e=>{const m={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[e.key];
        if(m){e.preventDefault();fn(m[0],m[1],false,e.shiftKey);}else if(e.key==='Enter'||e.key===' '){e.preventDefault();fn(0,0,true,false);}});},
    say(t){if(P._live)P._live.textContent='⌨️ '+t;},
    /* 끌기: getPts() 반환 배열 중 가까운 점을 잡아 움직임 */
    drag(getPts,cb){let k=-1,kk=0;svg.style.cursor='grab';
      const name=i=>String.fromCharCode(65+i);
      P.kbd('방향키로 점을 옮기고, Enter나 Space로 옮길 점을 바꿔요 (Shift를 누르면 크게)',(dx,dy,act,big)=>{const pts=getPts();if(act){kk=(kk+1)%pts.length;P.say('지금 옮기는 점: '+name(kk));return;}
        const p=pts[kk],stx=(o.xr[1]-o.xr[0])/50*(big?5:1),sty=(o.yr[1]-o.yr[0])/50*(big?5:1);
        cb(kk,Math.max(o.xr[0],Math.min(o.xr[1],p[0]+dx*stx)),Math.max(o.yr[0],Math.min(o.yr[1],p[1]+dy*sty)));P.say('점 '+name(kk)+' ('+getPts()[kk].map(v=>+v.toFixed(1)).join(', ')+')');});
      svg.addEventListener('pointerdown',e=>{const [x,y]=P.pos(e);let best=1e9;getPts().forEach((p,i)=>{const d=Math.hypot(sx(p[0])-sx(x),sy(p[1])-sy(y));if(d<best){best=d;k=i;}});
        if(best>40)k=-1;if(k>=0){svg.setPointerCapture(e.pointerId);cb(k,x,y);}});
      svg.addEventListener('pointermove',e=>{if(k>=0){const [x,y]=P.pos(e);cb(k,x,y);}});
      svg.addEventListener('pointerup',()=>k=-1);svg.addEventListener('pointercancel',()=>k=-1);}
  };return P;}
/* 수직선(그림자 줄): rows=[{vals,cls}], marks=[{v,label,color}] */
function Strip(host,o){o=Object.assign({W:360,H:110,lab:'그림자 위치(점수) z'},o);host.innerHTML='';
  const L=14,R=14,W=o.W,H=o.H,svg=el('svg',{viewBox:`0 0 ${W} ${H}`,role:'img','aria-label':o.lab},host);
  const S={svg,draw(rows,marks,xr){svg.innerHTML='';const lo=xr[0],hi=xr[1],sx=v=>L+(v-lo)/(hi-lo)*(W-L-R);
    el('line',{x1:L,x2:W-R,y1:H-30,y2:H-30,stroke:'#9a97aa','stroke-width':1.5},svg);
    const step=Math.pow(10,Math.floor(Math.log10((hi-lo)/4)));const tk=(hi-lo)/step>8?step*2:step;
    for(let v=Math.ceil(lo/tk)*tk;v<=hi+1e-9;v+=tk){el('line',{x1:sx(v),x2:sx(v),y1:H-33,y2:H-27,stroke:'#9a97aa'},svg);const t=el('text',{x:sx(v),y:H-14,'text-anchor':'middle','font-size':10,fill:'#77748a'},svg);t.textContent=+v.toFixed(2);}
    const tl=el('text',{x:W/2,y:H-1,'text-anchor':'middle','font-size':11,fill:'#4a475a'},svg);tl.textContent=o.lab;
    rows.forEach((r,k)=>{const y0=H-42-k*24;r.vals.forEach(v=>{if(r.cls===1){const X=sx(v);el('path',{d:`M${X},${y0-5}L${X+5},${y0+4}L${X-5},${y0+4}Z`,fill:COL[1],'fill-opacity':.7},svg);}else if(r.cls==='star'){el('circle',{cx:sx(v),cy:y0,r:6,fill:'#22a45d',stroke:'#fff'},svg);}else el('circle',{cx:sx(v),cy:y0,r:4.2,fill:COL[0],'fill-opacity':.7},svg);});});
    (marks||[]).forEach(m=>{el('line',{x1:sx(m.v),x2:sx(m.v),y1:6,y2:H-30,stroke:m.color||'#7b4fd6','stroke-width':2,'stroke-dasharray':m.dash||''},svg);if(m.label){const t=el('text',{x:sx(m.v)+3,y:14,'font-size':10.5,fill:m.color||'#7b4fd6','font-weight':700},svg);t.textContent=m.label;}});}};
  return S;}
/* 퀴즈: <div class=quiz data-ans="1"> 의 버튼들 */
function quiz(root){(root||document).querySelectorAll('.quiz').forEach(q=>{const ans=+q.dataset.ans,fb=q.querySelector('.fb');
  q.querySelectorAll('.opts button').forEach((b,i)=>b.addEventListener('click',()=>{q.querySelectorAll('.opts button').forEach(x=>x.classList.remove('right','wrong'));
    b.classList.add(i===ans?'right':'wrong');fb.innerHTML=(i===ans?'<b class="good">맞아요.</b> ':'<b class="badc">다시 한번 볼까요?</b> ')+(i===ans?q.dataset.ok:q.dataset.no);}));});}
/* 쪽지시험: .exam 안의 퀴즈를 처음 고른 답으로 채점 */
function exam(){document.querySelectorAll('.exam').forEach(ex=>{const qs=[...ex.querySelectorAll('.quiz')],first={},out=ex.querySelector('.exam-score');
  qs.forEach((q,i)=>q.querySelectorAll('.opts button').forEach((b,j)=>b.addEventListener('click',()=>{if(i in first)return;first[i]=(j===+q.dataset.ans);
    const n=Object.keys(first).length,ok=Object.values(first).filter(Boolean).length;
    if(n<qs.length){out.innerHTML=`푼 문항 ${n} / ${qs.length} · 맞힌 문항 ${ok}`;return;}
    const miss=qs.filter((_,k)=>!first[k]).map(x=>x.dataset.ref).filter((v,k,a)=>v&&a.indexOf(v)===k);
    out.innerHTML=`<b>맞힌 문항 ${ok} / ${qs.length}</b> (처음 고른 답 기준) — `+(ok>=4?'좋아요! 다음 파트로 가도 됩니다.':'괜찮아요. 아래 챕터를 한 번 더 보고 오면 충분해요.')+(miss.length?'<br>다시 볼 곳: '+miss.map(r=>`<a href="${r}">${ex.querySelector(`[data-ref="${r}"]`).dataset.refname}</a>`).join(' · '):'');})));});}
/* 대회: 결과 열기 버튼 → 점수·표정·판정 보이기 */
function battle(id,res){const s=document.getElementById(id);if(!s)return;const btn=s.querySelector('.open');
  btn.addEventListener('click',()=>{s.querySelector('.sc-fly').textContent=pct(res.fly);s.querySelector('.sc-robo').textContent=pct(res.robo);
    s.querySelector('.lead-fly').dataset.spr='fly:'+res.flyMood;s.querySelector('.lead-robo').dataset.spr='robo:'+res.roboMood;s.querySelector('.lead-doc').dataset.spr='doc:'+(res.docMood||'point');
    SPR.paint(s);s.querySelectorAll('.after').forEach(x=>x.classList.remove('hidden'));btn.disabled=true;btn.textContent='결과를 열었습니다';});}
/* 지식 색인·꾸러미 */
const TYPE={Concept:'개념',Method:'방법·모델',Limitation:'한계',Term:'용어',Claim:'사실 문장',Work:'참고 자료',Analogy:'비유',Simulation:'실험',QuizItem:'퀴즈',Metric:'지표',Dataset:'데이터',Question:'열린 질문'};
function kg(){const raw=document.getElementById('kg-raw');if(!raw)return;const d=JSON.parse(raw.textContent),host=document.getElementById('kg-list');
  const by={};d.nodes.forEach(n=>(by[n.type]=by[n.type]||[]).push(n));let h='';
  Object.keys(by).forEach(t=>{h+=`<div class="grp"><h3>${TYPE[t]||t} <span class="tag">${by[t].length}</span></h3><ul>`+by[t].map(n=>`<li><a href="${n.anchor}">${n.label.ko}</a>${n.definition?' — '+n.definition.ko:''}</li>`).join('')+'</ul></div>';});
  host.innerHTML=h;const lab={};d.nodes.forEach(n=>lab[n.id]=n.label.ko);
  const P={'lab:prerequisiteOf':'먼저 알아야 함 →','lab:hasLimitation':'의 한계 →','lab:addressedBy':'을(를) 푸는 것 →','lab:contrastsWith':'과(와) 대비 ↔','lab:analogyOf':'비유 →','lab:demonstratedBy':'실험 →','lab:assesses':'확인 →','lab:broader':'상위 주제 →','lab:partOf':'부분 →','lab:supports':'뒷받침 →','lab:assertedIn':'출처 →','lab:relatedTo':'관련 ↔'};
  document.getElementById('kg-edges').innerHTML='<summary>관계 '+d.edges.length+'개 보기</summary><ul>'+d.edges.map(e=>`<li>${lab[e.s]||e.s} <b>${P[e.p]||e.p}</b> ${lab[e.o]||e.o.replace('lab:topic/','주제: ')}</li>`).join('')+'</ul>';
  document.querySelectorAll('[data-dl]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.dl,txt=document.getElementById(id).textContent;
    const blob=new Blob([JSON.stringify(JSON.parse(txt),null,1)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=b.dataset.name;a.click();}));}
document.addEventListener('DOMContentLoaded',()=>{if(G.SPR)SPR.paint();quiz();exam();kg();});
G.LAB={Plot,Strip,el,f1,f2,pct,quiz,battle,COL,SOFT};
})(window);
