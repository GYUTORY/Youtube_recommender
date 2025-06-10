# 🎵 추억 음악 소환기 (Nostalgia Music Recommender)

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20.x-green" alt="Node.js Version" />
  <img src="https://img.shields.io/badge/NestJS-10.x-red" alt="NestJS Version" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue" alt="TypeScript Version" />
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="License" />
</p>

## 📝 프로젝트 소개

YouTube Data API v3를 활용하여 특정 연도대의 인기 음악을 추천하는 CLI 애플리케이션입니다. 
메모리 기반으로 동작하며, 별도의 데이터베이스 없이 구현되어 있습니다.

### ✨ 주요 기능

- 연도대별 인기 음악 추천
- YouTube Data API v3 연동
- CLI 기반 인터랙티브 인터페이스
- 메모리 기반 동작 (DB 불필요)

## 🚀 시작하기

### 필수 조건

- Node.js 20.x 이상
- npm 또는 yarn
- YouTube Data API v3 키

### 설치

```bash
# 저장소 클론
git clone https://github.com/yourusername/nostalgia-music-recommender.git
cd nostalgia-music-recommender

# 의존성 설치
npm install

# 환경 변수 설정
cp config/dev/.env.ytb.example config/dev/.env.ytb
cp config/rel/.env.ytb.example config/rel/.env.ytb
```

### 환경 변수 설정

`config/dev/.env.ytb` 또는 `config/rel/.env.ytb` 파일에 다음 내용을 설정합니다:

```env
# YouTube API 설정
YOUTUBE_API_KEY=your_api_key_here

# 검색 설정
YOUTUBE_SEARCH_QUERY_TEMPLATE="{year}년대 인기곡"
YOUTUBE_API_BASE_URL=https://www.googleapis.com/youtube/v3
YOUTUBE_API_MAX_RESULTS=50
```

## 💻 사용 방법

### 개발 모드 실행

```bash
npm run start:dev
```

### 추천 명령어 실행

```bash
# 기본 실행
nest recommend --year 2000

# 인터랙티브 모드
nest recommend --interactive
```

### 출력 예시

```
🎵 2000년대 추억의 음악 🎵

제목: [노래 제목]
아티스트: [아티스트명]
발매년도: 2005
URL: https://youtube.com/watch?v=xxxxxxx

실행 시간: 2024-03-21 15:30:45
```

## 🧪 테스트

```bash
# 단위 테스트
npm run test

# e2e 테스트
npm run test:e2e

# 테스트 커버리지
npm run test:cov
```

## 🐳 Docker 실행

```bash
# 이미지 빌드
docker build -t nostalgia-music-recommender .

# 컨테이너 실행
docker run -it --env-file config/dev/.env.ytb nostalgia-music-recommender
```

## 📦 프로젝트 구조

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

## 🔧 기술 스택

- **핵심 기술**
  - Node.js 20 LTS
  - NestJS 10.x
  - TypeScript 5.x
  - YouTube Data API v3

- **주요 패키지**
  - @nestjs/cli: NestJS CLI 도구
  - @nestjs/config: 환경 변수 관리
  - axios: HTTP 클라이언트
  - commander: CLI 커맨드 구현
  - inquirer: CLI 인터랙티브 프롬프트
  - dotenv: 환경 변수 로딩
  - class-validator: DTO 유효성 검증
  - class-transformer: 객체 변환

## 🔄 NestJS 프로젝트 동작 방식

### 1. 애플리케이션 구조

```
src/
  ├── app.module.ts                 # 루트 모듈
  ├── youtube/                      # YouTube 기능 모듈
  │     ├── dto/                    # 데이터 전송 객체
  │     ├── youtube.service.ts      # 비즈니스 로직
  │     └── youtube.module.ts       # 모듈 정의
  ├── cli/                          # CLI 기능 모듈
  │     ├── commands/               # CLI 명령어
  │     └── cli.module.ts          # CLI 모듈 정의
  └── config/                       # 설정 관리
```

### 2. 모듈 구조 및 의존성 주입

- **AppModule**: 애플리케이션의 루트 모듈
  - YouTubeModule과 CLIModule을 imports하여 통합
  - ConfigModule을 통해 환경 변수 관리

- **YouTubeModule**: YouTube API 연동 담당
  - YouTubeService를 providers로 등록
  - DTO를 통해 데이터 검증 및 변환

- **CLIModule**: 커맨드 라인 인터페이스 담당
  - RecommendCommand를 providers로 등록
  - Commander와 Inquirer를 통한 CLI 구현

### 3. 실행 흐름

1. **초기화 단계**
   ```typescript
   // main.ts
   async function bootstrap() {
     const app = await NestFactory.create(AppModule);
     await app.listen(3000);
   }
   ```

2. **CLI 명령어 처리**
   ```typescript
   // recommend.command.ts
   @Command({ command: 'recommend' })
   async recommend() {
     // 1. 사용자 입력 처리
     // 2. YouTubeService 호출
     // 3. 결과 포맷팅 및 출력
   }
   ```

3. **YouTube API 연동**
   ```typescript
   // youtube.service.ts
   @Injectable()
   export class YouTubeService {
     // 1. API 키 검증
     // 2. 검색 쿼리 생성
     // 3. API 호출 및 결과 처리
   }
   ```

### 4. 주요 기능 구현 방식

#### 4.1. 환경 변수 관리
```typescript
// configuration.ts
export default () => ({
  youtube: {
    apiKey: process.env.YOUTUBE_API_KEY,
    searchQueryTemplate: process.env.YOUTUBE_SEARCH_QUERY_TEMPLATE,
    // ...
  }
});
```

#### 4.2. YouTube API 연동
```typescript
// youtube.service.ts
@Injectable()
export class YouTubeService {
  async searchByYear(year: number) {
    // 1. 검색 쿼리 생성
    const query = this.createSearchQuery(year);
    
    // 2. API 호출
    const response = await this.httpService.get(/* ... */);
    
    // 3. 결과 변환 및 반환
    return this.transformResponse(response);
  }
}
```

#### 4.3. CLI 인터페이스
```typescript
// recommend.command.ts
@Command({ command: 'recommend' })
export class RecommendCommand {
  async run() {
    // 1. 인터랙티브 모드 확인
    if (this.options.interactive) {
      return this.runInteractive();
    }
    
    // 2. 연도 기반 추천
    return this.recommendByYear(this.options.year);
  }
}
```

### 5. 에러 처리

- **전역 예외 필터**
  ```typescript
  @Catch()
  export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
      // 1. 에러 로깅
      // 2. 사용자 친화적 메시지 생성
      // 3. 적절한 HTTP 상태 코드 반환
    }
  }
  ```

- **비즈니스 로직 예외**
  ```typescript
  export class YouTubeAPIException extends Error {
    constructor(message: string) {
      super(message);
    }
  }
  ```

### 6. 테스트 구조

- **단위 테스트**: 각 서비스의 독립적인 테스트
  ```typescript
  describe('YouTubeService', () => {
    it('should search videos by year', async () => {
      // 테스트 코드
    });
  });
  ```

- **E2E 테스트**: 전체 기능 흐름 테스트
  ```typescript
  describe('Recommend Command', () => {
    it('should recommend music for given year', async () => {
      // E2E 테스트 코드
    });
  });
  ```

## 👥 작성자
- **Your Name** - *Initial work* - [YourGitHub](https://github.com/GYUTORY)
