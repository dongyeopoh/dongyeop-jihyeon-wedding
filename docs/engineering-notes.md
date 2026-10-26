# 작업 노트: 모르면 빠지는 함정과 비직관적인 동작

## 새로 빌드한 파일이 배포에서 빠진다

- 증상: 배포 후 사이트가 흰 화면이다. 브라우저 콘솔에 `assets/index-XXXX.js` 404.
- 원인: 2026-10-26 이전에는 `.gitignore` 에 `dist` 가 적힌 채 `dist/` 가 추적되고 있었다. 이미 추적되는 파일의 수정은 `git add dist` 로 잡히지만, 빌드마다 해시가 바뀌어 새로 생기는 `index-XXXX.js` 는 "무시 대상의 새 파일" 이라 조용히 빠진다. 옛 파일은 삭제로 잡히고 새 파일은 안 잡히니 `index.html` 이 존재하지 않는 번들을 가리키게 된다.
- 대응: 2026-10-26 에 `.gitignore` 에서 `dist` 줄을 지워 해결했다. 누군가 다시 넣으면 같은 증상이 재발하므로, 배포 커밋 전에 `git status --short dist | grep '^??'` 가 비어 있는지 보는 습관은 유지한다.

## subtree push 가 거부된다

- 증상: `git subtree push --prefix dist origin gh-pages` 가 `non-fast-forward` 로 실패한다.
- 원인: gh-pages 브랜치가 다른 경로로 갱신되었거나(손 편집, 다른 컴퓨터에서 푸시), 로컬 main 의 `dist/` 이력과 원격 gh-pages 이력이 어긋났다.
- 대응: `git push origin "$(git subtree split --prefix dist main)":gh-pages --force` 로 main 의 `dist/` 이력을 기준으로 덮어쓴다. gh-pages 에는 보존할 독자적 내용이 없으므로 강제 덮어쓰기가 안전하다. 확인: 1~2분 뒤 사이트를 새로고침해서 `index.html` 이 새 해시의 JS 를 가리키는지 본다.

## 지도가 빈 칸이거나 인증 오류가 뜬다

- 증상: 오시는 길 섹션에 회색 빈 칸만 보이고 콘솔에 네이버 지도 인증 실패 메시지가 있다.
- 원인 두 가지. (1) 빌드할 때 `.env` 가 없어서 클라이언트 ID 가 `undefined` 로 번들에 박혔다. 빌드는 경고 없이 성공하므로 눈치채기 어렵다. (2) 접속한 주소가 네이버 콘솔의 Web 서비스 URL 에 등록되어 있지 않다. 로컬 미리보기(`localhost:5173`, 또는 휴대폰에서 접속하는 LAN 주소)와 배포 주소(`https://dongyeopoh.github.io`)가 각각 등록되어 있어야 한다.
- 대응: `.env` 의 값이 콘솔의 ID 와 같은지 확인한 뒤 다시 빌드한다. 확인: `grep -c "$(cut -d= -f2 .env | tail -1)" dist/assets/index-*.js` 가 1 이상이어야 번들에 ID 가 들어간 것이다.

## 날짜가 세 곳에 따로 있다

- 증상: 화면의 달력은 11월인데 공유 미리보기나 인사말에는 다른 날짜가 보인다.
- 원인: 예식 일시가 `src/data.json` (문구), `src/layout/Calendar/Calendar.jsx` (계산용 `Date` 와 표시할 달), `index.html` (메타 태그) 세 곳에 각각 적혀 있고 서로를 참조하지 않는다.
- 대응: 날짜를 바꾸면 세 파일을 모두 고친다. 확인: `grep -rn "2024" src/data.json src/layout/Calendar/Calendar.jsx index.html` 로 남은 옛 날짜가 없는지 본다.

## D-day 타이머가 매초 새로 만들어진다

- 증상: 동작은 하지만 `Calendar.jsx` 를 고칠 때 effect 가 매초 해제·재등록되는 것이 보인다.
- 원인: 기준 날짜 `fixedDate` 가 컴포넌트 본문에서 `new Date(...)` 로 매 렌더마다 새 객체가 되고, 그것이 `useEffect` 의 의존성이라 매초 `setSecondsLeft` → 재렌더 → 새 `Date` → effect 재실행이 반복된다. 린트 경고를 막기 위한 주석이 이 사실을 가리고 있다.
- 대응: 날짜 상수를 컴포넌트 밖으로 꺼내면 effect 가 한 번만 등록된다. 고친 뒤 확인: 브라우저 콘솔에서 `setInterval` 이 1회만 호출되는지, D-day 숫자가 여전히 매초 줄어드는지(또는 늘어나는지) 본다.

## 방명록이 두 번 뜨거나 안 뜬다

- 증상: 개발 서버에서 방명록 영역이 두 개 생기거나, 배포 후 빈 칸이다.
- 원인: 개발 모드의 `StrictMode` 는 effect 를 두 번 실행한다. `Comment.jsx` 는 같은 스크립트 태그가 이미 있는지 검사해서 두 번째 삽입을 막고 있으므로, 이 검사를 지우면 두 개가 생긴다. 배포 후 빈 칸은 utterances GitHub 앱이 저장소에서 빠졌거나 저장소가 비공개가 된 경우다.
- 대응: 중복 검사 로직을 유지한다. 빈 칸이면 GitHub 의 저장소 설정 → Integrations 에서 utterances 가 설치되어 있는지, 저장소가 Public 인지 확인한다. 방명록 글은 제목이 `/dongyeop-jihyeon-wedding/` 인 이슈에 쌓이므로 그 이슈를 닫거나 잠그면 새 글이 막힌다.

## 갤러리가 무겁다

- 증상: 휴대폰 데이터로 처음 열면 갤러리 사진이 한참 뒤에 나타난다.
- 원인: 썸네일 전용 파일이 없다. 26장 모두 원본(장당 0.2~3.0MB, 합계 약 59MB; 다섯 장은 긴 변 4032px 의 촬영 원본)이 썸네일로도 쓰이고 라이트박스 원본으로도 쓰인다. 접힌 상태(60vh)라도 `img` 태그는 전부 렌더되므로 26장을 다 받는다.
- 대응: 사진을 추가할 때는 긴 변 1920px 이하로 줄여서 넣는다(대부분의 기존 사진이 1280×1920 이라 화면에서 차이가 없다). 확인: `du -sh src/assets/images` 가 추가 후에도 크게 늘지 않아야 한다.

## 공유 미리보기 사진이 안 나온다

- 증상: 카카오톡에 링크를 붙이면 제목·설명은 나오는데 사진이 비어 있다.
- 원인: `index.html` 의 `og:image` 가 노션의 서명된 임시 주소를 가리키고 있고, 그 서명은 2024년 10월 9일에 만료되었다(지금 요청하면 403).
- 대응: 미리보기용 사진을 `public/` 에 넣고(예: `public/thumbnail.jpg`), `og:image` 를 `https://dongyeopoh.github.io/dongyeop-jihyeon-wedding/thumbnail.jpg` 처럼 절대 주소로 바꾼 뒤 배포한다. `og:image:width`/`height` 도 실제 크기로 맞춘다. 확인: 카카오톡 공유 디버거나 새 채팅방에 링크를 붙여 사진이 뜨는지 본다. 메신저가 옛 미리보기를 캐시하므로 주소 끝에 `?v=2` 같은 꼬리표를 붙여 확인한다.

## 하단 고정 바가 항상 보인다

- 증상: 의도는 갤러리까지 내려갔을 때부터 보이는 것인데, 첫 화면부터 보인다.
- 원인: `FloatingBar.jsx` 의 함수가 `function FloatingBar(isVisible)` 로 선언되어 매개변수가 불리언이 아니라 props 객체 전체를 받는다. 객체는 항상 참이므로 `display: flex` 가 고정된다. `App.jsx` 쪽의 스크롤 감시는 정상이다.
- 대응: `function FloatingBar({ isVisible })` 로 구조 분해하면 의도대로 동작한다. 확인: 첫 화면에서는 바가 없고, 갤러리 제목이 화면 맨 위에 닿는 순간 나타나야 한다.

## 개발 서버가 안 뜬다

- 증상: `npm run dev` 가 포트 오류로 바로 종료된다.
- 원인: `vite.config.js` 에 `strictPort: true` 와 `port: 5173` 이 고정되어 있어 다른 프로세스가 5173 을 쓰고 있으면 다른 포트로 넘어가지 않고 실패한다. 휴대폰에서 같은 Wi-Fi 로 접속해 보기 위해 `host: true` 로 열어 둔 것으로 보이며, 포트를 못 박은 이유는 기록에 없다.
- 대응: 5173 을 쓰는 프로세스를 끈다(`lsof -i :5173`). 포트를 바꾸면 네이버 콘솔의 등록 URL 도 바꿔야 지도가 뜬다.
