# BFNG Platform - Standardized Role Structure

## 🎯 **Final Role Architecture**

The BFNG Platform now uses a standardized, secure role system that prevents client-side role spoofing and ensures consistent role handling across the entire application.

## 📋 **Official User Roles**

### 1. **ADMIN** (`'ADMIN'`)
- **Description**: Full system administrator with complete access to admin panel
- **Access**: Admin dashboard, user management, system settings, analytics
- **Privileges**: Highest level permissions across all modules

### 2. **CUSTOMER** (`'CUSTOMER'`)
- **Description**: Regular customer with shopping and ordering capabilities
- **Access**: Shopping cart, orders, profile management, subscriptions
- **Privileges**: Customer-specific data and features

### 3. **VENDOR** (`'VENDOR'`)
- **Description**: Product vendor with product management capabilities
- **Access**: Vendor dashboard, product management, order fulfillment
- **Privileges**: Vendor-specific product and order management

## 🛡️ **Security Features**

### **Client-Side Protection**
- **Role Constants**: All roles defined in `USER_ROLES` constant
- **Type Safety**: TypeScript interfaces prevent invalid role assignments
- **Validation Functions**: `validateClientSession()` and `validateAdminSession()` prevent spoofing

### **Server-Side Protection**
- **Session Validation**: `validateServerRole()` validates roles server-side
- **Type Guards**: `isAdminUser()` type guard for admin users
- **Permission Matrix**: `ROLE_PERMISSIONS` defines exact permissions per role

## 📁 **Key Files**

### **Core Role System**
- `lib/roles.ts` - Centralized role definitions and validation
- `lib/admin-auth.ts` - Admin-specific authentication utilities
- `types/next-auth.d.ts` - NextAuth type definitions with roles

### **Authentication Components**
- `app/admin/components/AdminAuthGate.tsx` - Admin access control
- `components/layout/Navbar.tsx` - Navigation with role-based links
- `lib/auth.ts` - NextAuth configuration

## 🔄 **Role Migration**

### **Old → New Role Mapping**
- `super_admin` → `ADMIN`
- `admin` → `ADMIN`
- `administrator` → `ADMIN`
- `customer` → `CUSTOMER`
- `client` → `CUSTOMER`
- `vendor` → `VENDOR`
- `supplier` → `VENDOR`

### **Migration Function**
```typescript
import { migrateRole } from '@/lib/roles'

const newRole = migrateRole('super_admin') // Returns 'ADMIN'
```

## 🚫 **Preventing Role Spoofing**

### **Client-Side Validation**
```typescript
import { validateClientSession } from '@/lib/roles'

const sessionValidation = validateClientSession(session)
if (!sessionValidation.isAdmin) {
  // Block admin access
}
```

### **Server-Side Validation**
```typescript
import { requireAdminSession } from '@/lib/admin-auth'

// In API routes
const session = requireAdminSession(req.session)
// Throws error if not admin
```

### **Type Safety**
```typescript
// TypeScript prevents invalid roles
type UserRole = 'ADMIN' | 'CUSTOMER' | 'VENDOR'
const role: UserRole = 'INVALID_ROLE' // ❌ TypeScript error
```

## 🎨 **Role Display**

### **UI Components**
```typescript
import { getRoleDisplay } from '@/lib/roles'

const display = getRoleDisplay('ADMIN')
// Returns: { label: 'Administrator', color: 'bg-red-100 text-red-800', ... }
```

### **Navigation Logic**
```typescript
import { USER_ROLES } from '@/lib/roles'

{session.user?.role === USER_ROLES.ADMIN && (
  <AdminDashboard />
)}
```

## 📊 **Permission Matrix**

| Role | Admin Panel | Shopping | Vendor Portal | Settings |
|------|------------|----------|--------------|----------|
| ADMIN | ✅ | ✅ | ✅ | ✅ |
| CUSTOMER | ❌ | ✅ | ❌ | ❌ |
| VENDOR | ❌ | ✅ | ✅ | ❌ |

## 🔧 **Implementation Examples**

### **Admin Access Check**
```typescript
import { AdminAuthGate } from '@/app/admin/components/AdminAuthGate'

function AdminPage() {
  return (
    <AdminAuthGate>
      <AdminDashboard />
    </AdminAuthGate>
  )
}
```

### **Role-Based Navigation**
```typescript
import { USER_ROLES } from '@/lib/roles'

{session.user?.role === USER_ROLES.ADMIN && (
  <Link href="/admin">Admin Dashboard</Link>
)}
```

### **Permission Validation**
```typescript
import { hasPermission } from '@/lib/roles'

if (hasPermission(userRole, 'admin.settings.write')) {
  // Allow settings modification
}
```

## ✅ **Benefits Achieved**

1. **Consistency**: Single source of truth for all role definitions
2. **Security**: Client-side and server-side validation prevents spoofing
3. **Type Safety**: TypeScript prevents invalid role assignments
4. **Maintainability**: Centralized role system easy to update
5. **Migration**: Built-in migration helpers for legacy roles
6. **Documentation**: Clear role hierarchy and permissions

## 🚀 **Usage Guidelines**

1. **Always** import roles from `@/lib/roles`
2. **Never** use hardcoded role strings
3. **Always** validate roles on both client and server
4. **Use** `validateClientSession()` for client-side checks
5. **Use** `requireAdminSession()` for server-side admin validation

The BFNG Platform now has a robust, secure, and maintainable role system that prevents unauthorized access and ensures consistent role handling across the entire application.
