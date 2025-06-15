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

### 테스트 환경 구성

프로젝트는 Jest를 기반으로 한 테스트 환경을 제공합니다. 단위 테스트와 E2E 테스트를 모두 지원하며, 테스트 커버리지 리포트도 생성할 수 있습니다.

### 테스트 실행 방법

```bash
# 일반 테스트 실행
npm test

# 감시 모드로 테스트 실행 (파일 변경 시 자동 재실행)
npm run test:watch

# 커버리지 리포트 생성
npm run test:cov

# E2E 테스트 실행
npm run test:e2e

# 디버그 모드로 테스트 실행
npm run test:debug
```

### 테스트 커버리지

프로젝트는 최소 80%의 테스트 커버리지를 요구합니다. 커버리지 리포트는 다음 항목을 포함합니다:

- 브랜치 커버리지
- 함수 커버리지
- 라인 커버리지
- 구문 커버리지

커버리지 리포트는 다음 형식으로 생성됩니다:
- HTML 리포트: `coverage/index.html`
- LCOV 리포트: `coverage/lcov.info`
- 텍스트 리포트: 콘솔 출력

### E2E 테스트

E2E 테스트는 실제 CLI 명령어 실행을 시뮬레이션하여 전체 기능을 테스트합니다. 주요 테스트 케이스:

1. **정상적인 음악 추천**
   ```typescript
   it('should recommend music for a specific year', async () => {
     // 테스트 코드
   });
   ```

2. **에러 처리**
   - API 할당량 초과
   - 검색 결과 없음
   - API 키 유효하지 않음

### 테스트 파일 구조

```
test/
  ├── recommend.e2e-spec.ts    # E2E 테스트
  └── jest-e2e.json           # E2E 테스트 설정
```

### 테스트 설정 파일

1. **jest.config.js**: 일반 테스트 설정
   ```javascript
   module.exports = {
     moduleFileExtensions: ['js', 'json', 'ts'],
     rootDir: '.',
     testRegex: '.*\\.spec\\.ts$',
     transform: {
       '^.+\\.(t|j)s$': 'ts-jest',
     },
     collectCoverageFrom: [
       'src/**/*.(t|j)s',
       '!src/main.ts',
       '!src/**/*.module.ts',
       '!src/**/*.dto.ts',
       '!src/**/*.entity.ts',
       '!src/**/*.config.ts',
     ],
     coverageDirectory: './coverage',
     testEnvironment: 'node',
   };
   ```

2. **test/jest-e2e.json**: E2E 테스트 설정
   ```javascript
   {
     "moduleFileExtensions": ["js", "json", "ts"],
     "rootDir": ".",
     "testEnvironment": "node",
     "testRegex": ".e2e-spec.ts$",
     "transform": {
       "^.+\\.(t|j)s$": "ts-jest"
     },
     "moduleNameMapper": {
       "^src/(.*)$": "<rootDir>/../src/$1"
     }
   }
   ```

### 테스트 작성 가이드라인

1. **테스트 파일 명명 규칙**
   - 단위 테스트: `*.spec.ts`
   - E2E 테스트: `*.e2e-spec.ts`

2. **테스트 구조**
   ```typescript
   describe('컴포넌트명', () => {
     beforeEach(() => {
       // 테스트 전 설정
     });

     it('테스트 케이스 설명', () => {
       // 테스트 코드
     });
   });
   ```

3. **모킹 가이드라인**
   - 외부 의존성은 항상 모킹
   - HTTP 요청은 `jest.spyOn()` 사용
   - 환경 변수는 `process.env` 모킹

### 커버리지 리포트 확인

1. HTML 리포트 확인
   ```bash
   # 커버리지 리포트 생성 후
   open coverage/index.html  # macOS
   # 또는
   start coverage/index.html # Windows
   ```

2. E2E 테스트 커버리지
   ```bash
   # E2E 테스트 커버리지 리포트 생성
   npm run test:e2e -- --coverage
   ```

## 🐳 Docker 실행

### Docker Compose 사용

```bash
# 환경 변수 설정
cp config/dev/.env.ytb.example config/dev/.env.ytb

# Docker Compose로 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 컨테이너 중지
docker-compose down
```

### 단일 Docker 컨테이너 실행

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

## 💅 코드 스타일 및 커밋 메시지 규칙

### 코드 스타일 도구

프로젝트는 Prettier와 ESLint를 사용하여 일관된 코드 스타일을 유지합니다.

#### Prettier 설정

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "semi": true,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

#### ESLint 설정

```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint/eslint-plugin', 'prettier'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'prettier/prettier': 'error',
  },
};
```

### 코드 스타일 검사 및 수정

```bash
# 코드 스타일 검사
npm run lint

# 코드 스타일 자동 수정
npm run format
```

### 커밋 메시지 규칙

프로젝트는 [Conventional Commits](https://www.conventionalcommits.org/) 규칙을 따릅니다.

#### 커밋 타입

- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅, 세미콜론 누락, 코드 변경이 없는 경우
- `refactor`: 코드 리팩토링
- `test`: 테스트 코드 추가/수정
- `chore`: 빌드 프로세스 또는 보조 도구 변경
- `ci`: CI 설정 파일 변경
- `perf`: 성능 개선
- `revert`: 이전 커밋으로 되돌림

#### 커밋 메시지 형식

```
<type>(<scope>): <subject>

<body>

<footer>
```

예시:
```
feat(youtube): add music recommendation by year

- Implement YouTube API integration
- Add year-based search functionality
- Add error handling for API responses

Closes #123
```

### Git Hooks

프로젝트는 husky와 lint-staged를 사용하여 커밋 전 자동 검사를 수행합니다.

#### 자동 검사 항목

1. **코드 스타일 검사**
   - Prettier 포맷팅
   - ESLint 검사

2. **커밋 메시지 검사**
   - Conventional Commits 규칙 준수 여부
   - 커밋 메시지 형식 검사

#### Git Hooks 설정

```bash
# husky 설치
npm run prepare

# pre-commit 훅 설정
npx husky add .husky/pre-commit "npx lint-staged && npx --no -- commitlint --edit $1"
```

#### lint-staged 설정

```json
{
  "lint-staged": {
    "*.ts": [
      "prettier --write",
      "eslint --fix",
      "git add"
    ]
  }
}
```

## 👥 작성자
- **Your Name** - *Initial work* - [YourGitHub](https://github.com/GYUTORY)
