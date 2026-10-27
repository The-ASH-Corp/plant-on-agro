# 🌱 PlantOn AGRO

> **You Plant. We Grow. You Track. You Visit.**  
> An enterprise-grade, full-stack Agro-Forestry, Nature Tourism & Ecological Stewardship Ecosystem connecting urban adopters with sustainable timber reserves in Kerala's Western Ghats.

---

[![Next.js](https://img.shields.io/badge/Next.js-16.3.5-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%20%7C%207.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.2.1-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9.11-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Live_&_Test-0C2340?style=for-the-badge&logo=razorpay&logoColor=white)](https://razorpay.com/)
[![Architecture](https://img.shields.io/badge/Architecture-Clean_DDD-orange?style=for-the-badge)](#system-architecture)

---

## 📖 Executive Summary

**PlantOn AGRO** is an innovative platform developed in collaboration with **RAC Realty**, operating within their flagship high-altitude plantation reserve in **Wayanad, Kerala**. 

The platform bridges sustainable forestry investment and modern eco-tourism. Urban investors, nature enthusiasts, and corporations adopt high-value timber and ecological saplings (such as Agarwood, Sandalwood, Teak, and Rosewood), track individual tree lifecycles through biometric telemetry and satellite coordinates, verify digital deeds of ownership, and physically visit the reserve for curated agro-tourism experiences.

### The 4-Phase Lifecycle

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   01 WE PLANT   │ ────> │   02 WE GROW    │ ────> │  03 THEY TRACK  │ ────> │  04 THEY VISIT  │
│ Elite Saplings  │       │ Arborist Care   │       │ GPS & Satellite │       │ Agro-Tourism    │
│ Geotagged RFID  │       │ Health & NDVI   │       │ Digital Deeds   │       │ Reserve Walking │
└─────────────────┘       └─────────────────┘       └─────────────────┘       └─────────────────┘
```

1. **01 We Plant**: High-yield saplings are selected, cataloged, physically tagged (RFID/Barcode), and planted in certified geo-polygons.
2. **02 We Grow**: Dedicated arborists nurture the plantation, recording periodic growth milestones (height, canopy spread), health logs, and satellite NDVI index scores.
3. **03 They Track**: Adopters receive verifiable Digital Deeds with SHA-256 cryptographic hashes, QR verification, satellite coordinates, and real-time carbon sequestration telemetry.
4. **04 They Visit**: Adopters book bundled, complimentary agro-tourism visits to walk through the reserve, meet assigned expert arborist guides, experience honey tapping and canopy dining, and upload photos to their private Visit Memory Vault.

---

## 🌟 Key Features

### 1. 🛍️ Storefront & Dynamic CMS Landing Page
- **Hero Telemetry Counter**: Live statistics displaying total planted trees, active adopters, metric tons of $CO_2$ sequestered, and oxygen generated.
- **Interactive Tree Catalog**: Filter by species category (Timber, Medicinal, Exotic), showing maturity timelines, ecological benefits, and adoption pricing.
- **Ecosystem Showcase**: Interactive tabs explaining the 4-phase journey, ecological restoration data, and verifiable digital certificate previews.
- **Curated Experiences Section**: Visual showcase of reserve activities (Plantation Walks, Honey Tapping, Night Forest Trails, Arborist Workshops, Luxury Canopy Dining).
- **Admin CMS Controls**: Fully dynamic hero headers, statistics, FAQs, testimonials, and mission statements editable directly from the backoffice without code deployments.

### 2. 🌳 7-Step Interactive Plant Flow Modal
A frictionless, animated step-by-step tree adoption wizard powered by Framer Motion:
1. **Tree Selection**: Visual carousel with maturity timelines, carbon impact ratings, and pricing.
2. **Dedication & Occasion**: Dedicate trees for birthdays, anniversaries, memorials, or corporate gifts with custom card messaging.
3. **Quantity & Plan Tiers**: Choose quantities (1, 5, 10, 25, 50, 100+) or select curated packages (**Silver**, **Gold**, **Platinum**) with yield-sharing perks.
4. **Reserve Selection**: Choose specific ecological reserve zones (Wayanad Rainforest Reserve, Western Ghats Ecological Corridor, Nashik Valley, Satara Plateau, Pune Hills).
5. **Adopter Information**: Seamless capture of adopter name, email, phone number, and physical certificate shipping address.
6. **Payment Gateway**: Dual-mode payment processing via **Razorpay Checkout** supporting UPI, Cards, Netbanking, with automatic fallback testing.
7. **Instant Digital Deed**: Instant allotment of unique Tree Tag IDs, SHA-256 hash generation, and a celebratory confetti modal with instant certificate download.

### 3. 💳 Razorpay Payment Gateway Integration
- **Full Indian Payment Stack**: Out-of-the-box support for UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, MasterCard, RuPay), and Netbanking across 50+ banks.
- **Cryptographic Verification**: Server-side HMAC SHA-256 signature verification (`razorpay_order_id|razorpay_payment_id` against `RAZORPAY_KEY_SECRET`).
- **Flexible Test & Live Modes**: Seamlessly switches between live transaction processing and zero-friction developer sandbox testing.
- **Resilient Order Creation**: Automatic synchronization with backend orders, idempotency protection, and clear payment status auditing (`PENDING` ➔ `PAID` / `FAILED`).

### 4. 📜 Verifiable Digital Deeds & Certificates
- **Tamper-Evident Hashing**: Each adopted tree produces an immutable digital deed featuring a SHA-256 cryptographic hash.
- **Public Verification Endpoint**: Anyone can scan the QR code or query `/api/v1/certificates/verify/:hash` to verify authenticity, adopter identity, planting date, and GPS coordinates.
- **High-Resolution Deeds**: Formatted certificates suitable for printing, framing, or ESG/CSR carbon auditing.

### 5. 🧑‍🌾 Buyer Experience Portal (`/buyer/dashboard`)
A dedicated, responsive portal for tree parents and institutional adopters:
- **Executive KPI Dashboard**: Immediate overview of trees adopted, lifetime $CO_2$ sequestered (kg), oxygen produced (kg), and biomass generated.
- **My Trees Inventory**: Detailed tree cards with species data, planting date, age, current height, and canopy status.
- **Tree Inspector Modal**: Deep-dive into specific tree telemetry—view exact GPS coordinates, satellite aerial view, arborist health logs, NDVI vegetation health scores, and growth milestone photos.
- **Orders & Invoices**: Full ledger of adoption transactions with printable, GST-compliant tax invoice generation.
- **Certificates Vault**: Central repository of all issued digital deeds with one-click PDF downloads and deed verification links.
- **Impact Telemetry**: Environmental impact comparison widgets (equivalent car kilometers offset, flight emissions neutralized).
- **Phase 04 Agro-Tourism Hub**:
  - View booked, upcoming, and completed plantation visits.
  - Interactive **Book Visit Modal** to schedule complimentary visits with party size, dates, and dietary preferences.
  - Dedicated **Experience Detail Modal** highlighting itinerary, timing, attire recommendations, and included amenities.
  - **Visit Memory Vault**: Upload visit photos and arborist notes to permanently attach memories to past reserve visits.

### 6. 🌿 Phase 04: Agro-Tourism & Visit Management
- **Integrated Nature Experiences**: Pre-seeded with 6 flagship experiences:
  - *Tree Plantation & Geotagging Walk* (complimentary with adoption)
  - *Wayanad Agro-Forestry Canopy Trek*
  - *Forest Honey Tapping & Spices Workshop*
  - *Night Forest & Bioluminescence Trail*
  - *Arborist Masterclass: Tropical Dendrology*
  - *Organic Harvest & Luxury Canopy Dining*
- **Booking Workflow**: Adopters request visit slots ➔ Admin reviews party size and dates ➔ Assigns designated Senior Arborist guide & sets meeting point ➔ Real-time status updates (`REQUESTED` ➔ `CONFIRMED` ➔ `COMPLETED` / `CANCELLED`).
- **Arborist Notes & Memory Vault**: Adopters and arborists upload real-world visit photographs (`/uploads/visits/`) to create a lasting record.

### 7. 🛡️ Admin Backoffice CMS Portal (`/admin/dashboard`)
Comprehensive enterprise dashboard for plantation managers and executives:
- **Executive Overview**: Total revenue metrics, total orders, planted saplings, active users, and system health status.
- **Orders Tab**: Manage, filter, search, and fulfill buyer orders. Inspect customer contact info, adoption tiers, and payment receipts.
- **Tree Varieties Tab**: CRUD management for tree species—name, botanical name, category, maturity period, $CO_2$/Oxygen metrics, market price, and gallery photos.
- **Tree Instances Tab**: Individual physical tree tracking—assign physical RFID tag IDs, set GPS lat/long, update height and health (`HEALTHY`, `ATTENTION`, `CRITICAL`), record NDVI scores, log arborist inspections, and upload milestone photos.
- **Locations & Reserves Tab**: Manage plantation parcels, geographic zones, elevation, soil characteristics, polygon boundaries, and capacity limits.
- **Adoption Plans Tab**: Configure pricing tiers (Silver, Gold, Platinum, Custom), tree bundle limits, yield sharing terms, and benefits.
- **Certificates Tab**: Audit all issued digital deeds, search by certificate number or SHA-256 hash, and regenerate documents.
- **Visits Tab (Agro-Tourism)**: Review incoming visit bookings, assign arborist guides, set designated gate meeting points, confirm or cancel bookings with custom reasons, and inspect visitor photo memories.
- **Users Directory Tab**: Comprehensive list of registered buyers, arborists, and administrators with role assignment and account controls.
- **Landing Page CMS Tab**: Real-time content editor for all hero copy, statistics, impact projects, FAQs, testimonials, and brand banners.

### 8. 📁 Multi-Image Media Storage Infrastructure
- **Multer Disk Engine**: Robust file upload middleware handling single and multi-file image uploads (up to 10 files per batch).
- **Segregated Directories**: Automatic routing to dedicated subfolders (`uploads/trees/`, `uploads/experiences/`, `uploads/visits/`).
- **Static Asset Serving**: Express static file hosting at `/uploads/*` with CORS and security headers for instant frontend rendering.

---

## 🏗️ System Architecture

The backend is built following **Clean Architecture** and **Domain-Driven Design (DDD)** principles to ensure high testability, loose coupling, and maintainability.

```
backend/src/
├── core/                         # Enterprise Business Rules (Domain Layer)
│   ├── entities/                 # Pure domain models (TreeInstance, Order, Experience, User...)
│   ├── value-objects/            # Immutable value objects (Email, Password, Money, Coordinates...)
│   ├── interfaces/               # Domain abstractions (Repositories, PaymentGateway, Hasher...)
│   └── events/                   # Domain events
│
├── application/                  # Application Business Rules (Use Cases Layer)
│   └── use-cases/                # Single-responsibility command/query handlers
│       ├── auth/                 # Register, Login, RefreshToken
│       ├── orders/               # CreateOrder, ProcessPayment, UpdateOrderStatus
│       ├── tree-instances/       # CreateTreeInstance, UpdateHealth, LogMilestone
│       ├── experiences/          # CreateExperience, ListExperiences
│       └── visit-bookings/       # BookVisit, ConfirmVisit, AddVisitMemories
│
├── infrastructure/               # Frameworks & Drivers (Data & External Integrations)
│   ├── database/                 # MongoDB connection, Mongoose schemas & mappers
│   ├── repositories/             # Concrete Mongo repository implementations
│   ├── services/                 # External service implementations (Razorpay, Argon2, JWT)
│   └── di/                       # Dependency Injection Container (Singleton bindings)
│
└── presentation/                 # Interface Adapters (Web Layer)
    ├── controllers/              # HTTP request handlers mapping to Use Cases
    ├── routes/                   # Express 5 route definitions & versioning (/api/v1)
    ├── middlewares/              # Auth guard, Role RBAC, Zod validator, Multer upload
    └── validators/               # Zod request validation schemas
```

---

## 🛠️ Complete Technology Stack & Tools

### Frontend Stack
| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | [Next.js](https://nextjs.org/) | `16.3.5` | React framework with App Router, SSR, and optimized client routing |
| **Library** | [React](https://react.dev/) | `19.2.8` | Declarative UI component library |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | `^5.0` | Static type checking and safety |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | `^4.0` | Utility-first CSS engine with modern color tokens and glassmorphism |
| **State Store** | [Zustand](https://github.com/pmndrs/zustand) | `^5.0.15` | Fast, lightweight client-side state with LocalStorage persistence |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) | `^13.4.0` | Smooth physics-based transitions, drawer gestures, and step animations |
| **HTTP Client** | [Axios](https://axios-http.com/) | `^1.20.0` | Promise-based HTTP client with request/response interceptors |
| **Payments** | [Razorpay Checkout.js](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/) | `v1` | Embedded modal checkout for cards, UPI, and netbanking |
| **PostCSS** | `@tailwindcss/postcss` | `^4.0` | CSS processing pipeline |
| **Linter** | [ESLint](https://eslint.org/) | `^9.0` | Code quality and syntax validation |

### Backend Stack
| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Runtime** | [Node.js](https://nodejs.org/) | `>=20.x` | High-performance asynchronous JavaScript runtime |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | `^7.0.2` | Strongly typed JavaScript compilation |
| **Framework** | [Express](https://expressjs.com/) | `^5.2.1` | Minimalist HTTP web framework with native Promise handling |
| **Database** | [MongoDB](https://www.mongodb.com/) | `>=7.0` | NoSQL document database for flexible agroforestry schema |
| **ODM** | [Mongoose](https://mongoosejs.com/) | `^9.11.0` | Object Document Mapper with schema enforcement and indexing |
| **Execution** | [TSX](https://github.com/privatenumber/tsx) | `^4.23.15` | Blazing-fast TypeScript execution engine with file watching (`tsx watch`) |
| **Payment SDK** | [Razorpay](https://www.npmjs.com/package/razorpay) | `^2.9.8` | Official Razorpay Node SDK for order creation & signature verification |
| **File Uploads** | [Multer](https://github.com/expressjs/multer) | `^2.4.0` | Multipart/form-data handler for disk-stored tree & visit photos |
| **Password Hashing** | [Argon2](https://github.com/ranisalt/node-argon2) | `^0.45.1` | Award-winning Argon2id password hashing algorithm |
| **Authentication** | [JsonWebToken](https://github.com/auth0/node-jsonwebtoken) | `^9.0.3` | Cryptographically signed JWT bearer tokens |
| **Validation** | [Zod](https://zod.dev/) | `^4.6.5` | TypeScript-first schema declaration and runtime validation |
| **Security Headers** | [Helmet](https://helmetjs.github.io/) | `^8.3.0` | HTTP headers hardening for XSS, clickjacking, and CSP protection |
| **Rate Limiter** | [Express Rate Limit](https://github.com/express-rate-limit/express-rate-limit) | `^8.7.1` | Brute-force and DDoS protection middleware |
| **CORS** | [CORS](https://github.com/expressjs/cors) | `^2.8.6` | Cross-Origin Resource Sharing control |
| **HTTP Logger** | [Morgan](https://github.com/expressjs/morgan) | `^1.12.1` | HTTP request logging for development monitoring |
| **Environment** | [Dotenv](https://github.com/motdotla/dotenv) | `^18.0.5` | Environment variable loader |

---

## 📂 Project Directory Structure

```text
plant-on-agro/
├── README.md                           # Master Project Documentation (You are here)
│
├── backend/                            # Express 5 + Clean Architecture Backend
│   ├── .env                            # Backend environment configuration
│   ├── package.json                    # Backend dependencies and scripts
│   ├── tsconfig.json                   # TypeScript compiler options
│   ├── uploads/                        # Static file upload repository
│   │   ├── trees/                      # Sapling & tree growth milestone photos
│   │   ├── experiences/                # Curated agro-tourism gallery images
│   │   └── visits/                     # Buyer visit memory photographs
│   └── src/
│       ├── server.ts                   # Server entrypoint and DB connection lifecycle
│       ├── app.ts                      # Express app initialization, CORS, Helmet, static routes
│       ├── config/                     # Typed environment variables validation
│       ├── core/                       # Domain Entities, Value Objects, Interfaces
│       │   ├── entities/               # Order, TreeInstance, Certificate, Experience, VisitBooking...
│       │   ├── value-objects/          # Email, Password, Money, Coordinates
│       │   └── interfaces/             # PaymentGateway, Repositories, PasswordHasher
│       ├── application/                # Application Use Cases
│       │   └── use-cases/              # Modular business logic commands and queries
│       ├── infrastructure/             # Concrete implementations
│       │   ├── database/               # Mongoose connection, schemas, and auto-seeders
│       │   │   └── seeds/              # Initial database seeds (e.g. experience.seeder.ts)
│       │   ├── repositories/           # Mongo-backed domain repositories
│       │   ├── services/               # RazorpayService, Argon2Hasher, JwtService
│       │   └── di/                     # Dependency Injection Container (Singleton registry)
│       ├── presentation/               # HTTP presentation layer
│       │   ├── controllers/            # Express controllers
│       │   ├── middlewares/            # Auth guard, RBAC, Zod validator, Multer disk storage
│       │   ├── routes/                 # Express route handlers
│       │   └── validators/             # Zod validation schemas
│       ├── scripts/                    # Maintenance & seeding CLI scripts
│       │   └── seed-admin.ts           # Interactive admin account generator
│       └── shared/                     # ApiResponse utilities, HTTP status constants, Base errors
│
└── frontend/                           # Next.js 16 + React 19 Frontend
    ├── .env                            # Frontend environment configuration
    ├── package.json                    # Frontend dependencies and scripts
    ├── next.config.ts                  # Next.js configuration
    ├── postcss.config.mjs              # PostCSS Tailwind plugin config
    ├── tsconfig.json                   # Frontend TypeScript configuration
    ├── app/                            # Next.js App Router
    │   ├── layout.tsx                  # Root HTML layout with Razorpay Checkout.js script
    │   ├── globals.css                 # Global CSS and Tailwind v4 theme variables
    │   ├── page.tsx                    # Public Storefront & Agro-Forestry Landing Page
    │   ├── login/                      # User / Admin authentication page
    │   ├── register/                   # Buyer registration page
    │   ├── forgot-password/            # Password recovery workflow
    │   ├── buyer/dashboard/            # Buyer Experience Portal (6 tabs + modals)
    │   └── admin/dashboard/            # Admin Backoffice CMS (10 management tabs)
    ├── components/                     # Reusable UI component library
    │   ├── landing/                    # Hero, HowItWorks, ExploreTrees, ExperienceSection, Impact...
    │   ├── plant-flow/                 # 7-Step Tree Adoption Flow & Razorpay checkout
    │   ├── buyer/                      # Buyer Dashboard widgets, tabs, and inspection modals
    │   ├── admin/                      # Admin backoffice tabs (Trees, Orders, Visits, CMS...)
    │   ├── layout/                     # Navbar, Footer, Mobile Navigation
    │   └── ui/                         # Buttons, Inputs, Modal wrappers, Badges, Tabs
    ├── services/                       # Typed API clients (Axios)
    │   ├── auth/                       # Login, Register, Profile, Token refresh
    │   ├── payment/                    # Razorpay order creation & signature verification
    │   ├── tree-varieties/             # Varieties fetch & management
    │   ├── tree-instances/             # Tree telemetry, health logs, coordinates
    │   ├── experiences/                # Agro-tourism experiences fetch
    │   ├── visits/                     # Visit booking & photo memory upload
    │   ├── orders/                     # Order history & invoice generation
    │   ├── certificates/               # Deed verification & lookup
    │   └── upload/                     # Multi-image upload service
    ├── store/                          # Zustand state stores
    │   ├── auth.store.ts               # User session, JWT tokens, and user profile
    │   └── plant-flow.store.ts         # Multi-step adoption wizard state
    └── types/                          # Shared TypeScript interfaces & types
```

---

## 🚀 Getting Started & Local Setup

### Prerequisites
Make sure the following software is installed on your local development machine:
- **Node.js**: `v20.x` or later (LTS recommended)
- **npm**: `v10.x` or later
- **MongoDB**: `v6.x` or `v7.x` running locally on port `27017` (or a MongoDB Atlas connection URI)
- **Git**

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/Ash-Corp/plant-on-agro.git
cd plant-on-agro
```

---

### Step 2: Backend Configuration & Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install backend dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `backend/` directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database Connection
   MONGO_URI=mongodb://localhost:27017/plant_on_agro

   # CORS Configuration (comma-separated allowed origins)
   CORS_ORIGIN=http://localhost:3000

   # JWT Secret Key and Expiry
   JWT_SECRET=plant_on_agro_jwt_super_secret_key_2026_secure
   JWT_EXPIRES_IN=7d

   # Razorpay Payment Gateway Keys (Live or Test)
   RAZORPAY_KEY_ID=
   RAZORPAY_KEY_SECRET=
   ```

4. **Seed the Administrator Account**:
   Run the interactive seeder to generate an administrator account:
   ```bash
   npm run seed:admin
   ```
   *Follow the terminal prompts to specify an admin name, email, and password.*

5. **Start the Backend Dev Server**:
   ```bash
   npm run dev
   ```
   *The backend will automatically connect to MongoDB, seed standard agro-tourism experiences if missing, and listen on `http://localhost:5000`.*

---

### Step 3: Frontend Configuration & Setup

1. **Open a new terminal tab and navigate to the frontend**:
   ```bash
   cd frontend
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Configure Frontend Environment Variables**:
   Create a `.env` file in the `frontend/` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   NEXT_PUBLIC_RAZORPAY_KEY_ID=
   ```

4. **Start the Frontend Dev Server**:
   ```bash
   npm run dev
   ```
   *The Next.js storefront will compile and launch on `http://localhost:3000`.*

---

## 🔑 Default Roles & Access Credentials

| Portal | URL Route | Default Access | Description |
| :--- | :--- | :--- | :--- |
| **Public Storefront** | `http://localhost:3000/` | Public | Explore trees, view impact, preview deeds, book experiences |
| **Plant Flow Wizard** | Triggered from landing page | Public / Adopter | 7-step adoption flow with live Razorpay checkout |
| **Buyer Portal** | `http://localhost:3000/buyer/dashboard` | Role: `buyer` | Track adopted trees, view deeds, schedule visits, upload memories |
| **Admin Backoffice** | `http://localhost:3000/admin/dashboard` | Role: `admin` | Manage tree varieties, instances, orders, certificates, visits, CMS |

> **Tip**: You can register a new buyer account via `http://localhost:3000/register` or create an administrator using `npm run seed:admin` in the backend.

---

## 📡 API Reference

All backend API routes are versioned under `/api/v1` and return standardized JSON responses using the `ApiResponse` schema:

```json
{
  "success": true,
  "message": "Resource retrieved successfully",
  "data": { ... }
}
```

### 1. Authentication (`/api/v1/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Public | Register a new adopter / buyer account |
| `POST` | `/api/v1/auth/login` | Public | Authenticate user with email and password |
| `GET` | `/api/v1/auth/me` | Authenticated | Fetch current user session and role profile |
| `POST` | `/api/v1/auth/refresh` | Public | Refresh expired JWT access token |

### 2. Payment Gateway (`/api/v1/payment`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/payment/config` | Public | Get public gateway config (key ID, currency) |
| `POST` | `/api/v1/payment/create-order` | Public | Create a Razorpay Order ID for tree adoption checkout |
| `POST` | `/api/v1/payment/verify` | Public | Verify Razorpay HMAC SHA-256 signature and confirm order |

### 3. Orders (`/api/v1/orders`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/orders` | Authenticated | List orders (filtered by adopter for buyers, all for admin) |
| `GET` | `/api/v1/orders/:id` | Authenticated | Get detailed order summary and pricing breakdown |
| `GET` | `/api/v1/orders/number/:orderNumber` | Authenticated | Lookup order by human-readable number (e.g. `ORD-2026-XXXX`) |
| `POST` | `/api/v1/orders` | Public | Create new adoption order from plant flow wizard |
| `PATCH` | `/api/v1/orders/:id/status` | Admin | Update order status (`PENDING`, `PAID`, `FULFILLED`, `CANCELLED`) |
| `POST` | `/api/v1/orders/mark-all-read` | Admin | Mark all unread incoming orders as reviewed |
| `DELETE` | `/api/v1/orders/:id` | Admin | Remove order record |

### 4. Tree Varieties (`/api/v1/tree-varieties`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/tree-varieties` | Public | List all active tree species with ecological metrics & price |
| `GET` | `/api/v1/tree-varieties/:id` | Public | Get specific tree species details and maturity timeline |
| `POST` | `/api/v1/tree-varieties` | Admin | Add a new tree variety to the catalog |
| `PUT` | `/api/v1/tree-varieties/:id` | Admin | Update species pricing, yield, or descriptions |
| `DELETE` | `/api/v1/tree-varieties/:id` | Admin | Soft delete/deactivate a tree variety |

### 5. Tree Instances & Telemetry (`/api/v1/tree-instances`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/tree-instances` | Authenticated | List tree instances (filtered by owner for buyers) |
| `GET` | `/api/v1/tree-instances/:id` | Authenticated | Get specific tree telemetry, GPS, health logs, and photos |
| `POST` | `/api/v1/tree-instances` | Admin | Allocate and plant a new physical tree with tag ID & GPS |
| `PUT` | `/api/v1/tree-instances/:id` | Admin | Update tree measurements, NDVI health score, and arborist logs |
| `DELETE` | `/api/v1/tree-instances/:id` | Admin | Remove a tree instance record |

### 6. Certificates & Digital Deeds (`/api/v1/certificates`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/certificates` | Admin | List all issued adoption deeds |
| `GET` | `/api/v1/certificates/:id` | Authenticated | Get certificate details by database ID |
| `GET` | `/api/v1/certificates/number/:num` | Authenticated | Get certificate by deed number (e.g. `CERT-2026-XXXX`) |
| `GET` | `/api/v1/certificates/verify/:hash` | Public | Public verification of certificate authenticity via SHA-256 hash |
| `POST` | `/api/v1/certificates` | Admin | Manually issue or create a certificate record |
| `PUT` | `/api/v1/certificates/:id` | Admin | Update certificate metadata |
| `DELETE` | `/api/v1/certificates/:id` | Admin | Revoke/delete a certificate |

### 7. Phase 04: Agro-Tourism Experiences (`/api/v1/experiences`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/experiences` | Public | List all active agro-tourism experiences |
| `GET` | `/api/v1/experiences/:id` | Public | Get single experience by ID or slug with image gallery |
| `POST` | `/api/v1/experiences` | Admin | Create a new curated agro-forestry experience |
| `PUT` | `/api/v1/experiences/:id` | Admin | Update experience itinerary, duration, or amenities |
| `DELETE` | `/api/v1/experiences/:id` | Admin | Delete an experience package |

### 8. Phase 04: Plantation Visit Bookings (`/api/v1/visits`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/visits` | Public / Adopter | Schedule a plantation visit booking |
| `GET` | `/api/v1/visits/my-visits` | Authenticated | Get visits belonging to the authenticated adopter |
| `GET` | `/api/v1/visits` | Admin | List all visit requests with filters |
| `GET` | `/api/v1/visits/:id` | Authenticated | View visit details, assigned arborist guide, and notes |
| `PATCH` | `/api/v1/visits/:id/status` | Admin | Update status (`CONFIRMED`, `COMPLETED`, `CANCELLED`) & assign guide |
| `POST` | `/api/v1/visits/:id/memories` | Authenticated | Upload visit photo memories and guest notes |
| `DELETE` | `/api/v1/visits/:id` | Admin | Cancel/delete visit booking |

### 9. Multi-Image Uploads (`/api/v1/upload`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/upload/tree-image` | Admin | Upload single tree photograph (`uploads/trees/`) |
| `POST` | `/api/v1/upload/multiple` | Authenticated | Batch upload up to 10 photos (`uploads/trees/` or `uploads/visits/`) |
| `POST` | `/api/v1/upload/experience-images` | Admin | Batch upload experience gallery images (`uploads/experiences/`) |

### 10. Plantation Locations & Reserves (`/api/v1/locations`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/locations` | Public | List available planting reserves (Wayanad, Western Ghats, etc.) |
| `POST` | `/api/v1/locations` | Admin | Create a new reserve zone with coordinates and capacity |
| `PUT` | `/api/v1/locations/:id` | Admin | Update reserve metrics and tree counts |
| `DELETE` | `/api/v1/locations/:id` | Admin | Remove reserve location |

### 11. Adoption Plans (`/api/v1/adoption-plans`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/adoption-plans` | Public | List adoption tiers (Silver, Gold, Platinum) |
| `POST` | `/api/v1/adoption-plans` | Admin | Create a new tier package |
| `PUT` | `/api/v1/adoption-plans/:id` | Admin | Update plan pricing and perks |
| `DELETE` | `/api/v1/adoption-plans/:id` | Admin | Remove plan package |

### 12. Landing Page CMS (`/api/v1/landing-page`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/landing-page` | Public | Fetch live landing page hero text, stats, and FAQs |
| `PUT` | `/api/v1/landing-page` | Admin | Update landing page CMS content in real-time |

---

## 🛡️ Security, Validation & Resilience

- **Password Hashing**: Uses the state-of-the-art **Argon2id** algorithm, resilient against GPU-based brute-force attacks.
- **HMAC Payment Signature Verification**: Every Razorpay webhook and checkout verification executes constant-time cryptographic SHA-256 signature checking.
- **Input Validation**: Every incoming HTTP body, query string, and URL parameter is validated using strict **Zod** schemas before reaching controllers.
- **HTTP Header Hardening**: Secured with **Helmet**, enforcing secure Cross-Origin Resource Policies and disabling `X-Powered-By`.
- **DDoS & Brute-Force Rate Limiting**: Built-in rate limiting using `express-rate-limit` to protect sensitive endpoints (login, register, payment verification).
- **Graceful Shutdown**: The Node server handles `SIGINT` and `SIGTERM` signals cleanly, draining existing requests and closing MongoDB connections gracefully.

---

## 🧪 Testing & Verification

### TypeScript Compile & Typecheck
Both projects are strictly typed. You can verify type safety across both codebases:

```bash
# Verify backend typecheck
cd backend
npm run typecheck

# Verify frontend typecheck & lint
cd frontend
npm run lint
```

### End-to-End Adoption Test Flow
1. Visit `http://localhost:3000/`.
2. Click **"Plant a Tree"** in the top navigation bar.
3. Complete steps 1 to 5 of the Plant Flow wizard.
4. On **Step 6 (Payment)**, click **"Complete ₹X Adoption via Razorpay"**.
5. The Razorpay modal will open:
   - For live keys: select your preferred payment method (UPI, Card, Netbanking).
   - For test mode: use test phone `9999999999` and test UPI `success@razorpay`.
6. Upon payment completion, observe **Step 7 (Instant Deed)** appear with your allocated Tree Tag ID.
7. Click **"Go to Buyer Dashboard"** to view your newly adopted tree, satellite coordinates, and schedule your plantation visit!

---

## 🤝 Contributing

We welcome contributions to make the PlantOn AGRO ecosystem even more impactful!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingAgroFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingAgroFeature'`)
4. Push to the Branch (`git push origin feature/AmazingAgroFeature`)
5. Open a Pull Request

---

## 📄 License & Attribution

Distributed under the **ISC License**. Developed for **PlantOn × RAC Realty**. All agro-forestry, carbon calculation, and reserve mapping rights reserved.
