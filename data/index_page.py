# index_page.py — 목차 페이지
def build(g):
    spr,say,dialog,nav,scoreboard,cast_html,bigmap,head,footer=[g[k] for k in ['spr','say','dialog','nav','scoreboard','cast_html','bigmap','head','footer']]
    P=dict(slug='index',file='index.html',num='목차',title='거리로 가르는 분류 대회 — LDA·KNN·SVM·SVC·커널',
      desc='벡터와 행렬을 처음 배우는 분을 위한 분류 모델 해설 시리즈. 운동장 지도 위에서 초파리 팀과 주판봇 팀이 LDA, KNN, SVM·SVC, 커널로 겨룹니다.',og='assets/img/og_index.webp')
    h=head(P)+nav('index.html')
    h+='<figure class="cover"><img src="assets/img/cover_index.webp" alt="픽셀아트 운동장 가운데 심판석에 박사가 앉아 있고, 왼쪽에 초파리 팀(초파리·시아·하루·X1), 오른쪽에 주판봇 팀(주판봇·모아·X2·X3)이 서 있다. 두 팀 사이에 파랑 동그라미, 빨강 세모, 초록 별이 있다" width="2048" height="1152"></figure>'
    h+=f'''<header class="hero" id="top"><div class="wrap"><div class="kicker">연구실 해설 시리즈 · 목차</div><h1>거리로 가르는 분류 대회</h1>
<p class="sub">전학생이 오면 어느 동아리일까? 운동장 지도 위에서 네 가지 방법(LDA · KNN · SVM·SVC · 커널)으로 겨룹니다. 모든 방법에 공통으로 흐르는 생각은 하나, <b>가까우면 같은 편</b>이에요.</p>
{scoreboard(0)}<div style="margin-top:24px">{dialog([('doc','smile','어서 와요. 저는 이번 대회의 심판이에요. 판정 기준은 하나, <b>처음 보는 학생을 얼마나 맞혔나</b>입니다.'),('fly','point','초파리 팀은 단순한 방법부터 의심하며 간다.'),('robo','firm','주판봇 팀은 정교한 방법으로 간다.'),('haru','smile','저는 초파리 팀이지만, 수식이 나올 때마다 대신 물어보는 역할도 해요.')])}</div></div></header>'''
    h+='''<section class="sec" id="plain"><div class="wrap stack"><h2>처음 오신 분께 — 이 시리즈를 3줄로</h2>
<div class="three"><div><b>무엇을</b>학생 한 명을 숫자 카드(벡터)로 적고, 거리·평균·복도·닮음 점수로 "어느 편인지" 맞히는 네 가지 방법을 배웁니다.</div><div><b>왜 중요한가</b>분류는 AI가 가장 많이 하는 일입니다. 스팸 거르기, 질병 진단, 불량품 찾기가 모두 "어느 편인가" 문제예요.</div><div><b>실제로는</b>이 네 방법은 지금도 데이터가 작거나 설명이 필요한 곳에서 먼저 시도하는 기본 도구입니다.</div></div>
<p class="note">행렬·벡터를 처음 배우는 분을 기준으로 썼어요. 중학교 수학(좌표평면, 피타고라스 정리, 평균, 일차함수, 이차함수)만으로 따라올 수 있게 했고, 그 밖의 식은 "더 알고 싶은 분" 상자에 접어 두었습니다.</p></div></section>'''
    h+=f'<section class="sec" id="cast"><div class="wrap stack"><h2>두 팀과 심판</h2>{cast_html()}</div></section>'
    h+='''<section class="sec" id="rule"><div class="wrap stack"><h2>대회 규칙</h2><ol style="display:flex;flex-direction:column;gap:10px;margin:0;padding-left:22px">
<li>파트마다 라운드가 하나씩, 모두 4라운드입니다.</li><li>두 팀은 같은 <b>훈련 학생</b>으로 방법을 정하고, <b>처음 보는 학생(시험 데이터)</b>을 맞힌 비율로 겨룹니다.</li>
<li>차이가 3%p 이하면 무승부예요. 점수는 페이지가 직접 계산하고, 결과는 심판이 "결과 열기"를 눌러야 보입니다. 열기 전에 먼저 맞혀 보세요.</li>
<li>데이터는 이 시리즈를 위해 만든 교육용 예시입니다. 실제 학교나 학생과 관계없어요.</li></ol></div></section>'''
    h+=f'''<section class="sec" id="map"><div class="wrap stack"><h2>큰 그림 — 네 파트, 열일곱 챕터</h2>{bigmap('')}
<div class="map" style="grid-template-columns:1fr"><a href="practice/index.html"><div class="n">마지막 장</div><div class="t">실전 연습장</div><div class="d">깃발 본부 · 동아리 배정 사무실 · 복도 공사 현장 · 무대 조명실에서 직접 손잡이를 돌려 보는 시뮬레이터</div></a></div>
<div class="tbl"><table><tr><th>파트</th><th>무엇까지의 거리로 가르나</th><th>새로 나오는 수학</th><th>앞 파트의 한계 → 이 파트의 이유</th></tr>
<tr><td>1 깃발 찾기 (LDA)</td><td>동아리 평균(깃발)</td><td>벡터, 거리, 평균, 내적</td><td>— (출발점)</td></tr>
<tr><td>2 이웃 투표 (KNN)</td><td>가장 가까운 k명</td><td>최빈값, 단위 맞추기</td><td>평균 하나로는 무리 모양을 못 읽는다</td></tr>
<tr><td>3 넓은 복도 (SVM·SVC)</td><td>경계선(복도 폭)</td><td>일차부등식, 화살표 길이</td><td>KNN은 전원을 기억하고 매번 다 잰다</td></tr>
<tr><td>4 무대 들어올리기 (커널)</td><td>서포트 벡터와의 닮음</td><td>이차함수, 지수함수(맛보기)</td><td>복도는 곧은 줄뿐이다</td></tr></table></div></div></section>'''
    h+='''<section class="sec" id="how"><div class="wrap stack"><h2>읽는 법</h2><div class="three"><div><b>① 그림부터</b>챕터마다 실험 패널이 있어요. 점을 누르고 손잡이를 돌려 본 뒤 설명을 읽으면 훨씬 쉬워요.</div><div><b>② 하루의 질문 상자</b>수식이 나오면 하루가 대신 묻고, 기호 하나씩 읽는 법과 뜻을 붙였어요. 작은 숫자로 한 번 같이 계산합니다.</div><div><b>③ AI 판단 코너</b>주판봇이 가져온 "훈련 100%" 같은 결과를 그대로 믿어도 되는지 확인하는 연습이에요.</div></div>
<details open><summary>기호 사전 — 막히면 여기로 돌아오세요</summary><div class="tbl"><table><tr><th>기호</th><th>읽는 법</th><th>뜻</th><th>처음 나오는 곳</th></tr>
<tr><td><b>x</b> = (x₁, x₂)</td><td>벡터 엑스 / 엑스 원, 엑스 투</td><td>학생 카드(숫자 묶음) / 가로, 세로 숫자</td><td><a href="part1_lda.html#ch1">챕터 1</a></td></tr>
<tr><td>Σ</td><td>시그마</td><td>모두 더하기</td><td><a href="part1_lda.html#ch2">챕터 2</a></td></tr>
<tr><td>√</td><td>루트</td><td>제곱하기 전 값으로 되돌리기</td><td><a href="part1_lda.html#ch2">챕터 2</a></td></tr>
<tr><td><b>μ</b>ₖ</td><td>뮤 케이</td><td>k번 동아리의 평균 자리(깃발)</td><td><a href="part1_lda.html#ch3">챕터 3</a></td></tr>
<tr><td><b>w</b>ᵀ<b>x</b>, <b>w</b>·<b>x</b></td><td>더블유 전치 엑스 / 내적</td><td>자리끼리 곱해서 더하기(가중 점수)</td><td><a href="part1_lda.html#ch4">챕터 4</a></td></tr>
<tr><td>J</td><td>제이</td><td>떨어짐 ÷ 퍼짐</td><td><a href="part1_lda.html#ch5">챕터 5</a></td></tr>
<tr><td>ŷ, k</td><td>와이 햇, 케이</td><td>모델이 낸 답, 물어볼 이웃 수</td><td><a href="part2_knn.html#ch6">챕터 6</a></td></tr>
<tr><td>b</td><td>비</td><td>줄을 앞뒤로 옮기는 숫자(편향)</td><td><a href="part3_svm.html#ch9">챕터 9</a></td></tr>
<tr><td>‖<b>w</b>‖</td><td>노름</td><td>화살표의 길이</td><td><a href="part3_svm.html#ch10">챕터 10</a></td></tr>
<tr><td>ξ, C</td><td>크사이, 씨</td><td>벽을 넘은 만큼의 벌점, 벌점의 무게</td><td><a href="part3_svm.html#ch12">챕터 12</a></td></tr>
<tr><td>φ, K, γ</td><td>파이, 케이, 감마</td><td>한 차원 올리는 규칙, 닮음 점수, 모닥불 폭</td><td><a href="part4_kernel.html#ch15">챕터 15</a>·<a href="part4_kernel.html#ch16">16</a></td></tr>
<tr><td>α</td><td>알파</td><td>서포트 벡터 모닥불의 세기</td><td><a href="part4_kernel.html#ch17">챕터 17</a></td></tr></table></div></details>
<details><summary>참고한 자료</summary><ul><li>MLTut, 「Distance &amp; Kernel Methods」 인포그래픽</li><li>eeanimation, 「Linear Discriminant Analysis」 Part 1~4 인포그래픽</li><li>Fisher (1936), Cover &amp; Hart (1967), Boser·Guyon·Vapnik (1992), Cortes &amp; Vapnik (1995), Platt (1998), James 외 (2013) — 각 파트 꾸러미에 서지가 있어요.</li></ul></details></div></section>'''
    P['nextprev']='<div class="nextprev"><span></span><a href="part1_lda.html">→ 파트 1 깃발 찾기 (LDA)부터 시작</a></div>'
    h+=footer(P)+'</body></html>'
    open('index.html','w').write(h)
    print('index.html')
