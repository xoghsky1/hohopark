# HOMI - Travel Itinerary & Photo Log

![HOMI](https://img.shields.io/badge/version-0.1.0-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178c6.svg)
![Vite](https://img.shields.io/badge/Vite-5.1.4-646cff.svg)

HOMI는 여행 일정을 계획하고 여행 중 사진을 기록할 수 있는 인터랙티브한 웹 애플리케이션입니다. Google Maps API를 활용하여 시각적으로 여행 경로를 확인하고, 일정별로 활동을 관리할 수 있습니다.

## ✨ 주요 기능

### 🗺️ 여행 계획 관리
- **여행 생성**: 목적지, 시작일, 종료일을 설정하여 새로운 여행 계획 생성
- **Google Places 자동완성**: 목적지 검색 시 Google Places API를 활용한 자동완성 기능
- **여행 카운트다운**: 여행 시작까지 남은 일수 표시

### 📅 일정 관리
- **다중 일정 지원**: 여행 기간에 따라 자동으로 일별 일정 생성
- **활동 추가/수정/삭제**: 각 날짜별로 활동을 추가, 수정, 삭제 가능
- **활동 카테고리**: 7가지 활동 유형 지원
  - 🛫 Flight (항공)
  - 🚂 Train (기차)
  - 🚌 Bus (버스)
  - 🍽️ Dining (식사)
  - 🏨 Accommodation (숙박)
  - 👁️ Sightseeing (관광)
  - 📍 Other (기타)

### 🗺️ 지도 통합
- **Google Maps 통합**: `@vis.gl/react-google-maps` 라이브러리 사용
- **마커 표시**: 각 활동의 위치를 지도에 마커로 표시
- **지도에서 활동 추가**: 지도를 클릭하여 직접 활동 추가 가능
- **자동 경계 조정**: 모든 활동이 보이도록 지도 경계 자동 조정

### 📸 사진 관리
- **사진 업로드**: 각 활동에 여러 장의 사진 업로드 가능
- **사진 그리드**: 업로드된 사진을 그리드 형태로 표시
- **Base64 저장**: 사진을 Base64 형식으로 로컬 스토리지에 저장

### 💾 데이터 영속성
- **Zustand Persist**: Zustand의 persist 미들웨어를 사용하여 브라우저 로컬 스토리지에 데이터 저장
- **자동 저장**: 모든 변경사항이 자동으로 저장됨

### 📱 반응형 디자인
- **모바일 최적화**: 모바일, 태블릿, 데스크톱 모든 화면 크기 지원
- **탭 전환**: 모바일에서는 리스트/지도 뷰를 탭으로 전환
- **데스크톱 분할 뷰**: 큰 화면에서는 리스트와 지도를 동시에 표시

## 🛠️ 기술 스택

### Frontend Framework
- **React 18.2.0**: 사용자 인터페이스 구축
- **TypeScript 5.2.2**: 타입 안정성 및 개발자 경험 향상
- **Vite 5.1.4**: 빠른 개발 서버 및 빌드 도구

### 상태 관리
- **Zustand 4.5.2**: 경량 상태 관리 라이브러리
- **Zustand Persist**: 로컬 스토리지 영속성

### UI & 스타일링
- **Tailwind CSS 3.4.1**: 유틸리티 기반 CSS 프레임워크
- **Lucide React 0.344.0**: 아이콘 라이브러리

### 지도 & 위치
- **@vis.gl/react-google-maps 1.7.1**: Google Maps React 컴포넌트
- **@react-google-maps/api 2.20.3**: Google Maps API 통합 (레거시)

### 유틸리티
- **date-fns 3.3.1**: 날짜 처리 라이브러리

### 개발 도구
- **ESLint**: 코드 품질 및 일관성 유지
- **TypeScript ESLint**: TypeScript 린팅
- **PostCSS & Autoprefixer**: CSS 후처리

## 📁 프로젝트 구조

```
여행/
├── src/
│   ├── components/          # React 컴포넌트
│   │   ├── AddActivityModal.tsx      # 활동 추가 모달
│   │   ├── CreateTripModal.tsx       # 여행 생성 모달
│   │   ├── EditActivityModal.tsx     # 활동 수정 모달
│   │   ├── Layout.tsx                # 레이아웃 컴포넌트
│   │   └── Map.tsx                   # 지도 컴포넌트
│   ├── store/               # 상태 관리
│   │   └── useTripStore.ts           # Zustand 스토어
│   ├── types/               # TypeScript 타입 정의
│   │   └── index.ts                  # 공통 타입
│   ├── hooks/               # 커스텀 훅
│   ├── utils/               # 유틸리티 함수
│   ├── App.tsx              # 메인 앱 컴포넌트
│   ├── main.tsx             # 앱 엔트리 포인트
│   └── index.css            # 글로벌 스타일
├── .env                     # 환경 변수 (Google Maps API Key)
├── index.html               # HTML 템플릿
├── package.json             # 프로젝트 의존성
├── tailwind.config.js       # Tailwind CSS 설정
├── tsconfig.json            # TypeScript 설정
├── vite.config.ts           # Vite 설정
└── vercel.json              # Vercel 배포 설정
```

## 🚀 시작하기

### 사전 요구사항
- Node.js (v16 이상)
- npm 또는 yarn
- Google Maps API Key

### 설치

1. **저장소 클론**
   ```bash
   cd /Users/ncsoft/Desktop/Antigravity/여행
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **환경 변수 설정**
   
   `.env` 파일에 Google Maps API Key를 설정합니다:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

   **Google Maps API Key 발급 방법:**
   - [Google Cloud Console](https://console.cloud.google.com/)에 접속
   - 새 프로젝트 생성 또는 기존 프로젝트 선택
   - "APIs & Services" > "Credentials"로 이동
   - "Create Credentials" > "API Key" 선택
   - 다음 API를 활성화:
     - Maps JavaScript API
     - Places API
     - Geocoding API

4. **개발 서버 실행**
   ```bash
   npm run dev
   ```

   브라우저에서 `http://localhost:5173`으로 접속합니다.

### 빌드

프로덕션 빌드를 생성하려면:
```bash
npm run build
```

빌드된 파일은 `dist/` 디렉토리에 생성됩니다.

### 프리뷰

프로덕션 빌드를 로컬에서 미리보기:
```bash
npm run preview
```

## 📖 사용 방법

### 1. 여행 생성
1. "Start Planning Now" 버튼 클릭
2. 여행 제목, 목적지, 시작일, 종료일 입력
3. 목적지는 Google Places 자동완성으로 검색 가능
4. "Create Trip" 버튼으로 여행 생성

### 2. 활동 추가
**방법 1: 모달에서 추가**
1. "Add Activity" 버튼 클릭
2. 시간, 제목, 위치, 활동 유형, 메모 입력
3. 위치는 Google Places 자동완성으로 검색
4. "Add Activity" 버튼으로 저장

**방법 2: 지도에서 추가**
1. 지도 뷰로 전환
2. 원하는 위치를 클릭
3. 팝업에서 활동 정보 입력
4. "Add" 버튼으로 저장

### 3. 활동 수정/삭제
- **수정**: 활동 카드의 연필 아이콘 클릭
- **삭제**: 활동 카드의 휴지통 아이콘 클릭

### 4. 사진 업로드
1. 활동 카드의 "Upload" 버튼 클릭
2. 이미지 파일 선택 (다중 선택 가능)
3. 선택한 사진이 활동 카드에 그리드로 표시됨

### 5. 일정 전환
- 상단의 "Day 1", "Day 2" 등의 버튼으로 일정 전환
- 각 날짜별로 독립적인 활동 목록 관리

## 🎨 디자인 특징

### 색상 팔레트
- **Primary**: 파란색 계열 (`primary-50` ~ `primary-900`)
- **Neutral**: 슬레이트 그레이 (`slate-50` ~ `slate-900`)
- **Accent**: 활동 유형별 색상 구분

### UI/UX 특징
- **모던한 디자인**: 둥근 모서리, 그림자 효과, 부드러운 전환
- **직관적인 인터페이스**: 명확한 아이콘과 레이블
- **반응형 레이아웃**: 모든 디바이스에서 최적화된 경험
- **애니메이션**: 부드러운 호버 효과 및 전환 애니메이션

## 🔧 주요 컴포넌트 설명

### App.tsx
메인 애플리케이션 컴포넌트로, 전체 앱의 레이아웃과 로직을 관리합니다.

**주요 기능:**
- 여행 및 활동 상태 관리
- 모달 제어
- 파일 업로드 처리
- 일정 전환 로직

### useTripStore.ts
Zustand를 사용한 전역 상태 관리 스토어입니다.

**상태:**
- `trips`: 모든 여행 목록
- `activeTripId`: 현재 활성화된 여행 ID

**액션:**
- `addTrip`: 새 여행 추가
- `setActiveTrip`: 활성 여행 설정
- `addActivity`: 활동 추가
- `updateActivity`: 활동 수정
- `deleteActivity`: 활동 삭제
- `addPhotoToItem`: 사진 추가

### Map.tsx
Google Maps를 통합한 지도 컴포넌트입니다.

**기능:**
- 활동 위치를 마커로 표시
- 마커 클릭 시 정보 표시
- 지도 클릭으로 새 활동 추가
- 자동 경계 조정 (fitBounds)

### CreateTripModal.tsx
새 여행을 생성하는 모달 컴포넌트입니다.

**기능:**
- Google Places 자동완성
- 날짜 선택
- 여행 기간에 따른 일정 자동 생성

### AddActivityModal.tsx & EditActivityModal.tsx
활동을 추가/수정하는 모달 컴포넌트입니다.

**기능:**
- Google Places 자동완성
- 활동 유형 선택
- 시간 및 메모 입력

## 🔐 환경 변수

| 변수명 | 설명 | 필수 여부 |
|--------|------|-----------|
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps API Key | ✅ 필수 |

## 📦 배포

### Vercel 배포
프로젝트에 `vercel.json` 파일이 포함되어 있어 Vercel에 쉽게 배포할 수 있습니다.

1. Vercel 계정 생성 및 로그인
2. 프로젝트 import
3. 환경 변수 설정 (`VITE_GOOGLE_MAPS_API_KEY`)
4. 배포

## 🐛 알려진 이슈 및 제한사항

- 사진이 Base64로 저장되어 로컬 스토리지 용량 제한이 있을 수 있습니다
- 오프라인 모드는 지원하지 않습니다 (Google Maps API 필요)
- 다중 사용자 협업 기능은 없습니다

## 🔮 향후 계획

- [ ] 클라우드 스토리지 통합 (Firebase, Supabase 등)
- [ ] 사용자 인증 및 계정 관리
- [ ] 여행 공유 기능
- [ ] 경로 최적화 기능
- [ ] 예산 관리 기능
- [ ] 오프라인 지원
- [ ] PWA (Progressive Web App) 지원
- [ ] 다국어 지원

## 📄 라이선스

이 프로젝트는 개인 프로젝트입니다.

## 👥 기여

현재 개인 프로젝트로 운영되고 있습니다.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 등록해주세요.

---

**Made with ❤️ using React, TypeScript, and Google Maps**
