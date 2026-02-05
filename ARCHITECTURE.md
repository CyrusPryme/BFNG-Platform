# BFNG Platform - System Architecture Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Database Schema](#database-schema)
3. [Order State Machine](#order-state-machine)
4. [Subscription Engine](#subscription-engine)
5. [API Routes](#api-routes)
6. [Business Logic Engines](#business-logic-engines)
7. [Weekly Operations Cycle](#weekly-operations-cycle)
8. [Deployment Guide](#deployment-guide)

---

## System Overview

### Architecture Layers

```
┌─────────────────────────────────────────────────────┐
│                 PRESENTATION LAYER                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │ Customer │  │  Admin   │  │  Vendor  │         │
│  │   App    │  │Dashboard │  │  Portal  │         │
│  └──────────┘  └──────────┘  └──────────┘         │
└─────────────────────────────────────────────────────┘
                       ↕
┌─────────────────────────────────────────────────────┐
│                   API LAYER                         │
│  ┌──────────────────────────────────────┐          │
│  │      Next.js API Routes              │          │
│  │  /api/orders | /api/subscriptions    │          │
│  │  /api/products | /api/payments       │          │
│  └──────────────────────────────────────┘          │
└─────────────────────────────────────────────────────┘
                       ↕
┌─────────────────────────────────────────────────────┐
│                 BUSINESS LOGIC LAYER                │
│  ┌────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │   Order    │  │ Subscription │  │  Payment   │ │
│  │   Engine   │  │    Engine    │  │   Engine   │ │
│  └────────────┘  └──────────────┘  └────────────┘ │
└─────────────────────────────────────────────────────┘
                       ↕
┌─────────────────────────────────────────────────────┐
│                   DATA LAYER                        │
│  ┌──────────────────────────────────────┐          │
│  │      PostgreSQL + Prisma ORM         │          │
│  │  Users | Orders | Products | etc.    │          │
│  └──────────────────────────────────────┘          │
└─────────────────────────────────────────────────────┘
```

---

## Database Schema

### Core Entities

#### Users & Authentication
```prisma
User {
  id: String (cuid)
  email: String (unique)
  phone: String (unique)
  password: String (hashed)
  role: UserRole (CUSTOMER | ADMIN | SHOPPER | VENDOR | DELIVERY)
  firstName: String
  lastName: String
  isActive: Boolean
}
```

#### Customers
```prisma
Customer {
  id: String
  userId: String (FK → User)
  isDiaspora: Boolean
  isInstitutional: Boolean
  institutionName: String?
  allowPostpaid: Boolean
  whatsappNumber: String
}
```

#### Products
```prisma
Product {
  id: String
  name: String
  slug: String (unique)
  categoryId: String (FK → Category)
  type: ProductType (FRESH | PACKAGED | MADE_IN_GHANA)
  basePrice: Float
  bulkPrice: Float?
  bulkMinQty: Int?
  unit: String (kg, bunch, bag, piece)
  vendorId: String? (FK → Vendor)
  commissionRate: Float?
  isActive: Boolean
  allowSubstitution: Boolean
}
```

#### Orders
```prisma
Order {
  id: String
  orderNumber: String (unique)
  customerId: String (FK → Customer)
  addressId: String (FK → Address)
  status: OrderStatus
  subtotal: Float
  deliveryFee: Float
  discount: Float
  total: Float
  weekNumber: Int (ISO week)
  buyingCycleDate: DateTime (Thursday)
  subscriptionId: String? (FK → Subscription)
  isSubscriptionOrder: Boolean
}
```

#### Subscriptions
```prisma
Subscription {
  id: String
  customerId: String (FK → Customer)
  name: String
  frequency: SubscriptionFrequency (WEEKLY | BIWEEKLY | MONTHLY)
  status: SubscriptionStatus (ACTIVE | PAUSED | CANCELLED)
  basePrice: Float
  deliveryFee: Float
  startDate: DateTime
  nextOrderDate: DateTime
  allowEdits: Boolean
  allowSkip: Boolean
}
```

### Key Relationships

```
Customer → Orders (1:N)
Customer → Subscriptions (1:N)
Customer → Addresses (1:N)

Order → OrderItems (1:N)
Order → Substitutions (1:N)
Order → Payments (1:N)
Order → Delivery (1:1)

Subscription → SubscriptionItems (1:N)
Subscription → Orders (1:N)
Subscription → SubscriptionSkips (1:N)

Product → OrderItems (1:N)
Product → Inventory (1:N)
Product → Vendor (N:1)

Vendor → Products (1:N)
Vendor → VendorCommissions (1:N)
```

---

## Order State Machine

### State Diagram

```
RECEIVED
    ↓
CONFIRMED
    ↓
AWAITING_PAYMENT (if not postpaid)
    ↓
PAID
    ↓
IN_SOURCING ────────────┐
    ↓                   ↓
    ↓            SUBSTITUTION_REQUIRED
    ↓                   ↓
    ↓            (Customer Approves)
    ↓                   ↓
READY_FOR_PACKING ←─────┘
    ↓
PACKED
    ↓
OUT_FOR_DELIVERY
    ↓
DELIVERED
    ↓
COMPLETED

Exit States: CANCELLED | FAILED | REFUNDED
```

### Valid Transitions

```typescript
const VALID_TRANSITIONS = {
  RECEIVED: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['AWAITING_PAYMENT', 'PAID', 'CANCELLED'],
  AWAITING_PAYMENT: ['PAID', 'FAILED', 'CANCELLED'],
  PAID: ['IN_SOURCING', 'REFUNDED', 'CANCELLED'],
  IN_SOURCING: ['SUBSTITUTION_REQUIRED', 'READY_FOR_PACKING', 'FAILED'],
  SUBSTITUTION_REQUIRED: ['IN_SOURCING', 'READY_FOR_PACKING', 'CANCELLED'],
  READY_FOR_PACKING: ['PACKED', 'FAILED'],
  PACKED: ['OUT_FOR_DELIVERY', 'FAILED'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'FAILED'],
  DELIVERED: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
  FAILED: ['REFUNDED'],
  REFUNDED: [],
};
```

### Automatic Transitions

1. **CONFIRMED → AWAITING_PAYMENT**: If customer requires payment
2. **CONFIRMED → PAID**: If customer is postpaid
3. **PAID → IN_SOURCING**: Automatic after payment
4. **PACKED → OUT_FOR_DELIVERY**: When delivery is created

---

## Subscription Engine

### Auto-Generation Flow

```
1. Daily Cron Job Runs
   ↓
2. Check Active Subscriptions
   ↓
3. Filter: nextOrderDate ≤ Cutoff (Wednesday)
   ↓
4. For Each Subscription:
   ├─ Check if date is skipped
   ├─ Check if order already exists
   ├─ Get current product prices
   ├─ Create order
   └─ Advance nextOrderDate
   ↓
5. Log Results
```

### Subscription Lifecycle

```typescript
// Create subscription
const subscription = await SubscriptionEngine.createSubscription({
  customerId: "xxx",
  name: "Weekly Fresh Box",
  frequency: "WEEKLY",
  items: [
    { productId: "p1", quantity: 2 },
    { productId: "p2", quantity: 5 }
  ],
  basePrice: 150,
  deliveryFee: 20,
  startDate: new Date(),
});

// Auto-generate orders (runs daily)
await SubscriptionEngine.generateUpcomingOrders();

// Pause subscription
await SubscriptionEngine.pauseSubscription(subscriptionId);

// Resume subscription
await SubscriptionEngine.resumeSubscription(subscriptionId);

// Skip a specific date
await SubscriptionEngine.skipDate(subscriptionId, skipDate, "On vacation");

// Update items
await SubscriptionEngine.updateItems(subscriptionId, [
  { productId: "p3", quantity: 3 }
]);
```

---

## API Routes

### Orders API

#### GET /api/orders
```typescript
Query Parameters:
- status: OrderStatus (optional)
- customerId: string (optional)
- weekNumber: number (optional)

Response:
{
  orders: Order[]
}
```

#### POST /api/orders
```typescript
Body:
{
  addressId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  deliveryFee?: number;
  discount?: number;
  customerNotes?: string;
  subscriptionId?: string;
}

Response:
{
  order: Order;
  message: string;
}
```

#### PATCH /api/orders/:id
```typescript
Body:
{
  status: OrderStatus;
  metadata?: Record<string, any>;
}

Response:
{
  order: Order;
  message: string;
}
```

### Subscriptions API

#### GET /api/subscriptions
```typescript
Query Parameters:
- customerId: string (optional)
- status: SubscriptionStatus (optional)

Response:
{
  subscriptions: Subscription[]
}
```

#### POST /api/subscriptions
```typescript
Body:
{
  name: string;
  frequency: SubscriptionFrequency;
  items: Array<{
    productId: string;
    quantity: number;
    isFlexible?: boolean;
  }>;
  basePrice: number;
  deliveryFee?: number;
  startDate: Date;
  addressId?: string;
}

Response:
{
  subscription: Subscription;
  message: string;
}
```

### Products API

#### GET /api/products
```typescript
Query Parameters:
- category: string (optional)
- type: ProductType (optional)
- search: string (optional)

Response:
{
  products: Product[]
}
```

---

## Business Logic Engines

### OrderEngine

**Key Methods:**
- `createOrder()` - Create new order with items
- `transitionStatus()` - Move order through state machine
- `confirmOrder()` - Confirm and start processing
- `updateSourcingStatus()` - Update item availability
- `getOrdersForBulkBuying()` - Get orders for Thursday
- `getBulkShoppingList()` - Aggregate items for bulk buying

**Example Usage:**
```typescript
// Create order
const order = await OrderEngine.createOrder({
  customerId: "cust123",
  addressId: "addr456",
  items: [
    { productId: "prod1", quantity: 5, unitPrice: 25 }
  ],
  deliveryFee: 20,
});

// Confirm order
await OrderEngine.confirmOrder(order.id);

// Update sourcing
await OrderEngine.updateSourcingStatus(order.id, [
  { itemId: "item1", isSourced: true, sourcedQty: 5 }
]);
```

### SubscriptionEngine

**Key Methods:**
- `createSubscription()` - Create recurring order setup
- `generateUpcomingOrders()` - Auto-create orders for upcoming cycle
- `pauseSubscription()` - Temporarily stop auto-generation
- `resumeSubscription()` - Resume auto-generation
- `skipDate()` - Skip a specific delivery date
- `updateItems()` - Modify subscription contents

**Example Usage:**
```typescript
// Run daily to generate orders
const result = await SubscriptionEngine.generateUpcomingOrders();
console.log(`Created ${result.created} orders`);

// Pause customer's subscription
await SubscriptionEngine.pauseSubscription("sub123");
```

---

## Weekly Operations Cycle

### Monday - Wednesday: Order Collection

```
1. Customers place orders (web, WhatsApp, phone)
2. Subscriptions auto-generate on Tuesday
3. Admin confirms orders
4. Payments processed
5. Cutoff: Wednesday 11:59 PM
```

### Thursday: Bulk Buying

```
1. Generate bulk shopping list
   - Aggregate all PAID orders
   - Group by product
   - Calculate total quantities

2. Market shopping
   - Shoppers receive lists
   - Source items
   - Mark as sourced/unavailable
   - Propose substitutions

3. Substitution approvals
   - Customers approve/reject via dashboard
   - Orders move to READY_FOR_PACKING
```

### Thursday - Friday: Packing & Quality

```
1. Pack orders
   - Quality checks
   - Weigh items
   - Photo documentation
   - Mark as PACKED

2. Delivery assignment
   - Route optimization
   - Assign to drivers
   - Generate delivery notes
```

### Friday - Saturday: Deliveries

```
1. Out for delivery
   - Track location
   - Customer notifications
   - Proof of delivery (photo + signature)

2. Mark as DELIVERED
   - Customer confirmation
   - Move to COMPLETED

3. Calculate vendor commissions
```

### Sunday: Analytics & Planning

```
1. Review week performance
2. Calculate metrics
3. Vendor payouts
4. Plan next week
```

---

## Deployment Guide

### Prerequisites

```bash
# Required
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

# Recommended
- Docker
- Vercel account
- AWS S3 bucket
- Paystack account
```

### Environment Setup

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/bfng"

# Authentication
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="https://yourdomain.com"

# Paystack
PAYSTACK_SECRET_KEY="sk_live_xxx"
PAYSTACK_PUBLIC_KEY="pk_live_xxx"

# Email
RESEND_API_KEY="re_xxx"
RESEND_FROM_EMAIL="noreply@bfng.com.gh"

# Storage
AWS_ACCESS_KEY_ID="xxx"
AWS_SECRET_ACCESS_KEY="xxx"
AWS_REGION="us-east-1"
AWS_BUCKET_NAME="bfng-uploads"

# Optional
SENTRY_DSN="https://xxx@sentry.io/xxx"
```

### Database Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed initial data
npx prisma db seed
```

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Add environment variables in Vercel dashboard
# Settings → Environment Variables
```

### Cron Jobs Setup

Add to Vercel Cron or use external service:

```json
{
  "crons": [
    {
      "path": "/api/cron/generate-subscription-orders",
      "schedule": "0 8 * * *"
    },
    {
      "path": "/api/cron/check-subscription-health",
      "schedule": "0 0 * * 0"
    }
  ]
}
```

### Monitoring

```typescript
// Sentry integration
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

---

## Security Considerations

### Authentication
- NextAuth.js with JWT
- Role-based access control (RBAC)
- Session management

### Data Protection
- Password hashing with bcrypt
- SQL injection prevention (Prisma)
- XSS protection
- CSRF tokens

### Payment Security
- PCI compliance via Paystack
- No card storage
- Webhook signature verification

### API Security
- Rate limiting
- Input validation (Zod)
- Authentication middleware
- Audit logging

---

## Performance Optimization

### Database
- Indexes on foreign keys
- Composite indexes for queries
- Connection pooling
- Query optimization

### Caching
- API route caching
- Static page generation
- Image optimization

### Frontend
- Code splitting
- Lazy loading
- Image optimization
- Bundle size monitoring

---

## Testing Strategy

### Unit Tests
```bash
npm run test
```

### Integration Tests
- API endpoint testing
- Database operations
- State machine transitions

### E2E Tests
```bash
npm run test:e2e
```

---

## Support & Maintenance

### Logging
- Application logs (Winston)
- Audit trail (database)
- Error tracking (Sentry)

### Backups
- Daily database backups
- Weekly full backups
- Point-in-time recovery

### Updates
- Security patches
- Dependency updates
- Feature releases

---

**For additional support, contact:** support@bfng.com.gh
