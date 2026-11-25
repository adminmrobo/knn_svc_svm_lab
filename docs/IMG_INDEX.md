# 그림 목록 (IMG_INDEX)

| 키 | 종류 | 지금 상태 | 크기 | 쓰는 곳 |
|---|---|---|---|---|
| cover_index, cover_part1~4, cover_practice | 표지 | 생성 그림 반영(2026-11-26). 2048×1152 원본 → 원래 격자 512×288(NEAREST) → 4배 NEAREST, 무손실 WebP | 2048×1152 | 목차·각 파트·실전 연습장 |
| og_index, og_part1~4, og_practice | 공유 미리보기 | 원래 격자에서 512×268을 잘라 2배 | 1024×536 | og:image |
| 캐릭터 9명 × 표정 8 | 픽셀 스프라이트 | 코드로 그림(assets/sprites.js) | 32×32 | 말풍선·등장인물·대회 |

- 처음 코드로 그린 표지는 `tools/cover.html`로 다시 만들 수 있습니다(git 기록에도 남아 있음).
- 새 그림을 받으면 같은 이름으로 위 과정을 거쳐 `assets/img/`에 넣습니다. 요청문은 `docs/IMG_PROMPTS.md`.
