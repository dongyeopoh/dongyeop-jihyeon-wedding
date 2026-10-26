# 시스템 구성

## 전체 그림

이 프로젝트는 서버가 없는 단일 페이지 모바일 청첩장이다. 빌드 결과(정적 HTML + JS + CSS + 이미지)가 GitHub Pages에서 그대로 제공되고, 동적인 기능은 모두 방문자의 브라우저 안에서 외부 서비스를 직접 호출하는 방식으로 동작한다.

```
방문자 브라우저
  │  GET https://dongyeopoh.github.io/dongyeop-jihyeon-wedding/
  ▼
GitHub Pages (저장소 dongyeopoh/dongyeop-jihyeon-wedding 의 gh-pages 브랜치)
  │  index.html → assets/index-*.js, index-*.css, 사진 26장 + 약도 + 메인 사진
  ▼
브라우저 안의 React 앱 (src/ 가 빌드된 번들)
  ├─ 네이버 지도 JS 스크립트 (Map 컴포넌트가 ncpKeyId 로 직접 로드, 지도 타일은 네이버 서버에서 직접 수신)
  ├─ utterances (https://utteranc.es/client.js) → GitHub 이슈 API 로 방명록 읽기/쓰기
  ├─ Google Fonts (Noto Sans KR, Roboto) 및 눈누 폰트 CDN (HSSanTokki20, SUITE)
  └─ 외부 링크: 네이버 지도 길찾기, 카카오맵 길찾기, 구글 캘린더 일정 추가, 인스타그램
```

경계를 넘는 것은 세 가지뿐이다. (1) 정적 파일 요청, (2) 지도 SDK 와 타일 요청, (3) 방명록을 위한 GitHub 이슈 읽기/쓰기. 이 프로젝트가 소유한 서버, 데이터베이스, 백엔드 API 는 없다. 방문자 데이터는 GitHub 이슈(방명록 댓글) 외에는 어디에도 저장되지 않는다.

## 화면 구성과 데이터 흐름

`src/main.jsx` 가 `App` 을 마운트하고, `App` 이 아래 순서로 화면을 세로로 쌓는다. 제목(`Heading1`)이 붙는 섹션은 모시는 글, Gallery, 오시는 길, 방명록 네 개이고, 달력은 "모시는 글" 섹션 안에서 인사말 옆(좁은 화면에서는 아래)에 놓인다. 라우팅은 없다.

| 순서 | 섹션 | 담당 폴더 | 읽는 데이터 |
|---|---|---|---|
| 1 | 메인 사진 + 스크롤에 따라 사라지는 인사말 오버레이 | `src/layout/Main` | `data.json`의 `greeting` |
| 2 | 모시는 글: 인사말, 양가 혼주, 일시·장소, 구글 캘린더 버튼 | `src/layout/Invitation`, `src/layout/Contact` | `greeting`, `greeting.host` |
| 2-1 | (모시는 글 안) 달력(2024년 11월 고정)과 D-day 초 단위 카운터 | `src/layout/Calendar` | `Calendar.jsx` 최상위의 고정 날짜 상수 |
| 4 | 갤러리: 접힌 상태(60vh) → "사진 더보기" → 라이트박스 | `src/layout/Gallery` | `Images.jsx`의 사진 목록 |
| 5 | 오시는 길: 네이버 지도, 길찾기 버튼, 약도 이미지, 주차·셔틀 안내 | `src/layout/Location` | `mapInfo`, `locationInfo` |
| 6 | 방명록 (utterances) | `src/layout/Comment` | 없음 (GitHub 이슈) |
| 7 | 화면 하단 고정 바: 맨 위로, 주소 복사 | `src/layout/FloatingBar` | 없음 |
| 8 | 푸터 | `src/layout/Footer` | `App.jsx`가 넘기는 문구 |

"마음 전하실 곳"(계좌) 섹션은 2026년 1월에 화면에서 빠졌고 2026-10-26 에 코드(`src/layout/Account`), 아이콘, 데이터(`hostInfo`)가 모두 삭제되어 운영 사이트에도 반영되었다. `data.json` 은 통째로 번들에 들어가므로 이 파일에 넣는 값은 모두 공개된다.

## 모듈 지도와 의존 방향

```
src/main.jsx ──▶ src/App.jsx ──▶ src/layout/**  ──▶ src/components/*  (범용 styled 조각)
                    │                 │
                    │                 └──▶ src/data.json (문구·혼주·장소 데이터)
                    │                 └──▶ src/assets/** (사진, 약도)
                    └──▶ src/theme.jsx (MUI 테마: 색상 팔레트, 기본 글꼴)
```

- `src/components` 는 Emotion `styled` 로 만든 글자 조각(`Text.jsx` 의 제목·문단·캡션)만 담는다. 데이터 파일이나 섹션 폴더를 참조하지 않는다.
- `src/layout/<섹션>` 은 한 폴더가 한 섹션이다. 섹션끼리는 서로 참조하지 않으며, 유일한 예외는 `Invitation` 이 `Contact/Host` 를 가져다 쓰는 것이다.
- 스타일 체계는 두 겹이다. MUI 컴포넌트(`Container`, `Button`, `Paper`, `IconButton`, `Stack`)에 `sx` 로 색을 덧입히고, 레이아웃 조각은 Emotion `styled` 로 직접 그린다. 전역 CSS 는 `src/index.css` 와 `src/App.css` 두 파일뿐이며 폰트 로딩과 본문 기본값을 담당한다.

## 빌드와 배포 경로

```
src/ + index.html + public/ + .env(VITE_NAVERMAPS_KEY_ID)
   │  vite build  (base 경로 "/dongyeop-jihyeon-wedding/" 가 모든 자산 URL 앞에 붙음. 키가 없으면 여기서 중단)
   ▼
dist/  (로컬 전용, git 무시 대상)
   │  npm run deploy: 린트 → 빌드 → 미리보기 확인 → dist 내용으로 커밋 하나 생성 → gh-pages 에 푸시
   ▼
gh-pages 브랜치 (배포 회차마다 스냅샷 커밋 하나씩, 최상위가 사이트 루트) ──▶ GitHub Pages 가 그대로 서비스
```

네이버 지도 Key ID 는 빌드 시점에 지도 스크립트 주소 안에 박혀 번들에 들어간다. 즉 배포된 JS 안에 ID 가 평문으로 있으며, 이는 브라우저용 지도 키의 정상적인 사용 방식이다(네이버 콘솔에 등록된 주소에서만 동작한다). main 에는 소스와 문서만 있고 빌드 산출물은 gh-pages 에만 있다.

## 외부 의존 서비스

| 서비스 | 역할 | 끊겼을 때 |
|---|---|---|
| GitHub Pages | 정적 호스팅 | 사이트 전체 접속 불가 |
| 네이버 클라우드 Maps (Web Dynamic Map) | 오시는 길 지도 | 지도 자리에 "지도를 불러오지 못했습니다" 안내 상자, 길찾기 버튼·약도는 동작 |
| utterances + GitHub 이슈 | 방명록 저장소 | 방명록 영역만 빈 칸 |
| Google Fonts, jsDelivr(눈누 폰트) | 제목·본문 글꼴 | 시스템 글꼴로 대체되어 표시 |
| 네이버 지도·카카오맵·구글 캘린더 링크 | 새 탭으로 여는 외부 페이지 | 해당 버튼만 실패 |
