# 거리로 가르는 분류 대회 — LDA · KNN · SVM · SVC · 커널

벡터와 행렬을 처음 배우는 분을 위한 연구실 해설 시리즈입니다. 운동장 지도 위에서 **초파리 팀**(인턴1 시아 · 하루 · X1)과 **주판봇 팀**(인턴2 모아 · X2 · X3)이 분류 대회를 벌이고, **박사**가 심판을 봅니다. 모든 방법에 공통으로 흐르는 생각은 하나, **가까우면 같은 편**이에요.

| 쪽 | 내용 | 라운드 결과 |
|---|---|---|
| [목차](index.html) | 두 팀, 대회 규칙, 큰 그림, 기호 사전 | — |
| [파트 1 깃발 찾기 (LDA)](part1_lda.html) | 챕터 1~5: 벡터 카드, 거리, 평균(깃발), 내적(그림자 점수), Fisher 기준 | 주판봇 99.5% : 초파리 86.0% |
| [파트 2 이웃 투표 (KNN)](part2_knn.html) | 챕터 6~8: 이웃 투표, k 고르기, 단위 맞추기 | 초파리 87.5% : 주판봇 66.3% |
| [파트 3 넓은 복도 (SVM·SVC)](part3_svm.html) | 챕터 9~13: 경계 줄, 가장 넓은 복도, 서포트 벡터, C와 SVC, 이름 정리(SVR) | 주판봇 99.5% : 초파리 83.5% |
| [파트 4 무대 들어올리기 (커널)](part4_kernel.html) | 챕터 14~17: 한 차원 올리기, 커널 = 닮음 점수, RBF, C와 γ | 결승 96.0% : 96.0% 무승부 |
| [실전 연습장](practice/index.html) | 깃발 본부 · 동아리 배정 사무실 · 복도 공사 현장 · 무대 조명실 (미션 12개, 자동 판정) | — |

## 만드는 법
- 문구는 `data/*.py`(파트별 문구, 공통 캐릭터·약어·참고 자료)에 있고, `python3 build.py`가 HTML을 만듭니다.
- 실험·대회 계산은 브라우저에서 직접 합니다: `assets/ml.js`(거리·KNN·SVM-SMO), 데이터는 `assets/data.js`.
- 캐릭터는 `assets/sprites.js`가 코드로 그리는 16비트 RPG풍 픽셀아트입니다. 표지는 `tools/cover.html`로 480×270 격자에 그린 뒤 4배(NEAREST) 무손실 WebP로 키웠습니다.
- 페이지 숫자 검산: `python3 tools/verify_numbers.py` (scikit-learn과 대조).
- 지식 색인·꾸러미 원본: `kg/` 폴더(kg.json · refs.json · meta.json).

## 참고 자료
MLTut 「Distance & Kernel Methods」 인포그래픽, eeanimation 「Linear Discriminant Analysis」 Part 1~4 인포그래픽, Fisher (1936), Cover & Hart (1967), Boser·Guyon·Vapnik (1992), Cortes & Vapnik (1995), Platt (1998), James 외 (2013).

숫자는 모두 이 시리즈를 위해 만든 교육용 예시 데이터로 계산했습니다.

글 · 안상선 (https://adminmrobo.github.io/who_am_i/who_am_i.html) · (주)M-Robo 대표
