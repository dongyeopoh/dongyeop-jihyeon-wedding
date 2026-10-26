# 실행과 배포 절차

## 사전 준비

- Node.js 18 이상 (24.15 에서 확인). npm 은 Node 에 포함된 것을 쓴다.
- git, 그리고 `github.com/dongyeopoh/dongyeop-jihyeon-wedding` 에 푸시할 수 있는 권한. SSH 키 또는 자격 증명 관리자로 로그인하며, 저장소 주소에 토큰을 넣지 않는다.
- 네이버 클라우드 플랫폼 계정에서 Maps(Web Dynamic Map) 애플리케이션의 클라이언트 ID. Web 서비스 URL 에 `https://dongyeopoh.github.io` 와 `http://localhost:5173` 이 등록되어 있어야 한다.

## 처음 설정 (순서대로)

```bash
git clone https://github.com/dongyeopoh/dongyeop-jihyeon-wedding.git
cd dongyeop-jihyeon-wedding
npm ci                                   # package-lock.json 기준 설치. npm install 을 쓰면 lock 이 바뀔 수 있다
printf 'VITE_APP_NAVERMAPS_CLIENT_ID=<콘솔의 클라이언트 ID>\n' > .env   # 빌드 전에 반드시 있어야 한다
npm run dev                              # http://localhost:5173/dongyeop-jihyeon-wedding/ 에서 확인
```

`.env` 를 만들기 전에 빌드하면 지도 키가 `undefined` 로 번들에 들어가므로 순서를 바꾸면 안 된다. 개발 서버는 같은 Wi-Fi 의 휴대폰에서 `http://<이 컴퓨터의 LAN IP>:5173/dongyeop-jihyeon-wedding/` 로도 열린다(단, 그 주소는 네이버 콘솔에 등록되어 있지 않으면 지도만 빈 칸이다).

## 환경 변수

| 이름 | 역할 | 어디서 쓰이나 | 없으면 |
|---|---|---|---|
| `VITE_APP_NAVERMAPS_CLIENT_ID` | 네이버 지도 SDK 인증 | 빌드 시 `App.jsx` 가 읽어 번들에 포함 | 빌드는 성공하지만 배포된 지도가 빈 칸 |

`.env` 파일은 로컬 전용이며 git 에 올리지 않는다.

## 일상 명령

| 명령 | 하는 일 |
|---|---|
| `npm run dev` | 개발 서버 (포트 5173 고정, 바뀌지 않음) |
| `npm run lint` | ESLint 검사. 배포 전 오류 0건이어야 한다 |
| `npm run build` | `dist/` 생성. 기존 `dist/` 내용은 덮어써진다 |
| `npm run preview` | 방금 빌드한 `dist/` 를 로컬에서 띄워 배포 전 눈으로 확인 |

## 배포 (순서대로)

```bash
npm run lint                                     # 1. 오류 0건
npm run build                                    # 2. dist/ 갱신
npm run preview                                  # 3. 휴대폰 너비로 눈으로 확인 후 Ctrl+C
git add dist                                     # 4. 새 해시의 번들 파일이 함께 잡혀야 한다
git add src public index.html package.json package-lock.json vite.config.js eslint.config.js .gitignore docs CLAUDE.md AGENTS.md   # 바뀐 소스·문서
git status --short dist | grep '^??'             # 5. 비어 있어야 한다 (빠진 파일이 있으면 index.html 이 없는 번들을 가리킨다)
git commit -m "<한국어 한 줄 요약>"
git push origin main                             # 6. 소스 + dist 를 main 에
git subtree push --prefix dist origin gh-pages   # 7. dist 만 gh-pages 로 → GitHub Pages 가 1~2분 안에 반영
```

7번이 `non-fast-forward` 로 거부되면 `git push origin "$(git subtree split --prefix dist main)":gh-pages --force` 로 덮어쓴다. 배포 확인: `curl -s https://dongyeopoh.github.io/dongyeop-jihyeon-wedding/ | grep -o 'index-[^"]*\.js'` 가 방금 빌드된 파일 이름과 같아야 한다.

## 내용만 바꿀 때

문구·혼주·장소·안내문은 `src/data.json` 만 고치고 위 배포 절차를 그대로 밟는다. 줄바꿈은 JSON 문자열 안에 `\n` 으로 넣으면 화면에서 그대로 줄이 바뀐다. 사진 교체는 `src/assets/images/NN.jpg` 를 바꾸고 `src/layout/Gallery/Images.jsx` 의 가로·세로 값을 실제 크기로 맞춘다.

## 데이터 초기화, 서버 운영

해당 사항 없음. 서버·데이터베이스가 없으며 방명록은 GitHub 이슈가 저장소 역할을 한다. 방명록 글 관리는 GitHub 저장소의 Issues 탭에서 직접 한다.
