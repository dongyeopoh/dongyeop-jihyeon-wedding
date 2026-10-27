#!/usr/bin/env bash
# 스냅샷 배포: dist/ 내용만 담은 커밋을 gh-pages 위에 하나 쌓아 올린다.
# 사용: npm run deploy            (실제 푸시)
#       DRY_RUN=1 npm run deploy  (푸시 생략, 만들어진 커밋 ID 만 출력)
set -euo pipefail

cd "$(cd "$(dirname "$0")/.." && pwd)"

SITE_URL="https://dongyeopoh.github.io/dongyeop-jihyeon-wedding/"
PREVIEW_PORT=4173
PREVIEW_URL="http://localhost:${PREVIEW_PORT}/dongyeop-jihyeon-wedding/"
DRY_RUN="${DRY_RUN:-}"

PREVIEW_PID=""
PREVIEW_LOG=""
TMP_INDEX=""

fail() {
  echo "중단: $*" >&2
  exit 1
}

stop_preview() {
  if [ -n "$PREVIEW_PID" ] && kill -0 "$PREVIEW_PID" 2>/dev/null; then
    kill "$PREVIEW_PID" 2>/dev/null || true
    wait "$PREVIEW_PID" 2>/dev/null || true
  fi
  PREVIEW_PID=""
}

cleanup() {
  stop_preview
  [ -n "$PREVIEW_LOG" ] && rm -f "$PREVIEW_LOG"
  [ -n "$TMP_INDEX" ] && rm -f "$TMP_INDEX"
  return 0
}
trap cleanup EXIT
trap 'exit 130' INT TERM

# 1. 거부 조건 -----------------------------------------------------------
check_clean_tree() {
  if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
    git status --short --untracked-files=no >&2
    fail "커밋하지 않은 변경이 있습니다"
  fi
}

check_branch() {
  local branch
  branch="$(git branch --show-current)"
  if [ "$branch" != "main" ]; then
    fail "현재 브랜치가 main 이 아닙니다 (${branch:-분리된 HEAD})"
  fi
}

check_clean_tree
check_branch

# 2. 린트 ---------------------------------------------------------------
echo "==> 린트"
npm run lint </dev/null

# 3. 빌드 ---------------------------------------------------------------
echo "==> 빌드"
npm run build </dev/null
[ -f dist/index.html ] || fail "dist/index.html 이 없습니다"

# 4. 미리보기 + 눈 확인 --------------------------------------------------
echo "==> 미리보기"
if [ -n "$(lsof -nP -iTCP:"$PREVIEW_PORT" -sTCP:LISTEN -t 2>/dev/null || true)" ]; then
  fail "포트 ${PREVIEW_PORT} 이 이미 사용 중입니다. 해당 프로세스를 끄고 다시 실행하세요"
fi

PREVIEW_LOG="$(mktemp)"
./node_modules/.bin/vite preview --host --port "$PREVIEW_PORT" --strictPort \
  </dev/null >"$PREVIEW_LOG" 2>&1 &
PREVIEW_PID=$!

ready=""
for _ in $(seq 1 30); do
  if ! kill -0 "$PREVIEW_PID" 2>/dev/null; then
    break
  fi
  code="$(curl -s -o /dev/null -w '%{http_code}' "$PREVIEW_URL" || true)"
  if [ "$code" = "200" ]; then
    ready=1
    break
  fi
  sleep 0.5
done
if [ -z "$ready" ]; then
  cat "$PREVIEW_LOG" >&2
  fail "미리보기 서버가 ${PREVIEW_PORT} 포트에서 뜨지 않았습니다"
fi

LAN_IP="$(ipconfig getifaddr en0 2>/dev/null || true)"
echo
echo "  로컬 주소: ${PREVIEW_URL}"
if [ -n "$LAN_IP" ]; then
  echo "  LAN 주소:  http://${LAN_IP}:${PREVIEW_PORT}/dongyeop-jihyeon-wedding/"
else
  echo "  LAN 주소:  (en0 주소를 찾지 못했습니다)"
fi
echo "  안내: LAN 주소나 다른 포트에서는 지도가 뜨지 않을 수 있습니다(네이버 콘솔 미등록). 지도 확인은 http://localhost:${PREVIEW_PORT} 에서 하세요."
echo

printf '휴대폰 너비로 확인했습니까? (y/N) '
answer=""
read -r answer || true
stop_preview
# 앞뒤 공백을 지우고 y / Y / yes 만 승인으로 본다
answer="$(printf '%s' "$answer" | tr -d '[:space:]' | tr '[:upper:]' '[:lower:]')"
case "$answer" in
  y|yes) ;;
  *) fail "눈 확인이 되지 않아 배포하지 않습니다 (입력: '${answer}')" ;;
esac

# 5. 스냅샷 커밋 ---------------------------------------------------------
echo "==> gh-pages 가져오기"
git fetch origin gh-pages
PARENT="$(git rev-parse --verify refs/remotes/origin/gh-pages)"

echo "==> 스냅샷 트리 만들기"
find dist -name .DS_Store -type f -delete
TMP_INDEX="$(mktemp)"
rm -f "$TMP_INDEX"
TREE="$(
  export GIT_INDEX_FILE="$TMP_INDEX"
  git add -f dist
  git ls-files -z dist | grep -z '\.DS_Store$' | xargs -0 git update-index --force-remove -- 2>/dev/null || true
  git write-tree --prefix=dist/
)"

MAIN_SHORT="$(git rev-parse --short HEAD)"
TODAY="$(date +%Y-%m-%d)"
MESSAGE="배포 ${MAIN_SHORT} ${TODAY}"
COMMIT="$(git commit-tree "$TREE" -p "$PARENT" -m "$MESSAGE")"
echo "  커밋: ${COMMIT}"
echo "  메시지: ${MESSAGE}"
echo "  부모: ${PARENT}"

# 6. 푸시 ---------------------------------------------------------------
if [ -n "$DRY_RUN" ]; then
  echo "==> DRY_RUN: 푸시를 건너뜁니다"
  echo "DRY_RUN_COMMIT=${COMMIT}"
else
  echo "==> gh-pages 로 푸시"
  if ! git push origin "${COMMIT}:refs/heads/gh-pages"; then
    fail "푸시가 거부되었습니다. 다른 곳에서 gh-pages 가 바뀌었는지 확인한 뒤 다시 실행하세요"
  fi
fi

# 7. 반영 확인 명령 안내 --------------------------------------------------
BUNDLE="$(cd dist/assets && ls index-*.js 2>/dev/null | head -n 1 || true)"
echo
echo "==> 완료. GitHub Pages 반영에 1~2분이 걸립니다. 아래 명령으로 확인하세요:"
if [ -n "$BUNDLE" ]; then
  echo "  curl -s ${SITE_URL}index.html | grep -F 'assets/${BUNDLE}' && echo 반영됨 || echo 아직"
else
  echo "  curl -s ${SITE_URL}index.html"
fi
