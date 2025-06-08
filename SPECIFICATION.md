# 🎵 추억 음악 소환기 (NestJS, Node 20)

## 1. 프로젝트 개요
- YouTube Data API v3를 활용하여 특정 연도대의 인기 음악을 추천하는 CLI 애플리케이션
- NestJS CLI 기반으로 구현하여 커맨드 라인에서 실행 가능
- 메모리 기반으로 동작하며, 별도의 데이터베이스 없이 구현
- 향수를 자극하는 음악 큐레이션 기능 제공

## 2. 기술 스택 상세 명세

### 2.1. 핵심 기술
- Node.js 20 LTS
- NestJS 10.x
- TypeScript 5.x
- YouTube Data API v3

### 2.2. 주요 패키지
- @nestjs/cli: NestJS CLI 도구
- @nestjs/config: 환경 변수 관리
- axios: HTTP 클라이언트
- commander: CLI 커맨드 구현
- inquirer: CLI 인터랙티브 프롬프트
- dotenv: 환경 변수 로딩
- class-validator: DTO 유효성 검증
- class-transformer: 객체 변환

## 3. 상세 기능 명세

### 3.1. YouTube API 연동
- [필수] YouTube Data API v3를 통한 연도별 인기 음악 검색
  - `search.list` 엔드포인트 사용
  - 연도 기반 검색 쿼리 생성
  - 필요한 필드: snippet.title, snippet.channelTitle, id.videoId
- [필수] API 키는 .env 파일에서 관리
- [필수] 검색 키워드 템플릿은 .env 파일에서 설정 가능

### 3.2. 연도별 음악 추천 로직
- [필수] 입력된 연도대에 해당하는 인기 음악 검색
- [필수] 검색 결과에서 랜덤으로 곡 선택
- [필수] 선택된 곡의 메타데이터 추출
  - 제목 (snippet.title)
  - 채널명 (snippet.channelTitle)
  - 영상 URL (https://youtube.com/watch?v={videoId})
  - 발매 연도 정보

### 3.3. CLI 인터페이스
- [필수] NestJS CLI 커맨드 구현
  - `nest recommend` 명령어로 실행
  - 추천 결과를 콘솔에 포맷팅하여 출력
- [선택] 인터랙티브 모드 지원
  - inquirer를 사용한 대화형 인터페이스
  - 연도대 선택 옵션 (90년대, 2000년대 등)
  - 재추천 기능

### 3.4. 에러 처리
- [필수] YouTube API 호출 실패 시 적절한 에러 메시지 출력
- [필수] 검색 결과 없음 처리
- [필수] API 할당량 초과 시 에러 처리
- [필수] 환경 변수 누락 시 안내 메시지

## 4. 코드 구조

```
src/
  ├── app.module.ts                 # 루트 모듈
  ├── youtube/
  │     ├── dto/
  │     │     ├── search.dto.ts     # 검색 응답 DTO
  │     │     └── video.dto.ts      # 비디오 정보 DTO
  │     ├── youtube.service.ts      # YouTube API 연동 서비스
  │     └── youtube.module.ts       # YouTube 모듈
  ├── cli/
  │     ├── commands/
  │     │     └── recommend.command.ts  # 추천 커맨드
  │     └── cli.module.ts          # CLI 모듈
  └── config/
        └── configuration.ts        # 설정 관리
```

## 5. 환경 변수 설정

```env
# YouTube API 설정
YOUTUBE_API_KEY=your_api_key_here

# 검색 설정
YOUTUBE_SEARCH_QUERY_TEMPLATE="{year}년대 인기곡"
YOUTUBE_API_BASE_URL=https://www.googleapis.com/youtube/v3
YOUTUBE_API_MAX_RESULTS=50
```

## 6. 실행 방법

1. 프로젝트 설정
```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일에 API 키 입력
```

2. 개발 모드 실행
```bash
npm run start:dev
```

3. 추천 명령어 실행
```bash
# 기본 실행
nest recommend --year 2000

# 인터랙티브 모드
nest recommend --interactive
```

## 7. 출력 예시

```
🎵 2000년대 추억의 음악 🎵

제목: [노래 제목]
아티스트: [아티스트명]
발매년도: 2005
URL: https://youtube.com/watch?v=xxxxxxx

실행 시간: 2024-03-21 15:30:45
```

## 8. 향후 확장 계획
- [ ] 장르별 필터링 기능
- [ ] 아티스트별 추천 기능
- [ ] 플레이리스트 생성 기능
- [ ] 음악 차트 연동
- [ ] 사용자 히스토리 관리 