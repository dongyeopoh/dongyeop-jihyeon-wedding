<div align="center">

<img src="public/thumbnail.jpg" alt="오동엽 · 이지현 웨딩 사진" width="720" />

# 💍 오동엽 · 이지현, 결혼합니다

**2024년 가을, 두 사람의 결혼식을 알리던 모바일 청첩장입니다.**<br />
결혼식은 무사히 끝났고, 지금은 그날을 기억하기 위한 기록으로 남겨 두고 있습니다.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![MUI](https://img.shields.io/badge/MUI-6-007FFF?logo=mui&logoColor=white)](https://mui.com/)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-%EB%B0%B0%ED%8F%AC-222222?logo=githubpages&logoColor=white)](https://dongyeopoh.github.io/dongyeop-jihyeon-wedding/)
![상태](https://img.shields.io/badge/%EC%83%81%ED%83%9C-%EA%B8%B0%EB%A1%9D%EC%9A%A9%20%EB%B3%B4%EC%A1%B4-B8860B)

### [💌 청첩장 바로가기](https://dongyeopoh.github.io/dongyeop-jihyeon-wedding/)

</div>

---

## 📅 결혼식 안내

| | |
|---|---|
| 🤵🏻 **신랑** | 오동엽 |
| 👰🏻‍♀️ **신부** | 이지현 |
| 🗓️ **일시** | 2024년 11월 2일 (토) 낮 12시 |
| 📍 **장소** | 무주 태권도원 명인관 |

## 💌 모시는 글

> 2023년 8월, 여름의 끝자락.<br />
> 계룡산 자락에서 우연히 마주한 두 사람이 있었습니다.<br />
> 그날의 작은 만남이 인연이 되어,<br />
> 이제 서로의 손을 잡고 새로운 길을 걷고자 합니다.<br />
> 저희의 앞날을 따뜻하게 축복해 주시면 감사하겠습니다.
>
> — 오동엽 • 이지현 올림

## 📱 화면 구성

청첩장은 휴대폰 화면에 맞춘 한 페이지이며, 아래 순서대로 세로로 이어집니다.

| 순서 | 화면 | 내용 |
|:---:|---|---|
| 1 | 🖼️ 메인 | 대표 사진 위에 인사말이 떠 있다가 스크롤하면 서서히 사라집니다 |
| 2 | ✉️ 모시는 글 | 인사말, 양가 혼주, 일시·장소, 구글 캘린더 일정 추가 버튼, 달력과 D-day 카운터 |
| 3 | 📷 갤러리 | 사진 26장. "사진 더보기"로 펼치고, 누르면 크게 넘겨 볼 수 있습니다 |
| 4 | 🗺️ 오시는 길 | 네이버 지도, 네이버·카카오 길찾기 버튼, 약도, 주차·셔틀버스 안내 |
| 5 | 📝 방명록 | GitHub 계정으로 축하 글을 남기는 공간 |
| 6 | ⬆️ 하단 고정 바 | 맨 위로 이동, 주소 복사 |
| 7 | 🌿 푸터 | 마무리 문구 |

## 🛠️ 기술 스택

| 구분 | 사용한 것 |
|---|---|
| 화면 | React 18, MUI 6, Emotion |
| 빌드 | Vite 5 |
| 날짜 계산 | date-fns |
| 사진 보기 | PhotoSwipe (react-photoswipe-gallery) |
| 지도 | 네이버 지도 (Web Dynamic Map) |
| 방명록 | utterances (GitHub 이슈에 저장) |
| 호스팅 | GitHub Pages |

서버와 데이터베이스 없이 정적 파일만으로 동작합니다.

## 🚀 개발

```bash
npm ci                                            # 의존성 설치
echo "VITE_NAVERMAPS_KEY_ID=<네이버 지도 Key ID>" > .env   # 지도 키 (없으면 실행되지 않습니다)
npm run dev                                       # 개발 서버
npm run deploy                                    # 검사 → 빌드 → 미리보기 확인 → 배포
```

설치부터 배포까지의 자세한 절차는 [실행과 배포 절차](docs/operations.md)에 정리되어 있습니다.

## 📚 문서

| 문서 | 내용 |
|---|---|
| [architecture.md](docs/architecture.md) | 화면 구성, 데이터 흐름, 빌드·배포 경로, 외부 서비스 |
| [business-rules.md](docs/business-rules.md) | 섹션별 표시 규칙 (D-day, 혼주 표기, 길찾기 목적지 등) |
| [security.md](docs/security.md) | 보호 대상, 키 관리, 개인정보 정책 |
| [standards.md](docs/standards.md) | 저장소·배포·코드 배치 규칙 |
| [engineering-notes.md](docs/engineering-notes.md) | 알아 두어야 할 함정 모음 |
| [operations.md](docs/operations.md) | 설치·개발·빌드·배포 명령 |
| [contracts.md](docs/contracts.md) | 공개 주소, 링크 미리보기, 방명록 형식 |
| [status.md](docs/tracking/status.md) | 현재 상태와 남은 일 |

## 🕊️ 보존 모드

결혼식이 끝난 뒤로 이 저장소는 기록용으로 보존하고 있습니다. 새 기능은 더하지 않고, 문구·사진 수정과 작은 버그 수정만 합니다.

---

<div align="center">

<sub>개인 기록용 저장소이며, 사진과 문구는 재사용할 수 없습니다.</sub>

</div>
