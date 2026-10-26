# 지켜야 할 규칙

## 저장소와 브랜치

- `main` 브랜치에는 소스(`src/`, `index.html`, `package.json`, 설정 파일, `scripts/`)와 문서(`CLAUDE.md`, `AGENTS.md`, `docs/`)만 커밋한다. 빌드 산출물 `dist/` 는 `.gitignore` 대상이며 main 에 커밋하지 않는다. `dist/` 를 다시 추적하면 빌드마다 옛 번들이 이력에 쌓이고, 2026-10-26 이전처럼 삭제한 개인정보가 옛 번들 안에 영구히 남는 문제가 재발한다.
- `gh-pages` 브랜치는 `npm run deploy`(현재 `dist/` 내용으로 커밋 하나를 만들어 올리는 스냅샷 방식)로만 갱신한다. 이 브랜치를 체크아웃해서 손으로 고치거나 커밋하지 않고, 강제 푸시도 하지 않는다. 2026-10-26 이력 정리 이전에 받아 둔 다른 클론은 새로 받아야 한다(main·gh-pages 모두 이력이 새로 시작되었다).
- `.env` 는 커밋하지 않는다. 커밋 전 `git diff --cached | grep -c ghp_` 가 0 이어야 한다.

## 배포 전 통과 조건

세 가지가 모두 통과해야 배포된다. `npm run deploy` 가 이 순서를 강제하며, 어느 단계든 실패하면 아무것도 올라가지 않는다.

1. `npm run lint` 가 오류 0건으로 끝난다.
2. `npm run build` 가 오류 없이 끝난다. `.env` 에 `VITE_NAVERMAPS_KEY_ID` 가 없으면 여기서 실패한다.
3. 배포 명령이 띄운 미리보기(`http://localhost:4173/dongyeop-jihyeon-wedding/`)를 휴대폰 너비(약 390px)에서 눈으로 확인하고 `y` 를 입력한다. 최소 확인 항목: 메인 사진 위 오버레이가 스크롤에 따라 사라지는가, 지도가 뜨는가, 갤러리 "사진 더보기" 가 펼쳐지는가, 방명록 영역이 뜨는가.

자동 테스트는 없다.

## 경로와 설정

- `vite.config.js` 의 `base` 는 `"/dongyeop-jihyeon-wedding/"` 이어야 한다. GitHub 저장소 이름과 같아야 하며, 끝의 슬래시를 빼거나 이름을 바꾸면 배포된 사이트에서 모든 JS·CSS·이미지가 404 가 되고, 방명록이 연결된 이슈 제목(페이지 경로)도 달라져 기존 방명록이 보이지 않게 된다.
- 환경 변수는 `VITE_` 접두사가 있어야 브라우저 번들에 들어간다. 현재 쓰는 변수는 `VITE_NAVERMAPS_KEY_ID`(네이버 지도 Key ID) 하나이며, 이름을 바꾸면 `src/layout/Location/Map.jsx` 와 `vite.config.js` 의 검사 코드도 같이 바꿔야 한다.
- `vite.config.js` 는 `VITE_NAVERMAPS_KEY_ID` 가 비어 있으면 빌드와 개발 서버를 중단한다. 이 검사를 지우거나 우회하지 않는다(지우면 빈 지도가 조용히 배포된다).
- Node 는 18 이상이어야 한다(Vite 5 요구 사항). 현재 24.15 에서 동작을 확인했다.

## 의존성

- `package-lock.json` 을 기준으로 `npm ci` 로 설치한다. 의존성을 바꾸기로 결정한 커밋이 아니면 lock 파일이 바뀌어서는 안 된다.
- 지도는 라이브러리 없이 네이버 지도 스크립트를 `Map.jsx` 가 직접 로드한다(예전에 쓰던 지도 래퍼 라이브러리는 React 19 전용이 되어 2026-10-27 에 제거했다). 라이트박스는 `react-photoswipe-gallery`, 날짜 계산은 `date-fns`, 스타일은 Emotion 과 MUI 로 통일한다. 같은 역할의 다른 라이브러리를 섞지 않는다(예: 두 번째 CSS 방식, 지도 래퍼 라이브러리).

## 코드 배치

- **청첩장 내용은 `src/data.json` 에만 둔다.** 이름, 인사말, 일시·장소 문구, 혼주, 지도 좌표와 네이버·카카오 길찾기 링크, 주차·셔틀 안내가 여기 있다. 어떤 컴포넌트도 읽지 않는 키를 남겨 두지 않는다(2026-10-26 에 `title`·`poetry`·`emojis` 를 그 이유로 지웠다). 반면 버튼 글자·알림 문구·섹션 제목·요일 머리글 같은 **UI 라벨은 컴포넌트에 둔다**("사진 더보기", "위로", "공유", "구글캘린더 일정 추가하기" 등이 그렇다). 사람 이름이나 장소처럼 결혼식이 바뀌면 바뀌는 값을 컴포넌트에 박으면 위반이다. 현재 이 규칙과 어긋나게 컴포넌트에 있는 값은 세 개다: 구글 캘린더 일정 링크(`Invitation.jsx`), 인스타그램 링크(`Footer.jsx`), 예식 날짜 상수(`Calendar.jsx`). 이 셋은 옮기지 말고 그 자리에서 고친다.
- `src/components/` 의 파일은 `data.json` 이나 `src/layout/` 을 import 하지 않는다. 확인: `grep -l "data.json" src/components/*` 가 아무것도 내지 않아야 한다.
- `src/layout/` 의 섹션 폴더끼리는 서로 import 하지 않는다. 현재 유일한 예외는 `Invitation` → `Contact/Host` 이며, 새 예외를 만들지 않는다.
- 새 섹션은 `src/layout/<이름>/` 폴더를 만들고 `App.jsx` 에서 `<Wrapper><Heading1>…</Heading1><섹션/></Wrapper>` 꼴로 끼워 넣는다. `App.jsx` 밖에서 섹션을 조립하지 않는다.
- 갤러리 사진을 추가·교체할 때는 `src/assets/images/NN.jpg` 파일과 `src/layout/Gallery/Images.jsx` 의 항목(가로·세로 픽셀 값 포함)을 같이 고친다. 한쪽만 고치면 빌드는 되지만 라이트박스 비율이 틀어지거나 사진이 빠진다.

## 날짜·장소 변경

예식 일시나 장소는 한 커밋 안에서 `src/data.json`, `src/layout/Calendar/Calendar.jsx`, `index.html` 세 파일을 함께 고쳐야 한다. 한 파일만 바뀐 커밋은 위반이다.
