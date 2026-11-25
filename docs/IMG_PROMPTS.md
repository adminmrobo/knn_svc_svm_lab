# 그림 요청문 (만드는 순서대로, 그대로 붙여 넣기)

- 모든 그림: 16비트 RPG 픽셀아트, 16:9, 그림 속 글자·숫자·로고 없음.
- 받은 그림 넣기: 원래 격자(생성 PNG ÷ 4, 보통 480×270)를 찾아 NEAREST 정수배로만 키운 무손실 WebP로 `assets/img/`에 같은 이름으로 저장.
- 순서: 1번(목차 표지)을 먼저 받아 그림체를 확인한 뒤, 2~6번을 요청할 때 1번을 참고 그림으로 함께 올립니다.

## 0. 캐릭터 고정 문장 (모든 요청 끝에 붙임)
```
Characters (keep exactly): Doctor — chibi scientist, round glasses, black hair with one white streak, white lab coat over black vest and red tie. Haru — girl with pink hair in two round buns, navy streak, blue eyes, white lab coat over lavender hoodie. Sia (intern 1) — girl with short dark-brown bob, green hairclip, mint hoodie. Moa (intern 2) — girl with orange-brown side ponytail, yellow cardigan. Fruit Fly — anthropomorphic fruit fly, black body, big red compound eyes, blue helmet with a gold stripe, transparent wings. Abacus Bot — robot with a grey boxy head, black screen face with yellow eyes, short antenna with red tip, body made of a wooden abacus frame with red, blue and green beads (NOT a white round robot). X1, X2, X3 — small rounded-cube sprites with big eyes: X1 red with one antenna, X2 green with two antennae, X3 blue with three antennae.
Style: 16-bit RPG pixel art, bold dark outline, 2–3 tone shading, bright cheerful colors, 16:9 landscape, no text, no letters, no numbers, no logos.
```

## 1. cover_index — 목차 표지
```
A sunny school sports field seen from a slight top-down angle. In the center, the Doctor sits at a small wooden referee desk with a scoreboard behind him (scoreboard shows only colored bars, no numbers). On the left, Team Fruit Fly: the Fruit Fly leader in front, with Sia, Haru and X1 beside it. On the right, Team Abacus Bot: the Abacus Bot leader in front, with Moa, X2 and X3. Between the teams, small blue circles and red triangles are scattered on the grass, and one green star marks a new student. Friendly tournament mood.
```

## 2. cover_part1 — 파트 1 깃발 찾기 (LDA)
```
School field. A group of blue circles on the left and a group of red triangles on the right, each group stretched in a slightly tilted oval. A small blue flag is planted at the center of the blue group and a small red flag at the center of the red group. A purple dotted arrow points from the blue flag to the red flag. Along the bottom, a long low fence where the students' shadows fall in one neat line, blue shadows on one side and red on the other. The Doctor points at the flags; X1 watches excitedly.
```

## 3. cover_part2 — 파트 2 이웃 투표 (KNN)
```
School field with many blue circles and red triangles mixed together. In the middle, a glowing green star (the new student) with a dashed green circle around it; the three students inside the circle raise their hands to vote. The Fruit Fly stands on the left pointing at the circle; the Abacus Bot on the right holds up one finger confidently. Sia and Haru count the votes.
```

## 4. cover_part3 — 파트 3 넓은 복도 (SVM·SVC)
```
School field divided by a wide diagonal yellow corridor painted on the grass, with a dark line down its middle and dashed lines on both edges. Blue circles stay on the lower-left side, red triangles on the upper-right side. Three students lean against the corridor's edge lines and are marked with green rings. The Abacus Bot cheers on the right; Moa measures the corridor width with a long ruler.
```

## 5. cover_part4 — 파트 4 무대 들어올리기 (커널)
```
School field with a round running track. In the center, a round stage is lifted up like an elevator; orange choir members stand on top of it. Blue runners stand on the running track around it. A translucent purple board slides horizontally between the raised stage and the track, separating them. X3 sparkles next to the stage; the Doctor raises both hands in excitement.
```

## 6. cover_practice — 실전 연습장 (선택)
```
A control room overlooking the school field, with four pixel-art panels on the wall: a field with two flags, a field with a dashed circle around a star, a field with a yellow corridor, and a field with a raised round stage. Sliders and knobs on the desk. Haru operates the knobs, the Fruit Fly checks a clipboard, the Abacus Bot leans in eagerly, the Doctor watches from behind with arms crossed and a smile.
```

## 검수
- 16:9, 그림 속 글자·숫자 없음, 캐릭터 겉모습 유지
- 주판봇이 흰 둥근 로봇처럼 보이지 않을 것(나무 주판 몸통)
- 픽셀 경계가 또렷할 것(4배 확대해도 흐리지 않게)
