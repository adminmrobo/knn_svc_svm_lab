# 그림 요청문 v2 — 정식 캐릭터(fruitfly-lab-expressions) 기준

- 캐릭터 정본: https://github.com/adminmrobo/fruitfly-lab-expressions (여섯 식구 한 줄 `images/_sheets/lab6_lineup.png`, X1~X3 실루엣 `images/_sheets/spares_sheet.png`)
- 팀: **주판봇 팀** = 주판봇(주장)·하루·시아·모아 / **초파리 팀** = 초파리(주장)·X1·X2·X3 / 심판 = 박사
- 모든 그림: 16:9, 그림 속 글자·숫자·로고 없음. 순서: 1번(목차 표지)을 먼저 받아 그림체를 확인한 뒤 2~6번에 1번을 참고 그림으로 함께 올림.
- 넣는 법: 원래 격자(생성 PNG ÷ 4)로 맞춘 뒤 NEAREST 정수배, 무손실 WebP로 `assets/img/cover_*.webp`.

## 0. 캐릭터·화풍 고정 문장 (모든 요청 끝에 붙임)
```
Characters (match the attached reference sheets exactly, keep every design detail):
- The Professor (referee): chibi male scientist, big head, dark charcoal spiky hair with a white streak at the front, small low ponytail, very thick black eyebrows, teal-framed rectangular glasses, white lab coat over black vest, black tie.
- Abacus Bot team captain JUPANBOT: cute retro computer robot, boxy beige CRT-monitor body, dark green screen face drawn with simple mint-green pixel blocks, short antenna topped with a red-brown abacus bead, gray segmented arms with mitten hands, dark gray tank treads, holds a small wooden abacus.
- Haru (Abacus Bot team): anime girl lab assistant, long straight pink hair with navy streaks, two round messy buns, big blue eyes, lavender hoodie under an open white lab coat.
- Sia (Abacus Bot team): calm maid intern, long straight jet-black hair, gray eyes, charcoal-black maid dress, white high collar with a gray bow, long white apron.
- Moa (Abacus Bot team): cheerful maid intern, long ash-beige wavy hair, white frilled maid headband, amber eyes, camel cardigan, plaid bow tie, white frilled apron.
- Fruit Fly team captain: tiny cartoon fruit fly researcher, charcoal-black segmented body, large glossy red compound eyes, retro dark blue helmet with a yellow-white stripe, colorful cables from the helmet, tiny white lab coat, translucent wings.
- X1, X2, X3 (Fruit Fly team): mysterious chibi silhouettes, solid dark navy-black (#1B1A2E) with a thin purple rim light, two round white dot eyes, pink cheeks, cute not scary. X1: long side ponytail with a big pink bow. X2: round beret and round glasses with two tiny reflections. X3: small body in a cat-ear hood with a yellow pom-pom.
Style: detailed 16-bit SNES-era pixel art, limited palette, crisp pixels, dithering shading, thick dark outlines, cheerful comedy mood, 16:9 landscape, bright school sports field, no readable text, no letters, no numbers, no logos.
```

## 1. cover_index — 목차 표지
```
A sunny school sports field. In the center back, the Professor sits at a small wooden referee desk with a scoreboard showing only colored bars. On the left, the Abacus Bot team: JUPANBOT in front with Haru, Sia and Moa. On the right, the Fruit Fly team: the Fruit Fly in front with the three silhouettes X1, X2, X3. Between the teams, small blue circles and red triangles are scattered on the grass, and one green star marks a new student. Friendly tournament mood.
```

## 2. cover_part1 — 파트 1 깃발 찾기 (LDA)
```
School field. A group of blue circles on the left and a group of red triangles on the right, each stretched in a slightly tilted oval. A small blue flag at the center of the blue group and a small red flag at the center of the red group, joined by a purple dotted arrow. Along the bottom, a long low fence where the students' shadows fall in one neat line. The Professor points at the flags; X1 holds a measuring tape between the flags; JUPANBOT and Sia watch from the fence.
```

## 3. cover_part2 — 파트 2 이웃 투표 (KNN)
```
School field with many blue circles and red triangles mixed together. In the middle, a glowing green star (the new student) with a dashed green circle around it; three small students inside the circle raise their hands to vote. The Fruit Fly points at the circle with a pointer; X2 counts votes on a clipboard; JUPANBOT holds up one finger confidently while Moa looks surprised.
```

## 4. cover_part3 — 파트 3 넓은 복도 (SVM·SVC)
```
School field divided by a wide diagonal yellow corridor painted on the grass, a dark line down its middle and dashed lines on both edges. Blue circles on the lower-left side, red triangles on the upper-right side. Three small students lean on the corridor edges and are marked with green rings. JUPANBOT cheers holding its abacus; Haru measures the corridor width with a long ruler; the Fruit Fly looks doubtful.
```

## 5. cover_part4 — 파트 4 무대 들어올리기 (커널)
```
School field with a round running track. In the center, a round stage is lifted up like an elevator with orange choir members on top. Blue runners stand on the track around it. A translucent purple board slides horizontally between the raised stage and the track. X3 operates the lift lever with sparkles around; the Professor raises both hands in excitement; JUPANBOT and the Fruit Fly face each other for the final.
```

## 6. cover_practice — 실전 연습장
```
A control room overlooking the school field, with four pixel monitors on the wall showing: two flags, a dashed circle around a star, a yellow corridor, a raised round stage. Haru operates sliders and knobs at a console, Sia takes notes, Moa leans in, JUPANBOT and the Fruit Fly watch the screens, X1–X3 peek from the side, and the Professor stands behind with arms crossed and a smile.
```

## 검수
- 캐릭터가 정본 그림과 같을 것(주판봇은 베이지 모니터 몸+초록 화면 얼굴+무한궤도, X1~X3는 검은 실루엣)
- 16:9, 그림 속 글자·숫자 없음, 4배로 키워도 픽셀 경계가 또렷할 것
