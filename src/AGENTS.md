# src/ — 청첩장 화면 소스

## 이 모듈이 맡는 것

브라우저에 그려지는 모든 것: 섹션 조립(`App.jsx`), 섹션별 화면(`layout/`), 글자 styled 조각(`components/Text.jsx`), 문구·혼주·장소 데이터(`data.json`), MUI 테마(`theme.jsx`), 전역 CSS 두 파일, 사진(`assets/`).

맡지 않는 것: 공유 미리보기 메타와 페이지 제목(`index.html` 이 담당, JS 로 바꾸지 않는다), 빌드 설정과 base 경로(`vite.config.js`), 배포 산출물(`dist/`, 손대지 않는다), 방명록 글의 저장·관리(GitHub 이슈), 지도 키 발급(네이버 콘솔).

## 경계

- `components/` 는 `data.json`, `layout/`, `assets/` 를 import 하지 않는다. props 로 받은 것만 그린다.
- `layout/<섹션>/` 은 다른 섹션 폴더를 import 하지 않는다. 유일한 기존 예외는 `Invitation/Invitation.jsx` → `Contact/Host.jsx`. 새 예외를 만들지 않는다.
- 섹션의 등장 순서와 제목은 `App.jsx` 에서만 정한다. 섹션 컴포넌트는 자기 제목(`Heading1`)을 그리지 않는다.
- `data.json` 을 읽는 파일은 `layout/` 아래뿐이다. 데이터를 가공해 다른 모양으로 저장하는 중간 파일을 만들지 않는다.

## 항상 지켜야 할 것

- `data.json` 의 `greeting.host.groom` / `bride` 는 각각 `name`, `relation`, 그리고 `parents` 배열(아버지, 어머니 순)을 가진다. `parents` 가 없는 경우는 허용되지만(부모 표기 생략), 있다면 각 항목에 `relation` 과 `name` 이 모두 있어야 한다. 빠지면 `Host.jsx` 의 props 검증이 개발 모드 콘솔에 경고를 낸다.
- `data.json` 의 `locationInfo` 는 `{ title, desc }` 배열이고 `title` 이 서로 달라야 한다(`Address.jsx` 가 `title` 을 key 로 쓴다). 같은 제목이 둘이면 React 가 경고하고 한 항목이 사라질 수 있다.
- `data.json` 의 `mapInfo.lat`, `lon` 은 JSON 숫자(따옴표 없음)로 둔다. 지금 값이 그렇고, `Map.jsx` 가 그대로 `navermaps.LatLng` 에 넘긴다.
- `layout/Gallery/Images.jsx` 의 항목 수와 `assets/images/NN.jpg` 파일 수가 같아야 하고, 각 항목의 `width`/`height` 는 실제 사진과 **비율**이 같아야 한다. 실제 픽셀 크기가 아니다(예: 1280×1920 사진을 1000×1500 으로 적는다). 비율이 틀리면 라이트박스에서 사진이 잘린다. 확인: `sips -g pixelWidth -g pixelHeight assets/images/NN.jpg` 의 비와 목록의 비가 같은지 본다.
- `layout/Comment/Comment.jsx` 의 `repo` 속성은 `dongyeopoh/dongyeop-jihyeon-wedding`, `issue-term` 은 `pathname` 이다. 둘 중 하나라도 바꾸면 기존 방명록이 보이지 않는다.
- `data.json` 어디에도 계좌번호·송금 링크가 있어서는 안 된다. 계좌 섹션은 2026-10-26 에 코드와 데이터 모두 삭제되었고 되살리지 않는다.
- 문구의 줄바꿈은 JSON 문자열 안의 `\n` 으로 넣고, 그 문구를 그리는 styled 컴포넌트에 `white-space: pre-line` 이 있어야 줄이 바뀐다. `components/Text.jsx` 의 조각들은 모두 이 속성이 있다.

## 이 모듈의 방식

- 스타일은 두 겹이다. 레이아웃·글꼴은 Emotion `styled` 상수로 같은 파일 안에 정의하고(파일 위에 두는 곳과 아래에 두는 곳이 반반이라 위치 관례는 없다), MUI 컴포넌트(`Button`, `Paper`, `Container`, `IconButton`, `Stack`)에는 `sx` 로 색만 덧입힌다. 새 CSS 파일이나 CSS 모듈을 만들지 않는다.
- 조건부 스타일은 HTML 태그를 감싼 styled 컴포넌트에 불리언 props 를 넘겨 템플릿 안에서 분기한다(`isVisible`, `isMoreView`, `isFixedDate` 등).
- 글꼴 역할: 제목·혼주·D-day 는 `HSSanTokki20-Regular`, 본문은 `SUITE-Regular`, 섹션 제목은 `Noto Sans KR`. 전부 CDN 에서 오며 `index.css` 에서만 선언한다.
- 색 팔레트는 `theme.jsx` 의 MUI 테마(primary `#598bba`, secondary `#8eb264`)와 각 섹션의 직접 지정 색이 섞여 있다. 새 색은 테마에 넣기보다 해당 섹션 파일 안에서 지정하는 것이 기존 관례다.
- 스크롤 반응(메인 오버레이, 고정 바)은 `window` 의 `scroll` 이벤트를 `useEffect` 에서 등록하고 cleanup 에서 해제한다. `Main.jsx` 는 `passive: true` 를 붙였고 `App.jsx` 는 붙이지 않아 통일되어 있지 않다. 새 리스너는 `passive: true` 쪽을 따른다.
- 외부 링크는 새 탭(`target="_blank"`, `rel="noreferrer"`)으로 연다. 같은 탭에서 이동시키면 청첩장이 닫힌다. 현재 유일하게 같은 탭으로 여는 것은 푸터의 인스타그램 링크이며, 새 링크는 새 탭 쪽을 따른다.
- 클립보드 복사 결과는 `alert` 로 알린다. 토스트 라이브러리를 들이지 않는다.

## 수정할 때 확인할 것

자동 테스트가 없으므로 아래를 `npm run dev` 또는 `npm run preview` 에서 휴대폰 너비(약 390px)로 직접 본다.

- 문구를 바꿨다면: 줄바꿈이 의도대로 보이는지, 메인 오버레이와 모시는 글 두 곳에 같은 인사말이 나오는지.
- 혼주를 바꿨다면: "아버지 · 어머니 의 아들 동엽" 순서가 유지되는지, 두 줄이 가로로 넘치지 않는지(`white-space: nowrap` 이라 긴 이름은 잘린다).
- 날짜를 바꿨다면: 달력의 빨간 원이 맞는 날에 있는지, D-day 문구의 남음/지남이 맞는지, 1일 앞의 빈 칸 수가 요일에 맞는지, `index.html` 메타도 같이 바뀌었는지.
- 사진을 바꿨다면: 썸네일 격자가 깨지지 않는지, 라이트박스에서 잘리지 않는지, `du -sh src/assets/images` 가 크게 늘지 않았는지.
- 오시는 길을 바꿨다면: 핀이 예식장에 있는지, 길찾기 버튼이 **도약센터**를 목적지로 여는지(예식장으로 "고치면" 안 된다).
- 무엇을 바꿨든: `npm run lint` 오류가 늘지 않았는지, 콘솔에 React key·props 경고가 없는지.
