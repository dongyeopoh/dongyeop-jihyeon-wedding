import { useEffect, useRef } from "react";

export default function Comment() {
  const commentsEl = useRef(null);

  useEffect(() => {
    // 이미 스크립트가 추가되어 있는지 확인
    const existingScript = commentsEl.current.querySelector("script[src='https://utteranc.es/client.js']");
    if (existingScript) return;  // 스크립트가 있으면 추가하지 않음

    const scriptEl = document.createElement("script");
    scriptEl.async = true;
    scriptEl.src = "https://utteranc.es/client.js";
    scriptEl.setAttribute("repo", "dongyeopoh/dongyeop-jihyeon-wedding");
    scriptEl.setAttribute("issue-term", "pathname");
    scriptEl.setAttribute("theme", "github-light");
    scriptEl.setAttribute("crossorigin", "anonymous");
    commentsEl.current.appendChild(scriptEl);  // 스크립트 삽입
  }, []);

  return (
    <div>
      <div ref={commentsEl} />
    </div>
  );
}
