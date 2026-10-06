# Plant-on-Agro Backend — Clean Architecture (TypeScript)

Production-grade TypeScript backend designed with **Clean Architecture** and **Domain-Driven Design (DDD)** principles for high scalability, testability, and maintainability.

---

## 🏛️ Architecture Overview

The system strictly adheres to the **Dependency Inversion Principle (DIP)**: dependencies point inwards towards the Domain/Core. Outer layers depend on inner layers; inner layers know nothing about outer layers.

```
                  ┌───────────────────────────────┐
                  │    Presentation (HTTP/API)    │
                  │  (Controllers, Routes, Mid.)  │
                  └──────────────┬────────────────┘
                                 │
                  ┌──────────────▼────────────────┐
                  │          Application          │
                  │     (Use Cases, DTOs, Ports)  │
                  └──────────────┬────────────────┘
                                 │
                  ┌──────────────▼────────────────┐
                  │         Core / Domain         │
                  │   (Entities, Value Objects,   │
                  │     Repository Interfaces)    │
                  └──────────────▲────────────────┘
                                 │ (implements)
                  ┌──────────────┴────────────────┐
                  │        Infrastructure         │
                  │   (MongoDB, Mappers, Models,  │
                  │        External Services)     │
                  └───────────────────────────────┘
```

---

## 📁 Directory Structure & Responsibilities

```
backend/
├── src/
│   ├── config/                      # Environment configuration & validation (Zod)
│   │   └── env.ts
│   │
│   ├── core/                        # Enterprise Business Domain (Zero external dependencies)
│   │   ├── entities/                # Business domain models (e.g. User, Plant, Order)
│   │   ├── value-objects/           # Encapsulated immutable values with validation (e.g. Email)
│   │   ├── errors/                  # Custom Domain/Application error hierarchy
│   │   └── interfaces/              # Repository contracts (Ports) defined by the domain
│   │
│   ├── application/                 # Application Business Rules (Orchestration)
│   │   ├── use-cases/               # Pure use case execution (Single Responsibility)
│   │   ├── dto/                     # Request/Response Data Transfer Objects
│   │   └── interfaces/              # Secondary ports (e.g. TokenService, Mailer)
│   │
│   ├── infrastructure/              # External Frameworks, DB & Tools (Adapters)
│   │   ├── database/
│   │   │   ├── connection.ts        # Resilient MongoDB client with reconnection handlers
│   │   │   ├── models/              # Mongoose Schemas (Persistence representations)
│   │   │   └── mappers/             # Bi-directional Domain Entity <-> Mongoose Document mappers
│   │   ├── repositories/            # Concrete database repository implementations
│   │   ├── services/                # Concrete external service implementations
│   │   └── di/                      # Composition Root (Dependency Injection Container)
│   │
│   ├── presentation/                # Interface Adapters (Web / HTTP)
│   │   ├── controllers/             # Express controllers (delegates to use cases)
│   │   ├── routes/                  # Express routes & routing table
│   │   ├── middlewares/             # Centralized error handler, auth, validation
│   │   └── validators/              # Zod input schemas for query, params, body
│   │
│   ├── shared/                      # Shared Kernel / Utilities
│   │   ├── constants/               # HTTP status codes & constants
│   │   ├── utils/                   # Standard ApiResponse envelope
│   │   └── types/                   # Common generic TypeScript types
│   │
│   ├── app.ts                       # Express application assembly (CORS, Helmet, Middlewares)
│   └── server.ts                    # Server bootstrap & graceful shutdown lifecycle
│
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json
```

---

## 🛠️ Key Architectural Decisions

1. **Entities vs Mongoose Models**: Mongoose schemas live in `infrastructure/database/models`, completely isolated from domain entities. Data mappers (`infrastructure/database/mappers`) translate between them.
2. **Composition Root (DI)**: All wiring of repositories, use cases, and controllers happens in `infrastructure/di/container.ts`. Routes consume controllers without tight coupling.
3. **Fail-Fast Environment Validation**: `config/env.ts` validates all required environment variables on boot using Zod.
4. **Resilient Error Handling**: Centralized error middleware formats custom `AppError`, Zod validation errors, and MongoDB duplicate key (`11000`) conflicts into a uniform API response.
5. **Standardized Response Envelope**: `ApiResponse` ensures all endpoints return consistent `{ success, data, message, timestamp }` formats.
6. **Zero Vulnerabilities & Native TypeScript Dev**: Uses `tsx` for sub-millisecond dev server reloads without the security issues of unmaintained tools.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

### 5. Start Production Server
```bash
npm run start
```

### 6. Typecheck
```bash
npm run typecheck
```
