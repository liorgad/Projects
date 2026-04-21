# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a **US real estate investment analysis platform** — a monorepo containing a Next.js frontend and multiple NestJS backend microservices, serverless Lambda functions, and a property scraping service.

## Services at a Glance

| Directory | Type | Port | Role |
|---|---|---|---|
| `HomeforealUI/` | Next.js 14 frontend | 3000 | UI, property search, analysis dashboards |
| `BuyBoxService/` | NestJS 11 | 9000 | CRUD for investment criteria ("buy boxes") |
| `UserService/` | NestJS 11 | — | User profiles, Cognito auth, KYC |
| `analysis-service/` | NestJS 11 | — | Analysis run orchestration |
| `analysis-lambda/` | AWS Lambda (Node 18) | — | Heavy computation, SQS-triggered |
| `PropertiesScraper/` | Express | — | Property REST API + RabbitMQ consumer |
| `scraper-lambda/` | AWS Lambda (Node 18) | — | Serverless property scraping |
| `OfferService/` | NestJS 11 (skeleton) | — | Offer generation and tracking (Cloudflare Workers target) |

## Development Commands

All services use **pnpm** except `analysis-lambda` and `scraper-lambda` which use npm.

### Frontend (HomeforealUI)
```bash
cd HomeforealUI
pnpm install
pnpm run dev          # dev server at localhost:3000
pnpm run build
pnpm run test         # Jest
pnpm run lint
pnpm run storybook    # component dev server
```

### NestJS Services (BuyBoxService / UserService / analysis-service)
```bash
cd <ServiceDir>
pnpm install
pnpm run start:dev    # watch mode with hot-reload
pnpm run build
pnpm run test         # Jest unit tests (*.spec.ts)
pnpm run test:e2e     # test/*.e2e-spec.ts
pnpm run test:cov     # coverage
pnpm run lint
```

### Lambda Functions (analysis-lambda / scraper-lambda)
```bash
cd analysis-lambda   # or scraper-lambda
npm install
npm run build        # esbuild compilation → dist/
npm run package      # creates function.zip for deployment
npm run test         # Jest
npm run run-local    # local test invocation (src/run-local.ts)
```

### PropertiesScraper
```bash
cd PropertiesScraper
pnpm install
pnpm run start:dev   # nodemon with tsc watch
pnpm run build       # tsc
```

## Architecture

### Data Flow
```
User → HomeforealUI
         ↓
  AWS Cognito (auth)    BuyBoxService (buy box CRUD)
         ↓                     ↑
  PropertiesScraper     analysis-service
  (property search)          ↓
         ↓              analysis-lambda (SQS)
  scraper-lambda              ↓
  (SQS-triggered)       MongoDB (shared)
```

### NestJS Service Structure
Every NestJS service follows the same pattern:
- `src/modules/<feature>/` — controller → service → repository → schema (Mongoose)
- `src/modules/auth/` — Cognito JWT guard (applied globally)
- `src/modules/data/` — Mongoose database connection
- `src/modules/health/` — health check endpoint
- `src/config/` — typed config via `@nestjs/config`
- Validation: `nestjs-zod` with Zod schemas (not class-validator)
- Swagger docs at `/api` in dev
- URI versioning: `/v1/...`

### Frontend (HomeforealUI) Structure
- `src/api/` — typed HTTP clients per service (buybox_api, deals_api, location_api)
- `src/store/slices/` — Redux Toolkit slices; `src/store/services/` — RTK Query services
- `src/contexts/` — React Context for auth state
- `src/components/` — MUI + Radix UI components
- Path alias: `@/*` → `./src/*`

### Analysis Lambda Flow
1. SQS event delivers `{ analysisId }`
2. Fetches `AnalysisRun` from `analysis-service` API
3. Fetches `BuyBox` criteria from `BuyBoxService` (`BUYBOX_SERVICE_API_URL`)
4. Loads properties from MongoDB (`PropertyRepository`)
5. Runs `SimilarityAnalyzer`
6. Writes `AnalyzedProperty` results to MongoDB
7. POSTs completion status back to `analysis-service`

### Authentication
All backend services validate AWS Cognito JWTs. The guard is in `src/modules/auth/` for each NestJS service. The frontend uses `@aws-amplify/adapter-nextjs` and sends tokens with every API request.

## Key Environment Variables

Each service requires a `.env` file. Required vars across services:
- `MONGODB_URI` — MongoDB connection string
- `COGNITO_USER_POOL_ID`, `COGNITO_CLIENT_ID`, `COGNITO_REGION`
- `BUYBOX_SERVICE_API_URL` — used by `analysis-lambda`
- `ANALYSIS_SERVICE_API_URL` — used by `analysis-lambda`
- `RABBITMQ_URL` — used by `PropertiesScraper`

Frontend `.env` requires:
- `NEXT_PUBLIC_DEALS_SERVICE_HOST`
- `NEXT_PUBLIC_BUY_BOX_SERVICE_HOST`
- Cognito pool/client IDs for Amplify

## Service-Specific Notes

- Each service directory has its own `CLAUDE.md` with service-specific detail.
- `architecture_map.md` at the repo root has a full Mermaid topology diagram.
- `analysis-lambda` bundles with esbuild and externalizes the AWS SDK — don't add aws-sdk as a bundled dependency.
- `PropertiesScraper` uses Puppeteer for scraping; headless Chrome must be available in the execution environment.
