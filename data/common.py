# common.py — 시리즈 공통 문구 (사람이 고치는 곳)
SERIES='거리로 가르는 분류 대회'
AUTHOR='안상선'
AUTHOR_URL='https://adminmrobo.github.io/who_am_i/who_am_i.html'
AFFIL='(주)M-Robo 대표'
SITE='https://adminmrobo.github.io/knn_svc_svm_lab/'
CAST={
 'doc':{'label':'박사','team':'ref','mood':'smile','role':'심판이자 선생님. 판정은 숫자로만 한다'},
 'fly':{'label':'초파리','team':'fly','mood':'point','role':'초파리 팀 조장. 일단 의심하고 확인부터'},
 'sia':{'label':'인턴1 시아','team':'robo','mood':'smile','role':'꼼꼼한 기록, 그림으로 먼저 이해하는 편'},
 'haru':{'label':'조수 하루','team':'robo','mood':'smile','role':'수식이 나오면 대신 물어보는 조수'},
 'x1':{'label':'X1','team':'fly','mood':'smile','role':'특징(feature) x₁ 담당. 반례 찾기'},
 'robo':{'label':'주판봇','team':'robo','mood':'firm','role':'주판봇 팀 조장. 크고 정교한 방법에 건다'},
 'moa':{'label':'인턴2 모아','team':'robo','mood':'smile','role':'계산이 빠르고 자신만만, 현장 사례 담당'},
 'x2':{'label':'X2','team':'fly','mood':'smile','role':'특징(feature) x₂ 담당. 숫자 확인'},
 'x3':{'label':'X3','team':'fly','mood':'smile','role':'특징(feature) 높이 담당(파트 4). 조건 바꿔 보기'},
}
TEAMS={'fly':{'name':'초파리 팀','members':['x1','x2','x3']},'robo':{'name':'주판봇 팀','members':['haru','sia','moa']}}
PARTS=[
 {'slug':'part1_lda','file':'part1_lda.html','navname':'1 깃발 찾기 (LDA)','chs':'챕터 1~5','oneline':'두 동아리의 평균 자리(깃발) 중 더 가까운 쪽으로'},
 {'slug':'part2_knn','file':'part2_knn.html','navname':'2 이웃 투표 (KNN)','chs':'챕터 6~8','oneline':'옆에 선 친구 k명에게 물어서 다수결'},
 {'slug':'part3_svm','file':'part3_svm.html','navname':'3 넓은 복도 (SVM·SVC)','chs':'챕터 9~13','oneline':'두 동아리 사이에 가장 넓은 복도 내기'},
 {'slug':'part4_kernel','file':'part4_kernel.html','navname':'4 무대 들어올리기 (커널)','chs':'챕터 14~17','oneline':'선으로 안 갈리면 한 차원 올려서 가르기'},
]
ROUNDS=[{'win':'robo'},{'win':'fly'},{'win':'robo'},{'win':'draw'}]
ABBR={
 'LDA':('선형 판별 분석','Linear Discriminant Analysis. 두 무리를 가장 잘 가르는 방향을 찾아 직선으로 가른다'),
 'QDA':('이차 판별 분석','Quadratic Discriminant Analysis. 무리마다 퍼진 모양이 다를 때 휘어진 경계를 쓴다'),
 'PCA':('주성분 분석','Principal Component Analysis. 정답 없이 데이터가 가장 넓게 퍼진 방향을 찾는다'),
 'KNN':('k-최근접 이웃','k-Nearest Neighbors. 가장 가까운 k명의 정답으로 투표한다'),
 'SVM':('서포트 벡터 머신','Support Vector Machine. 가장 넓은 복도(여유 폭)로 가르고, 커널로 휘게도 한다'),
 'SVC':('서포트 벡터 분류기','Support Vector Classifier. 조금 봐주는 복도(소프트 마진). 파이썬 도구에서는 SVM 분류기의 이름이기도 하다'),
 'SVR':('서포트 벡터 회귀','Support Vector Regression. 복도 생각을 숫자 예측에 쓴다'),
 'RBF':('방사 기저 함수','Radial Basis Function. 거리가 가까울수록 1, 멀수록 0에 가까운 닮음 점수'),
}
REFS={
 'mltut':{'id':'mltut2026distance','short':'MLTut 인포그래픽 「Distance & Kernel Methods」','role':'primary',
   'cite':'MLTut, 「Distance & Kernel Methods」 인포그래픽 (KNN·SVM·커널 요약)','use':'파트 2~4의 뼈대',
   'csl':{'type':'webpage','title':'Distance & Kernel Methods','author':[{'literal':'MLTut'}]},
   'verified':{'title':True,'author':True,'year':False,'container':False,'pages':False,'doi':False},'checked':'저자가 준 인포그래픽 그림에서 옮김'},
 'eea':{'id':'eeanimation2026lda','short':'eeanimation 인포그래픽 「Linear Discriminant Analysis」 1~4부','role':'primary',
   'cite':'eeanimation, 「Linear Discriminant Analysis」 Part 1~4 인포그래픽','use':'파트 1의 뼈대(그림자, Fisher 기준, 예제 2x₁+x₂=5.5)',
   'csl':{'type':'webpage','title':'Linear Discriminant Analysis (Part 1-4)','author':[{'literal':'eeanimation'}]},
   'verified':{'title':True,'author':True,'year':False,'container':False,'pages':False,'doi':False},'checked':'저자가 준 인포그래픽 그림에서 옮김'},
 'fisher':{'id':'fisher1936use','short':'Fisher (1936)','role':'background','cite':'Fisher, R. A. (1936). The use of multiple measurements in taxonomic problems. <i>Annals of Eugenics</i>, 7(2), 179–188.','use':'LDA를 처음 제안한 논문',
   'csl':{'type':'article-journal','title':'The use of multiple measurements in taxonomic problems','author':[{'family':'Fisher','given':'R. A.'}],'issued':{'date-parts':[[1936]]},'container-title':'Annals of Eugenics'},
   'verified':{'title':True,'author':True,'year':True,'container':True,'pages':False,'doi':False},'checked':'작성자가 알고 있는 서지로 적음(외부 대조 안 함)'},
 'coverhart':{'id':'cover1967nearest','short':'Cover & Hart (1967)','role':'background','cite':'Cover, T., &amp; Hart, P. (1967). Nearest neighbor pattern classification. <i>IEEE Transactions on Information Theory</i>, 13(1), 21–27.','use':'최근접 이웃 분류의 고전 논문',
   'csl':{'type':'article-journal','title':'Nearest neighbor pattern classification','author':[{'family':'Cover','given':'T.'},{'family':'Hart','given':'P.'}],'issued':{'date-parts':[[1967]]},'container-title':'IEEE Transactions on Information Theory'},
   'verified':{'title':True,'author':True,'year':True,'container':True,'pages':False,'doi':False},'checked':'작성자가 알고 있는 서지로 적음(외부 대조 안 함)'},
 'cortes':{'id':'cortes1995support','short':'Cortes & Vapnik (1995)','role':'background','cite':'Cortes, C., &amp; Vapnik, V. (1995). Support-vector networks. <i>Machine Learning</i>, 20(3), 273–297.','use':'소프트 마진 SVM 논문',
   'csl':{'type':'article-journal','title':'Support-vector networks','author':[{'family':'Cortes','given':'Corinna'},{'family':'Vapnik','given':'Vladimir'}],'issued':{'date-parts':[[1995]]},'container-title':'Machine Learning'},
   'verified':{'title':True,'author':True,'year':True,'container':True,'pages':False,'doi':False},'checked':'작성자가 알고 있는 서지로 적음(외부 대조 안 함)'},
 'boser':{'id':'boser1992training','short':'Boser, Guyon & Vapnik (1992)','role':'background','cite':'Boser, B. E., Guyon, I. M., &amp; Vapnik, V. N. (1992). A training algorithm for optimal margin classifiers. <i>COLT ’92</i>.','use':'커널을 쓴 최대 여유 폭 분류기',
   'csl':{'type':'paper-conference','title':'A training algorithm for optimal margin classifiers','author':[{'family':'Boser','given':'B. E.'},{'family':'Guyon','given':'I. M.'},{'family':'Vapnik','given':'V. N.'}],'issued':{'date-parts':[[1992]]},'container-title':'Proceedings of the Fifth Annual Workshop on Computational Learning Theory'},
   'verified':{'title':True,'author':True,'year':True,'container':True,'pages':False,'doi':False},'checked':'작성자가 알고 있는 서지로 적음(외부 대조 안 함)'},
 'islr':{'id':'james2013introduction','short':'James 외 (2013) ISLR','role':'background','cite':'James, G., Witten, D., Hastie, T., &amp; Tibshirani, R. (2013). <i>An Introduction to Statistical Learning</i>. Springer.','use':'최대 여유 폭 분류기 → SVC → SVM 이름 순서',
   'csl':{'type':'book','title':'An Introduction to Statistical Learning','author':[{'family':'James','given':'Gareth'},{'family':'Witten','given':'Daniela'},{'family':'Hastie','given':'Trevor'},{'family':'Tibshirani','given':'Robert'}],'issued':{'date-parts':[[2013]]},'publisher':'Springer'},
   'verified':{'title':True,'author':True,'year':True,'container':True,'pages':False,'doi':False},'checked':'작성자가 알고 있는 서지로 적음(외부 대조 안 함)'},
 'platt':{'id':'platt1998sequential','short':'Platt (1998) SMO','role':'background','cite':'Platt, J. (1998). Sequential minimal optimization: A fast algorithm for training support vector machines. Microsoft Research Technical Report MSR-TR-98-14.','use':'이 페이지의 SVM 계산기가 쓰는 풀이법',
   'csl':{'type':'report','title':'Sequential minimal optimization: A fast algorithm for training support vector machines','author':[{'family':'Platt','given':'John'}],'issued':{'date-parts':[[1998]]},'publisher':'Microsoft Research'},
   'verified':{'title':True,'author':True,'year':True,'container':False,'pages':False,'doi':False},'checked':'작성자가 알고 있는 서지로 적음(외부 대조 안 함)'},
}
def refs(*keys): return [REFS[k] for k in keys]
def nextprev(prev,nxt):
    a=lambda x,arrow:f'<a href="{x[0]}">{arrow} {x[1]}</a>' if x else '<span></span>'
    return f'<div class="nextprev">{a(prev,"←")}{a(nxt,"→")}</div>'
