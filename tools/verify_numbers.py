#!/usr/bin/env python3
"""페이지에 적은 숫자를 scikit-learn으로 다시 계산해 맞는지 확인한다.  python3 tools/verify_numbers.py"""
import json, numpy as np
from sklearn.neighbors import KNeighborsClassifier as KNN, NearestCentroid
from sklearn.svm import SVC
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis as LDA
s=open('assets/data.js').read(); D=json.loads(s[s.index('=')+1:-1])
A=lambda d,k:(np.array(d[k+'tr'] if k+'tr' in d else d['X'+k]),)
def get(n): d=D[n]; return [np.array(d[k]) for k in ['Xtr','ytr','Xte','yte']]
ok=lambda name,got,want,tol=0.0005: print(('OK  ' if abs(got-want)<=tol else 'FAIL'),name,round(got,4),'기대',want)
X,y,Xt,yt=get('lda'); ok('R1 초파리(깃발 방향)',NearestCentroid().fit(X,y).score(Xt,yt),0.86); ok('R1 주판봇(LDA)',LDA().fit(X,y).score(Xt,yt),0.995)
X,y,Xt,yt=get('noisy'); ok('ch7 k=1 시험',KNN(1).fit(X,y).score(Xt,yt),0.85); ok('ch7 k=5 시험',KNN(5).fit(X,y).score(Xt,yt),0.8833)
X,y,Xt,yt=get('fruit'); mn,mx=X.min(0),X.max(0); f=lambda Z:(Z-mn)/(mx-mn)
ok('R2 주판봇 k=1 원래 단위',KNN(1).fit(X,y).score(Xt,yt),0.6625); ok('R2 초파리 k=7 맞춤',KNN(7).fit(f(X),y).score(f(Xt),yt),0.875); ok('ch8 k=7 원래 단위',KNN(7).fit(X,y).score(Xt,yt),0.65)
X,y,Xt,yt=get('sep'); m=SVC(kernel='linear',C=1000).fit(X,y); ok('ch10 복도 폭',2/np.linalg.norm(m.coef_),0.865,0.001); ok('ch11 서포트 벡터 수',m.n_support_.sum(),3,0)
ok('R3 초파리 KNN k=3',KNN(3).fit(X,y).score(Xt,yt),0.835); ok('R3 주판봇 SVM C=10',SVC(kernel='linear',C=10).fit(X,y).score(Xt,yt),0.995)
Xo=np.vstack([X,D['outlier']]);yo=np.r_[y,1]
for C,mg,te in [(1000,0.05,0.89),(10,0.865,0.995),(0.1,3.36,0.95)]:
    m=SVC(kernel='linear',C=C).fit(Xo,yo); ok(f'ch12 C={C} 폭',2/np.linalg.norm(m.coef_),mg,0.01); ok(f'ch12 C={C} 시험',m.score(Xt,yt),te)
X,y,Xt,yt=get('ring'); ok('ch14 곧은 줄 SVM 시험',SVC(kernel='linear',C=1).fit(X,y).score(Xt,yt),0.555)
m=SVC(kernel='rbf',gamma=0.5,C=1).fit(X,y); ok('결승 주판봇 RBF',m.score(Xt,yt),0.96); ok('ch17 γ=0.5 서포트 벡터',m.n_support_.sum(),18,0)
ok('결승 초파리 KNN k=5',KNN(5).fit(X,y).score(Xt,yt),0.96); ok('ch17 γ=50 시험',SVC(kernel='rbf',gamma=50,C=1).fit(X,y).score(Xt,yt),0.71)
ok('ch17 다항(2차) 시험',SVC(kernel='poly',degree=2,gamma=0.3,coef0=1,C=1).fit(X,y).score(Xt,yt),0.925)
