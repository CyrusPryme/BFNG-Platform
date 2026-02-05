import { UserRole } from '@/lib/roles'

declare module 'next-auth' {
  interface User {
    role: UserRole
    firstName: string
    lastName: string
    customer?: any
    vendor?: any
  }

  interface Session {
    user: {
      id: string
      email: string
      role: UserRole
      firstName: string
      lastName: string
      customer?: any
      vendor?: any
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole
    firstName: string
    lastName: string
    customer?: any
    vendor?: any
  }
}
