# 동엽·지현 모바일 청첩장

2024년 11월 2일 무주 태권도원 명인관에서 열린 결혼식의 모바일 청첩장이다. React 단일 페이지(세로로 쌓인 화면 덩어리 7개, 소스 파일 약 25개)를 Vite 로 빌드해 GitHub Pages 에 올린 정적 사이트이며, 서버·DB 가 없고 지도(네이버, 스크립트 직접 로드), 방명록(GitHub 이슈), 글꼴(CDN)을 외부 서비스에 기댄다. 결혼식은 끝났고 지금은 **기록용 보존 모드** 다: 문구·사진 수정, 개인정보 정리, 작은 버그 수정만 하며 새 기능을 더하지 않는다. 만드는 사람도 쓰는 사람도 신랑(dongyeopoh) 한 명이다.

## 프로젝트 구조

```
dongyeop-jihyeon-page/
├── CLAUDE.md                  ← 이 파일. 프로젝트 개요, 절대 규칙, 작업 전 읽을 것
├── AGENTS.md                  ← CLAUDE.md 와 동일
├── docs/
│   ├── architecture.md        ← 화면 구성, 데이터 흐름, 빌드→배포 경로, 외부 서비스
│   ├── business-rules.md      ← 섹션별 표시 규칙 (D-day 계산, 혼주 표기, 길찾기가 도약센터를 가리키는 이유 등)
│   ├── security.md            ← 보호 대상, 토큰·지도 키 관리, 개인정보 정책
│   ├── standards.md           ← 저장소·배포·코드 배치 규칙 전체 (아래 절대 규칙의 원본)
│   ├── engineering-notes.md   ← 함정 모음: 배포 푸시 거부, 지도 안내 상자, 스크립트 중복 삽입, 날짜 세 곳 등
│   ├── operations.md          ← 설치·개발·빌드·배포 명령을 순서대로
│   ├── contracts.md           ← 공개 주소, 링크 미리보기 메타, 방명록 이슈 형식
│   └── tracking/
│       ├── status.md          ← 완성된 것, 남은 일(우선순위), 검증 도구 상태
│       ├── decisions/
│       │   ├── index.md       ← 결정 목록
│       │   ├── 0001-repo-layout-and-deploy.md
│       │   ├── 0002-guestbook-on-github-issues.md
│       │   ├── 0003-post-wedding-archive.md
│       │   └── 0004-snapshot-deploy.md
│       └── findings.md        ← 미해결 문제 (지도 스크립트 재시도 없음)
├── src/
│   ├── AGENTS.md              ← 소스 모듈의 범위·경계·불변 조건·수정 패턴
│   ├── App.jsx                ← 섹션 조립 순서의 유일한 자리
│   ├── data.json              ← 바뀔 수 있는 모든 문구·혼주·장소 데이터
│   ├── components/            ← 글자 styled 조각 (데이터를 모름)
│   └── layout/<섹션>/         ← 섹션 하나 = 폴더 하나
├── scripts/deploy.sh          ← npm run deploy: 린트→빌드→미리보기 확인→gh-pages 스냅샷 푸시
├── public/thumbnail.jpg       ← 링크 공유 미리보기 사진 (1500×1000)
├── dist/                      ← 빌드 산출물. git 무시 대상, 커밋하지 않음. gh-pages 에만 올라감
└── index.html                 ← 제목·설명·공유 미리보기 메타 (JS 가 바꾸지 않음)
```

## 절대 규칙

1. **비밀과 계좌번호를 저장소에 남기지 않는다.** `.env` 는 커밋 금지, 저장소 주소에 토큰 금지(`git diff --cached | grep ghp_` 가 비어야 함), `src/data.json` 과 번들 어디에도 계좌번호가 있으면 안 된다.
2. **`vite.config.js` 의 `base` 는 `"/dongyeop-jihyeon-wedding/"` 고정.** 바꾸면 배포 사이트의 모든 자산이 404 가 되고 방명록이 연결된 이슈도 끊긴다.
3. **배포는 main 에서 `npm run deploy` 한 명령으로만.** 린트 0건 → 빌드 → 휴대폰 너비 눈 확인(`y` 입력) → gh-pages 스냅샷 푸시 순서를 스크립트가 강제한다. `dist/` 를 커밋하지 않고, `gh-pages` 를 손으로 고치거나 강제 푸시하지 않는다.
4. **청첩장 내용(이름, 인사말, 일시·장소, 혼주, 지도, 주차·셔틀 안내)은 `src/data.json` 에만.** 컴포넌트에는 버튼 글자 같은 UI 라벨만 둔다. 예외로 구글 캘린더 링크는 `Invitation.jsx`, 인스타그램 링크는 `Footer.jsx`, 날짜 상수는 `Calendar.jsx` 에 있다.
5. **새 기능·새 의존성은 먼저 사용자에게 확인.** 보존 모드다.

## 작업 전 읽을 것

- 어떤 작업이든: `docs/standards.md`, `docs/engineering-notes.md`, `src/AGENTS.md`.
- 문구·날짜·장소를 바꾸기 전: `docs/business-rules.md` 의 "오시는 길" (길찾기 목적지가 예식장과 다른 이유) 과 `docs/engineering-notes.md` 의 "날짜가 세 곳에 따로 있다".
- 배포하기 전: `docs/operations.md` 의 배포 절차 전체와 `docs/engineering-notes.md` 의 "배포 명령이 푸시 단계에서 거부된다".
- 계좌 섹션·개인정보를 건드리기 전: `docs/security.md` 의 개인정보 정책과 `docs/tracking/decisions/0003-post-wedding-archive.md`.
- 갤러리 사진을 넣기 전: `docs/engineering-notes.md` 의 "갤러리가 무겁다".
- 지도를 건드리거나 지도가 안 뜰 때: `docs/engineering-notes.md` 의 '지도 자리에 "지도를 불러오지 못했습니다" 가 뜬다' 와 '지도 스크립트는 한 번만 끼워 넣는다', `src/AGENTS.md` 의 지도 항목.

## 문제가 생기면

즉시 사용자에게 보고하고 멈출 것:
- 토큰·키·계좌번호가 커밋이나 번들에 들어갈 상황 (또는 들어간 것을 발견)
- 배포된 사이트가 흰 화면이거나 자산 404
- 방명록 이슈 연결이 끊기는 변경 (base 경로, 저장소 이름, 저장소 공개 여부)
- 보존 모드와 충돌하는 요청 (새 기능, 새 의존성, 템플릿화)

그 외 당장 못 고치는 문제는 `docs/tracking/findings.md` 에 "조건·증상 → 영향 → 지금 못 고치는 이유 → 접근" 형식으로 적는다.
