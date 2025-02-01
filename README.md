# AI Trend now public
AI 관련 뉴스와 논문을 수집, 가공하여 제공하는 모노레포 기반의 통합 플랫폼입니다.  
해당 레포지토리는 일부 코드 공개용으로 전체 소스는 아닙니다.  
일부 작업의 참조만 부탁드립니다.  

### 아래의 도메인을 통해 서비스를 사용하실 수 있습니다.
[AI 논문 요약 서비스](https://ai-trend-now.stream)

## 주요 기능
- AI 관련 컨텐츠 자동 수집 및 가공
  - 논문 (Arxiv)
- AI 기반 컨텐츠 생성
- 사용자 웹 서비스
- 관리자 시스템

## 시스템 구성

### Apps

- **user**: 사용자용 웹 애플리케이션 (Next.js) / Cloudflare pages에 edge환경으로 제공 서비스
- **manager**: 관리자 시스템 (Next.js) / AWS ECS을 통한 서비스 제공
- **crawler**: 크롤링 서버 (Fastify) / AWS ECS을 통한 서비스 제공
- **batch**: 배치 작업 서버 (Node.js) / AWS ECS을 통한 서비스 제공
- **storybook**: UI 컴포넌트 문서화 / 현재 개발중 로컬로만 확인

### Packages

- **ui**: 공통 UI 컴포넌트 라이브러리
- **util**: 공통 유틸리티
- **types**: 공통 타입 정의
- **prisma-manager**: 관리자 DB 스키마/클라이언트
- **prisma-user**: 사용자 DB 스키마/클라이언트
- **tailwind-config**: Tailwind CSS 공통 설정
- **typescript-config**: TypeScript 공통 설정

## 기술 스택

- **언어/런타임**: TypeScript, Node.js (>=18), edge runtime(cloudflare pages)
- **프레임워크**: Next.js (App Router), Fastify, node-cron
- **DB**: PostgreSQL, Redis
- **ORM**: Prisma
- **AI**: LangChain, LangSmith, Google Gemini
- **스타일링**: Tailwind CSS, Shadcn UI
- **패키지 관리**: pnpm workspace
- **빌드 도구**: Turborepo
- **테스트**: Jest
- **로깅**: Pino

## 시작하기

### 사전 요구사항

- Node.js >= 18
- pnpm >= 8.15.6
- PostgreSQL
- Redis

### 설치
# 의존성 설치
pnpm install

# 전체 앱 개발 서버 실행
pnpm dev

# 특정 앱만 실행
pnpm --filter user dev  
pnpm --filter manager dev  
pnpm --filter crawler dev  
pnpm --filter batch dev  

자세한 스크립트 설정은 turbo.json 참고

# 특정 앱만 docker build
sudo docker build -t manager .
sudo docker build -t crawler .
sudo docker build -t batch .


## 프로젝트 구조
```markdown
.
├── apps/
│ ├── user/ # 사용자 웹 앱
│ ├── manager/ # 관리자 시스템
│ ├── crawler/ # 크롤링 서버
│ ├── batch/ # 배치 작업 서버
│ └── storybook/ # UI 문서화
├── packages/
│ ├── ui/ # 공통 UI 컴포넌트
│ ├── util/ # 공통 유틸리티
│ ├── types/ # 공통 타입 정의
│ ├── prisma-*/ # Prisma 설정
│ └── *-config/ # 공통 설정
└── package.json
```
