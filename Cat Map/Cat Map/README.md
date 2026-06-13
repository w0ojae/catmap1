# Cat Map

`냥이지도4.html`을 기능별 파일로 분리한 정리본입니다.

## 구조

- `index.html`: 화면 마크업과 외부 라이브러리 로드
- `css/styles.css`: 전체 스타일
- `js/data.js`: 고양이/히트맵 기본 데이터
- `js/state.js`: 지도와 화면 상태
- `js/maps.js`: Leaflet 지도와 히트맵
- `js/journal.js`: 관찰일지와 팔로우 UI
- `js/upload.js`: 사진 업로드, 위치, 등록 모달
- `js/photo-gallery.js`: 사진 광장, 라이트박스, 하트
- `js/badges.js`: 뱃지 필터
- `js/profile.js`: 프로필 화면 렌더링
- `js/app.js`: 화면 전환, 애니메이션, 초기 실행

## 실행

`index.html`을 브라우저에서 열면 됩니다. 지도와 샘플 사진은 외부 CDN/API를 사용하므로 인터넷 연결이 필요합니다.