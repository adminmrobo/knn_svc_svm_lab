# practice_page.py — 마지막 장 실전 연습장 (문구)
from common import *
SCENES=[
 ('flag','flag','비스듬히 길쭉하게 선 두 동아리의 신입생 배정 기준(그림자 방향)을 정해야 해요. 새 학기에 올 학생 200명(검증 데이터)을 잘 맞히는 방향을 고르세요.',
   [('flag-s1','두 무리의 길쭉함 ρ',0,0.95,0.05,0.85,'')],[('flag-s2','그림자 방향',-90,90,1,0,'')],'',
   '<a href="../part1_lda.html#ch4">챕터 4 담장 그림자</a> · <a href="../part1_lda.html#ch5">챕터 5 Fisher의 기준</a>'),
 ('knn','knn','운동 시간(분)과 독서 시간(시간)이 적힌 신청서로 동아리를 배정해요. 몇 명의 선배 기록을 볼지(k), 단위를 맞출지 정하세요.',
   [('knn-s1','기록의 섞임 정도',0.6,1.6,0.1,1,'')],[('knn-s2','이웃 수 k',1,31,2,1,'')],'<button type="button" id="knn-b">단위 맞춤: 끔</button>',
   '<a href="../part2_knn.html#ch7">챕터 7 k 고르기</a> · <a href="../part2_knn.html#ch8">챕터 8 단위 맞추기</a>'),
 ('corridor','cor','두 동아리 사이에 복도를 내는 공사예요. 기록이 이상한 학생 한 명이 경계 근처에 있을 수 있어요. 깐깐함 C를 정하세요.',
   [('cor-s1','이상한 학생 위치(가로+세로 합)',4.6,6.4,0.2,5.4,'')],[('cor-s2','깐깐함 C (0.01~1000, 10단계)',0,9,1,9,'')],'',
   '<a href="../part3_svm.html#ch10">챕터 10 가장 넓은 복도</a> · <a href="../part3_svm.html#ch12">챕터 12 C와 SVC</a>'),
 ('stage','stg','가운데 무대의 합창부와 둘레 트랙의 육상부를 RBF 조명(커널 SVM)으로 가려요. 경계가 흐릴수록 어렵습니다. 모닥불 폭 γ와 깐깐함 C를 정하세요.',
   [('stg-s1','무대 경계의 흐림',0.6,2,0.2,1,'')],[('stg-s2','γ (0.03~30, 7단계)',0,6,1,3,''),('stg-s3','C (0.1~100, 4단계)',0,3,1,1,'')],'',
   '<a href="../part4_kernel.html#ch16">챕터 16 커널 = 닮음 점수</a> · <a href="../part4_kernel.html#ch17">챕터 17 C와 γ</a>'),
]
def rng(i,lab,mn,mx,st,val,unit):
    return f'<label>{lab} = <span id="{i.replace("-s","-v")}"></span>{unit}<input type="range" id="{i}" min="{mn}" max="{mx}" step="{st}" value="{val}"></label>'
def build(g):
    dialog,head,nav,footer=g['dialog'],g['head'],g['nav'],g['footer']
    sc=''
    for key,p,situ,env,dec,extra,links in SCENES:
        envh=(('<button type="button" id="cor-b" class="on">이상한 학생: 있음</button>') if key=='corridor' else '')+''.join(rng(*e) for e in env)
        dech=''.join(rng(*d) for d in dec)+extra
        sc+=f'''<section class="scene" id="sc-{key}"><div class="stack" style="gap:22px">
<div class="situ"><b>상황</b> — {situ}</div>
<div class="board"><div class="env"><div class="lbl">🟢 환경 조건 (바깥 사정)</div>{envh}</div><div class="dec"><div class="lbl">🔵 내 결정</div>{dech}</div></div>
<div class="stat four" id="{p}-score"></div>
<div class="row"><div class="plot" id="{p}-p"></div><div class="plot" id="{p}-c"></div></div>
<div class="dialog" id="{p}-talk"></div>
<div class="missions"><b>미션</b> <span class="note">(손잡이를 움직이면 판정을 시작해요)</span><ol id="{p}-ms"></ol></div>
<div class="review"><b>배운 곳 다시 보기</b> — {links}</div></div></section>'''
    P=dict(slug='practice',file='practice/index.html',num='마지막 장',title='실전 연습장 — 네 사업장에서 손잡이 돌려 보기',
      desc='LDA·KNN·선형 SVM·RBF 커널 SVM을 가상 사업장에서 직접 조작하는 시뮬레이터. 사업장마다 미션 3개, 자동 판정.',og='assets/img/og_practice.webp')
    h=head(P,'../').replace('href="../assets/engine.css">','href="../assets/engine.css"><link rel="stylesheet" href="practice.css">')+nav('practice')
    h+='<figure class="cover"><img src="../assets/img/cover_practice.webp" alt="운동장이 내다보이는 조종실. 벽의 화면 네 개에 깃발, 별과 동그라미, 노란 복도, 들린 무대가 보이고, 하루가 손잡이를 돌리며 박사·초파리·시아·모아·주판봇·X1~X3가 지켜본다" width="2048" height="1152"></figure>'
    h+=f'''<header class="hero"><div class="wrap"><div class="kicker">{SERIES} · 마지막 장</div><h1>실전 연습장</h1><p class="sub">네 파트에서 배운 손잡이를 가상 사업장에서 직접 돌려 봅니다. 숫자는 모두 교육용 예시이며, 실제 학교·학생과 관계없어요. 여기서 <b>검증 학생</b>은 손잡이를 고를 때 쓰는 "처음 보는 학생"이에요. 주소 끝에 #flag, #knn, #corridor, #stage를 붙이면 그 사업장이 바로 열려요.</p>
<div style="margin-top:18px">{dialog([('doc','smile','사업장마다 미션이 세 개예요. ① 가장 좋은 손잡이 찾기 ② 함정 직접 보기 ③ 조건을 바꿔도 결론이 유지되는지 확인. 판정은 검증 학생 점수로만 합니다.')])}</div></div></header>
<main class="wrap stack" style="padding-bottom:40px"><div class="tabs" role="tablist" aria-label="사업장 고르기"><button data-t="flag">① 깃발 본부 (LDA)</button><button data-t="knn">② 동아리 배정 사무실 (KNN)</button><button data-t="corridor">③ 복도 공사 현장 (SVM·SVC)</button><button data-t="stage">④ 무대 조명실 (커널)</button></div>
{sc}
<div class="limit"><b>마무리 질문</b> — 네 사업장 모두에서 "훈련 점수가 가장 높은 손잡이"와 "검증 점수가 가장 높은 손잡이"가 달랐나요? 데이터 모양(길쭉함, 섞임, 이상한 학생, 흐림)이 바뀌면 가장 좋은 방법과 손잡이도 바뀝니다. 그래서 실제 일에서는 늘 따로 떼어 둔 데이터로 확인해요.<br><span class="note">모형의 한계: 모든 데이터는 두 특징·두 동아리로 단순하게 만든 예시입니다. 숫자는 교육용 예시이며, 실제 업무·투자·진단 판단의 근거가 아닙니다.</span></div></main>'''
    P['nextprev']='<div class="nextprev"><a href="../part4_kernel.html">← 파트 4 무대 들어올리기</a><a href="../index.html">목차로 →</a></div>'
    h+=footer(P,'../')+'<script src="practice.js"></script></body></html>'
    open('practice/index.html','w').write(h);print('practice/index.html')
