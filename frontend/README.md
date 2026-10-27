# PlantOn AGRO - Frontend Web Application

The interactive client portal and public storefront for **PlantOn AGRO**, built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4.

For the complete project documentation, system architecture, backend guide, and API reference, please see the [Master Project README](../README.md).

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
# Copy or create .env:
# NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
# NEXT_PUBLIC_RAZORPAY_KEY_ID=

# 3. Start local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the storefront.

---

## 🏗️ Architecture & Key Components

- **`app/`**: Next.js App Router (Storefront, `/buyer/dashboard`, `/admin/dashboard`, `/login`, `/register`).
- **`components/landing/`**: Public storefront components (Hero, How It Works, Explore Trees, Impact, Certificates, Experiences).
- **`components/plant-flow/`**: 7-Step Tree Adoption Flow with integrated Razorpay Checkout modal.
- **`components/buyer/`**: Buyer dashboard widgets, tree inspector, invoice viewer, and Phase 04 visit booking & memory vault.
- **`components/admin/`**: Admin backoffice tabs (Trees, Tree Instances, Orders, Certificates, Locations, Plans, Visits, Users, CMS).
- **`services/`**: Typed Axios API clients connecting to backend REST endpoints.
- **`store/`**: Zustand client stores with LocalStorage persistence (`auth.store.ts`, `plant-flow.store.ts`).

---

## 📜 Scripts

- `npm run dev` - Start development server on port 3000 with Turbopack / Fast Refresh
- `npm run build` - Build production-ready Next.js bundle
- `npm run start` - Start production server
- `npm run lint` - Execute ESLint static analysis
