# BFNG Platform - Implementation Guide

## 🚀 Quick Start (5 Minutes)

### 1. Prerequisites Check
```bash
node --version  # Should be 18+
psql --version  # Should be 14+
```

### 2. Clone & Install
```bash
cd bfng-platform
npm install
```

### 3. Database Setup
```bash
# Create database
createdb bfng

# Copy environment file
cp .env.example .env.local

# Edit .env.local with your database URL
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/bfng"

# Run migrations
npx prisma migrate dev

# Seed sample data
npx prisma db seed
```

### 4. Start Development Server
```bash
npm run dev
```

Visit http://localhost:3000

### 5. Login
- **Admin**: admin@bfng.com.gh / admin123
- **Customer**: akua.mensah@gmail.com / customer123
- **Vendor**: ghana.natural@example.com / vendor123

---

## 📋 Complete Setup Guide

### Step 1: Environment Configuration

Create `.env.local` with these essential variables:

```env
# Database (REQUIRED)
DATABASE_URL="postgresql://user:password@localhost:5432/bfng"

# Auth (REQUIRED)
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# Paystack (for payments)
PAYSTACK_SECRET_KEY="get from paystack.com"
PAYSTACK_PUBLIC_KEY="get from paystack.com"
```

### Step 2: Database Schema

```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init

# View database in browser
npx prisma studio
```

### Step 3: Seed Initial Data

```bash
# Run seed script
npx prisma db seed

# This creates:
# - Admin user
# - Sample customer
# - Sample vendor
# - Product categories
# - Sample products
# - System configuration
```

### Step 4: Verify Installation

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Build
npm run build
```

---

## 🏗️ Project Structure Guide

```
bfng-platform/
│
├── app/                          # Next.js App Router
│   ├── (customer)/              # Customer-facing pages
│   │   ├── page.tsx            # Storefront
│   │   ├── products/           # Product browsing
│   │   ├── cart/               # Shopping cart
│   │   └── subscriptions/      # Subscription management
│   │
│   ├── (admin)/                # Admin dashboard
│   │   ├── dashboard/          # Main admin page
│   │   ├── orders/             # Order management
│   │   ├── sourcing/           # Bulk buying interface
│   │   ├── deliveries/         # Delivery management
│   │   └── analytics/          # Reports & analytics
│   │
│   ├── (vendor)/               # Vendor portal
│   │   ├── dashboard/          # Vendor dashboard
│   │   ├── products/           # Product management
│   │   └── sales/              # Sales tracking
│   │
│   └── api/                    # API routes
│       ├── orders/             # Order endpoints
│       ├── subscriptions/      # Subscription endpoints
│       ├── products/           # Product endpoints
│       ├── payments/           # Payment webhooks
│       └── cron/               # Scheduled jobs
│
├── lib/                         # Core business logic
│   ├── engines/                # Business logic engines
│   │   ├── order-engine.ts     # Order state machine
│   │   ├── subscription-engine.ts  # Subscription logic
│   │   └── payment-engine.ts   # Payment processing
│   │
│   ├── prisma.ts               # Prisma client
│   ├── auth.ts                 # NextAuth config
│   └── utils.ts                # Utilities
│
├── components/                  # React components
│   ├── ui/                     # Base UI components
│   ├── customer/               # Customer components
│   ├── admin/                  # Admin components
│   └── shared/                 # Shared components
│
├── prisma/                      # Database
│   ├── schema.prisma           # Database schema
│   ├── migrations/             # Migration files
│   └── seed.ts                 # Seed data
│
├── public/                      # Static files
│   ├── images/
│   └── icons/
│
└── types/                       # TypeScript types
    └── index.ts
```

---

## 🔧 Development Workflow

### Daily Development

```bash
# Start dev server
npm run dev

# Open Prisma Studio (database GUI)
npx prisma studio

# Watch for type errors
npm run type-check -- --watch
```

### Making Database Changes

```bash
# 1. Edit prisma/schema.prisma

# 2. Create migration
npx prisma migrate dev --name descriptive_name

# 3. Update seed if needed
# Edit prisma/seed.ts

# 4. Re-seed
npx prisma db seed
```

### Adding New Features

1. **Define Database Schema**
   - Edit `prisma/schema.prisma`
   - Run migration

2. **Create Business Logic**
   - Add to appropriate engine in `lib/engines/`
   - Follow state machine patterns

3. **Build API Routes**
   - Create in `app/api/`
   - Add authentication checks
   - Validate input

4. **Create UI Components**
   - Add to `components/`
   - Use existing design system

5. **Build Pages**
   - Create in appropriate `app/(role)/` directory
   - Connect to API routes

---

## 🎯 Key Implementation Patterns

### Order Creation Pattern

```typescript
// 1. Customer selects products
// 2. Add to cart
// 3. Submit order

// In your API route:
import { OrderEngine } from '@/lib/engines/order-engine';

const order = await OrderEngine.createOrder({
  customerId: session.user.customerId,
  addressId: body.addressId,
  items: body.items.map(item => ({
    productId: item.productId,
    quantity: item.quantity,
    unitPrice: item.price,
  })),
  deliveryFee: 20,
});

// Auto-confirm
await OrderEngine.confirmOrder(order.id);
```

### Subscription Pattern

```typescript
import { SubscriptionEngine } from '@/lib/engines/subscription-engine';

// Create subscription
const subscription = await SubscriptionEngine.createSubscription({
  customerId: customerId,
  name: "Weekly Fresh Box",
  frequency: "WEEKLY",
  items: [
    { productId: "p1", quantity: 2 },
    { productId: "p2", quantity: 5 },
  ],
  basePrice: 150,
  startDate: new Date(),
});

// Run daily cron to generate orders
// app/api/cron/generate-subscription-orders/route.ts
export async function GET() {
  const result = await SubscriptionEngine.generateUpcomingOrders();
  return Response.json(result);
}
```

### State Transition Pattern

```typescript
// Admin marks items as sourced
await OrderEngine.updateSourcingStatus(orderId, [
  { 
    itemId: "item1", 
    isSourced: true, 
    sourcedQty: 5 
  },
  { 
    itemId: "item2", 
    isSourced: false,
    unavailable: true 
  },
]);

// This automatically:
// - Checks if all items handled
// - Moves to SUBSTITUTION_REQUIRED if needed
// - Moves to READY_FOR_PACKING if all sourced
```

---

## 🔐 Security Implementation

### Authentication Middleware

```typescript
// lib/auth.ts
import { getServerSession } from 'next-auth';

export async function requireAuth(roles: UserRole[]) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    throw new Error('Unauthorized');
  }
  
  if (!roles.includes(session.user.role)) {
    throw new Error('Forbidden');
  }
  
  return session;
}

// Usage in API routes
const session = await requireAuth(['ADMIN', 'SHOPPER']);
```

### Input Validation

```typescript
import { z } from 'zod';

const orderSchema = z.object({
  addressId: z.string().cuid(),
  items: z.array(z.object({
    productId: z.string().cuid(),
    quantity: z.number().positive(),
  })).min(1),
  customerNotes: z.string().optional(),
});

const validated = orderSchema.parse(body);
```

---

## 📱 WhatsApp Integration (Future)

### Webhook Setup

```typescript
// app/api/webhooks/whatsapp/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  
  // Parse WhatsApp message
  const message = body.entry[0].changes[0].value.messages[0];
  
  // Process order from WhatsApp
  if (message.text.body.includes('order')) {
    // Create order
    // Send confirmation
  }
}
```

---

## 📊 Analytics & Reporting

### Order Statistics

```typescript
import { OrderEngine } from '@/lib/engines/order-engine';

const stats = await OrderEngine.getOrderStats();

// Returns:
// {
//   total: 150,
//   byStatus: {
//     COMPLETED: 100,
//     IN_SOURCING: 20,
//     // ...
//   },
//   totalRevenue: 45000
// }
```

### Subscription Metrics

```typescript
import { SubscriptionEngine } from '@/lib/engines/subscription-engine';

const metrics = await SubscriptionEngine.getSubscriptionMetrics();

// Returns:
// {
//   total: 50,
//   active: 42,
//   byFrequency: [...],
//   totalRevenue: 12000,
//   churnRate: 4.5
// }
```

---

## 🚀 Production Deployment

### Pre-deployment Checklist

- [ ] All environment variables set in production
- [ ] Database migrations run
- [ ] Seed data loaded (if needed)
- [ ] Payment webhook configured
- [ ] Email service configured
- [ ] File storage configured
- [ ] Cron jobs scheduled
- [ ] Error tracking setup (Sentry)
- [ ] SSL certificate configured
- [ ] Domain configured

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Configure environment variables in Vercel dashboard
```

### Database Migration in Production

```bash
# Run migrations (safe)
npx prisma migrate deploy

# DO NOT run 'prisma migrate dev' in production!
```

### Setting up Cron Jobs

In `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/generate-subscription-orders",
      "schedule": "0 8 * * *"
    }
  ]
}
```

---

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
pg_isready

# Check connection
psql -d bfng -c "SELECT 1"

# Reset database (CAUTION: deletes all data)
npx prisma migrate reset
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules package-lock.json
npm install

# Regenerate Prisma client
npx prisma generate
```

### Type Errors

```bash
# Full type check
npm run type-check

# Check specific file
npx tsc --noEmit path/to/file.ts
```

---

## 📚 Additional Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js Docs](https://next-auth.js.org)
- [Paystack Docs](https://paystack.com/docs)

### Ghana-Specific
- Paystack Ghana setup
- Mobile Money integration
- Ghana Postal GPS system

---

## 🆘 Getting Help

### Common Questions

**Q: How do I add a new product category?**
```typescript
await prisma.category.create({
  data: {
    name: "New Category",
    slug: "new-category",
    description: "Category description",
  },
});
```

**Q: How do I manually create a subscription order?**
```typescript
// The system auto-generates, but you can manually trigger:
await SubscriptionEngine.generateUpcomingOrders();
```

**Q: How do I handle substitutions?**
```typescript
// 1. Shopper marks item unavailable
await OrderEngine.updateSourcingStatus(orderId, [
  { itemId, unavailable: true }
]);

// 2. Create substitution
await prisma.substitution.create({
  data: {
    orderId,
    orderItemId: itemId,
    originalProductId,
    substituteProductId,
    // ...
  },
});

// 3. Customer approves via UI
// 4. Order continues
```

---

## ✅ Next Steps

1. **Customize Design**
   - Update colors in `tailwind.config.ts`
   - Add your logo
   - Customize email templates

2. **Configure Payments**
   - Get Paystack keys
   - Test payment flow
   - Configure webhooks

3. **Setup WhatsApp**
   - Get WhatsApp Business API access
   - Configure webhooks
   - Create message templates

4. **Add Content**
   - Upload product images
   - Write product descriptions
   - Create vendor profiles

5. **Test Workflows**
   - Create test orders
   - Test subscription flow
   - Test bulk buying cycle

6. **Go Live!**
   - Deploy to production
   - Configure domain
   - Train staff
   - Launch! 🎉

---

**Need help? Contact: dev@bfng.com.gh**
