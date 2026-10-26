# 실행과 배포 절차

## 사전 준비

- Node.js 18 이상 (24.15 에서 확인). npm 은 Node 에 포함된 것을 쓴다.
- git, 그리고 `github.com/dongyeopoh/dongyeop-jihyeon-wedding` 에 푸시할 수 있는 권한. SSH 키 또는 자격 증명 관리자로 로그인하며, 저장소 주소에 토큰을 넣지 않는다.
- 네이버 클라우드 플랫폼 계정의 Maps 애플리케이션 **Key ID**(2025년 이후의 새 인증 방식. 옛 "클라이언트 ID" 는 더 이상 동작하지 않는다). Web 서비스 URL 에 `https://dongyeopoh.github.io`, `http://localhost:5173`(개발 서버), `http://localhost:4173`(배포 전 미리보기)이 등록되어 있어야 한다.

## 처음 설정 (순서대로)

```bash
git clone https://github.com/dongyeopoh/dongyeop-jihyeon-wedding.git
cd dongyeop-jihyeon-wedding
npm ci                                   # package-lock.json 기준 설치. npm install 을 쓰면 lock 이 바뀔 수 있다
printf 'VITE_NAVERMAPS_KEY_ID=<콘솔의 Key ID>\n' > .env   # 없으면 빌드·개발 서버가 시작되지 않는다
npm run dev                              # http://localhost:5173/dongyeop-jihyeon-wedding/ 에서 확인
```

`.env` 가 없으면 `npm run dev` 와 `npm run build` 가 "VITE_NAVERMAPS_KEY_ID 가 .env 에 없습니다" 와 함께 멈춘다. 개발 서버는 같은 Wi-Fi 의 휴대폰에서 `http://<이 컴퓨터의 LAN IP>:5173/dongyeop-jihyeon-wedding/` 로도 열린다. 그 주소는 네이버 콘솔에 등록되어 있지 않으므로 지도 자리에 "지도를 불러오지 못했습니다" 안내가 뜨는 것이 정상이고, 지도 확인은 `localhost` 주소에서 한다.

## 환경 변수

| 이름 | 역할 | 어디서 쓰이나 | 없으면 |
|---|---|---|---|
| `VITE_NAVERMAPS_KEY_ID` | 네이버 지도 스크립트 인증(Key ID) | 빌드 시 `Map.jsx` 가 읽어 스크립트 주소에 포함 | 빌드와 개발 서버가 시작되지 않는다 |

`.env` 파일은 로컬 전용이며 git 에 올리지 않는다.

## 일상 명령

| 명령 | 하는 일 |
|---|---|
| `npm run dev` | 개발 서버 (포트 5173 고정, 바뀌지 않음) |
| `npm run lint` | ESLint 검사. 배포 전 오류 0건이어야 한다 |
| `npm run build` | `dist/` 생성(git 무시 대상). 기존 `dist/` 내용은 덮어써진다 |
| `npm run preview` | 방금 빌드한 `dist/` 를 로컬에서 띄움. 배포 때는 `npm run deploy` 가 대신 띄운다 |
| `npm run deploy` | 린트 → 빌드 → 미리보기 확인 → gh-pages 스냅샷 푸시를 한 번에 (아래) |

## 배포 (순서대로)

소스·문서 변경을 먼저 main 에 커밋하고 푸시한 뒤, main 에서 배포 명령 하나를 실행한다.

```bash
git add src public index.html package.json package-lock.json vite.config.js eslint.config.js scripts docs CLAUDE.md AGENTS.md
git commit -m "<한국어 한 줄 요약>"
git push origin main
npm run deploy
```

`npm run deploy`(`scripts/deploy.sh`)는 아래 순서로 진행하며 어느 단계든 실패하면 즉시 멈추고 아무것도 올리지 않는다.

1. 추적 중인 파일에 커밋되지 않은 변경이 있거나 현재 브랜치가 main 이 아니면 거부한다(추적되지 않은 파일은 무시).
2. `npm run lint` (오류 0건).
3. `npm run build` (`.env` 의 키가 없으면 여기서 실패).
4. 미리보기를 `http://localhost:4173/dongyeop-jihyeon-wedding/` 에 띄우고 LAN 주소도 보여 준 뒤 "휴대폰 너비로 확인했습니까? (y/N)" 를 묻는다. 4173 포트가 이미 사용 중이면 그 사실을 알리고 멈춘다. `y` 가 아니면 미리보기를 끄고 멈춘다.
5. 원격 `gh-pages` 를 가져와 그 최신 커밋을 부모로, `dist/` 내용(`.DS_Store` 제외)만 담은 커밋 "배포 <main 짧은 해시> <날짜>" 를 만든다.
6. 그 커밋을 `gh-pages` 에 보통 푸시한다(강제 아님). 거부되면 메시지를 보여 주고 멈춘다.
7. 운영 주소의 `index.html` 이 방금 번들을 가리키는지 확인하는 `curl` 명령을 출력한다. GitHub Pages 반영은 1~2분 걸린다.

`DRY_RUN=1 npm run deploy` 는 6번 푸시만 건너뛰고 만들어진 커밋 ID 를 `DRY_RUN_COMMIT=` 으로 출력한다(스크립트를 고친 뒤 시험용). 6번이 거부되는 경우는 다른 컴퓨터에서 먼저 배포해 원격 `gh-pages` 가 앞서 있을 때뿐이며, 그냥 `npm run deploy` 를 다시 실행하면 새 부모 위에 다시 만든다.

## 내용만 바꿀 때

문구·혼주·장소·안내문은 `src/data.json` 만 고치고 위 배포 절차(커밋·푸시 → `npm run deploy`)를 그대로 밟는다. 줄바꿈은 JSON 문자열 안에 `\n` 으로 넣으면 화면에서 그대로 줄이 바뀐다. 사진 교체는 `src/assets/images/NN.jpg` 를 바꾸고 `src/layout/Gallery/Images.jsx` 의 가로·세로 값을 실제 크기로 맞춘다.

## 데이터 초기화, 서버 운영

해당 사항 없음. 서버·데이터베이스가 없으며 방명록은 GitHub 이슈가 저장소 역할을 한다. 방명록 글 관리는 GitHub 저장소의 Issues 탭에서 직접 한다.
