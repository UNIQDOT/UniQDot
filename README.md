# (주)유니크닷 (UniQDot) 공식 홈페이지

https://www.uniqdot.co.kr — GitHub Pages로 호스팅되는 정적 사이트 (HTML/CSS/JS, 빌드 과정 없음)

## 구조
- `index.html` 메인 / `page/*.html` 하위 페이지
- `common/header.html`, `common/footer.html` 모든 페이지 공통 헤더/푸터 (`js/common.js`가 삽입)
- `css/site.css` 공통 색상·헤더·푸터, `css/home.css` 메인, 나머지는 페이지별 CSS
- `lang/ko.json`, `lang/en.json` 모든 문구(한/영). HTML의 `data-i18n="키"`와 연결됨
- `img/` 이미지, `sitemap.xml`, `robots.txt`, `404.html`

## 문구 수정
`lang/ko.json`과 `lang/en.json`의 같은 키를 **함께** 수정하세요. 한쪽만 고치면 언어 전환 시 내용이 달라집니다.

## 디자인 수정
`css/site.css` 맨 위 `:root`의 색상 변수(`--brand`, `--navy` 등)를 바꾸면 전체 색이 바뀝니다.

## 로컬 미리보기
헤더/푸터를 fetch로 불러오므로 파일을 더블클릭하면 동작하지 않습니다.
```
python -m http.server 8000   # 후 http://localhost:8000
```

## 배포
`main` 브랜치에 push하면 GitHub Pages가 자동 배포합니다. 도메인은 `CNAME` 파일이 지정합니다.
