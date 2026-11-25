# 그림 목록 (IMG_INDEX)

| 키 | 종류 | 지금 상태 | 크기 | 쓰는 곳 |
|---|---|---|---|---|
| cover_index | 표지 | 코드로 그림(tools/cover.html) | 480×270 → 1920×1080 | 목차 |
| cover_part1~4 | 표지 | 코드로 그림 | 480×270 → 1920×1080 | 각 파트 |
| og_index, og_part1~4, og_practice | 공유 미리보기 | 표지에서 480×252를 잘라 2배 | 960×504 | og:image |
| 캐릭터 9명 × 표정 8 | 픽셀 스프라이트 | 코드로 그림(assets/sprites.js) | 32×32 | 말풍선·등장인물·대회 |

새로 그려 바꿀 수 있는 그림은 `docs/IMG_PROMPTS.md`의 순서대로 요청하세요. 받은 표지는 원래 격자(생성 PNG ÷ 4)를 찾아 NEAREST 정수배로만 키운 무손실 WebP로 `assets/img/`에 같은 이름으로 넣으면 됩니다.
