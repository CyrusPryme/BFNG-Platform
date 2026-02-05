# BFNG Platform - Bulk Foods & Groceries Network

## 🌍 Overview

A production-ready agri-commerce platform built for Ghana's bulk grocery and Made-in-Ghana product distribution market. BFNG aggregates demand, sources weekly from markets, and delivers nationwide with subscription support.

## 🎯 Core Differentiators

- **Order-led, not inventory-led** business model
- **Weekly bulk aggregation** (Thursday buying cycles)
- **WhatsApp-first commerce** with web operations backbone
- **Multi-persona support** (households, diaspora, institutions, B2B)
- **Hybrid fulfillment** (market sourcing + vendor sourcing + stored inventory)
- **Subscription-first** architecture
- **Human-in-the-loop** operations (substitutions, confirmations)

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    BFNG PLATFORM                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Customer   │  │    Admin     │  │   Vendor     │    │
│  │  Storefront  │  │  Dashboard   │  │    Portal    │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│         │                 │                 │              │
│  ┌──────────────────────────────────────────────────────┐ │
│  │              Next.js App Router (API)                │ │
│  └──────────────────────────────────────────────────────┘ │
│         │                 │                 │              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │    Order     │  │ Subscription │  │   Payment    │    │
│  │   Engine     │  │    Engine    │  │   Gateway    │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│         │                 │                 │              │
│  ┌──────────────────────────────────────────────────────┐ │
│  │              PostgreSQL Database                     │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **UI**: React + Tailwind CSS
- **Payments**: Paystack (Ghana + International)
- **Auth**: NextAuth.js
- **State**: React Context + Server Actions
- **Email**: Resend
- **Storage**: AWS S3 / Cloudinary

## 🗄️ Database Schema

### Core Tables

- **users** - All platform users with role-based access
- **customers** - Customer-specific data
- **products** - Product catalog
- **categories** - Product categorization
- **vendors** - Made-in-Ghana vendor accounts
- **orders** - All order records
- **order_items** - Individual items in orders
- **subscriptions** - Recurring order configurations
- **subscription_orders** - Auto-generated orders
- **substitutions** - Item replacement tracking
- **deliveries** - Delivery assignments and tracking
- **payments** - Payment records
- **inventory** - Stock levels (soft + hard)
- **addresses** - Customer delivery addresses

## 🔄 Order State Machine

```
RECEIVED → CONFIRMED → AWAITING_PAYMENT → PAID → IN_SOURCING
    ↓
SUBSTITUTION_REQUIRED ← → CUSTOMER_APPROVED
    ↓
READY_FOR_PACKING → PACKED → OUT_FOR_DELIVERY → DELIVERED → COMPLETED

Possible exits: CANCELLED, FAILED, REFUNDED
```

## 👥 User Roles

1. **Customer** - Browse, order, subscribe, track
2. **Admin** - Full operations control
3. **Shopper** - Market buying, substitutions
4. **Vendor** - Product management, sales tracking
5. **Delivery** - Route management, proof of delivery

## 🚀 Getting Started

### Prerequisites

```bash
Node.js 18+
PostgreSQL 14+
npm or yarn
```

### Installation

```bash
# Clone repository
git clone <repo-url>
cd bfng-platform

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Configure database
# Edit .env.local with your PostgreSQL credentials

# Run migrations
npx prisma migrate dev

# Seed initial data
npx prisma db seed

# Start development server
npm run dev
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/bfng"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Paystack
PAYSTACK_SECRET_KEY="sk_test_xxx"
PAYSTACK_PUBLIC_KEY="pk_test_xxx"

# Email
RESEND_API_KEY="re_xxx"

# AWS S3 (optional)
AWS_ACCESS_KEY_ID="xxx"
AWS_SECRET_ACCESS_KEY="xxx"
AWS_REGION="us-east-1"
AWS_BUCKET_NAME="bfng-uploads"
```

## 📂 Project Structure

```
bfng-platform/
├── app/
│   ├── (auth)/              # Authentication pages
│   ├── (customer)/          # Customer storefront
│   ├── (admin)/             # Admin dashboard
│   ├── (vendor)/            # Vendor portal
│   ├── (delivery)/          # Delivery partner interface
│   ├── api/                 # API routes
│   └── layout.tsx
├── components/
│   ├── ui/                  # Reusable UI components
│   ├── customer/            # Customer-specific components
│   ├── admin/               # Admin components
│   └── shared/              # Shared components
├── lib/
│   ├── prisma.ts           # Prisma client
│   ├── auth.ts             # Auth configuration
│   ├── utils.ts            # Utilities
│   └── engines/            # Business logic engines
│       ├── order-engine.ts
│       ├── subscription-engine.ts
│       └── payment-engine.ts
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed data
├── public/                 # Static assets
└── types/                  # TypeScript definitions
```

## 🎯 Key Features

### Customer Features
- Product browsing by category
- Bulk order placement
- Delivery date selection
- Substitution approval interface
- Subscription management
- Multi-recipient support (diaspora)
- Order tracking
- Payment (Paystack)

### Admin Features
- Order management dashboard
- Status-based order views
- Substitution handling
- Weekly bulk buying interface
- Inventory management (soft/hard)
- Delivery assignment
- Payment reconciliation
- Analytics & reporting
- Vendor approval workflow

### Subscription Engine
- Weekly/bi-weekly/monthly cycles
- Auto-order generation before cutoff
- Editable box contents
- Pause/resume functionality
- Skip orders
- Upgrade/downgrade plans

### Vendor Portal
- Product listing (admin approval required)
- Inventory updates
- Order notifications
- Commission tracking
- Sales reporting

### Operations Features
- Weekly buying cycle (Thursday rule)
- Substitution workflow
- Quality checks
- Packing confirmation
- Delivery routing

## 🔐 Authentication & Authorization

Role-based access control (RBAC):

```typescript
enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  SHOPPER = 'SHOPPER',
  VENDOR = 'VENDOR',
  DELIVERY = 'DELIVERY'
}
```

Protected routes with middleware checking.

## 💳 Payment Flow

1. Customer places order
2. System calculates total (including delivery)
3. Payment link generated (Paystack)
4. Customer pays (cards, mobile money)
5. Webhook confirms payment
6. Order status → PAID
7. Fulfillment begins

**Diaspora payments**: International cards supported via Paystack.

**Postpaid**: Admin can mark institutional customers as postpaid.

## 📊 Analytics

Track:
- Demand trends
- Popular items
- Subscription metrics (churn, LTV)
- Delivery performance
- Vendor sales
- Revenue by category
- Customer acquisition cost

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Type checking
npm run type-check
```

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Docker

```bash
# Build
docker build -t bfng-platform .

# Run
docker run -p 3000:3000 bfng-platform
```

## 🔄 Weekly Operations Cycle

**Monday-Wednesday**: Orders received  
**Wednesday 11:59 PM**: Order cutoff  
**Thursday**: Bulk market buying  
**Thursday-Friday**: Quality checks, packing  
**Friday-Saturday**: Deliveries  
**Sunday**: Analytics, planning

Subscriptions auto-generate orders on Tuesday before cutoff.

## 📱 WhatsApp Integration

BFNG is WhatsApp-first. The web platform serves as:
- Order confirmation interface
- Substitution approval
- Payment gateway
- Subscription management
- Admin operations

WhatsApp handles:
- Customer inquiries
- Order placement (forwarded to system)
- Status updates
- Quick reorders

## 🛠️ Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npx prisma studio    # Open database GUI
npx prisma migrate   # Run migrations
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

Proprietary - BFNG © 2026

## 📧 Support

- Email: support@bfng.com.gh
- WhatsApp: +233 XX XXX XXXX
- Web: https://bfng.com.gh

---

**Built with ❤️ for Ghana's agricultural commerce future**
