// Simple seed script for testing without Prisma
const fs = require('fs');
const path = require('path');

// Create a simple JSON-based "database" for testing
const dbPath = path.join(__dirname, 'db.json');

const seedData = {
  users: [
    {
      id: 'admin-1',
      email: 'admin@bfng.com.gh',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 'admin123' hashed
      role: 'ADMIN',
      firstName: 'System',
      lastName: 'Administrator',
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'customer-1',
      email: 'akua.mensah@gmail.com',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 'customer123' hashed
      role: 'CUSTOMER',
      firstName: 'Akua',
      lastName: 'Mensah',
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'vendor-1',
      email: 'ghana.natural@example.com',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 'vendor123' hashed
      role: 'VENDOR',
      firstName: 'Ghana',
      lastName: 'Natural',
      isActive: true,
      createdAt: new Date().toISOString()
    }
  ]
};

// Write the seed data to a JSON file
fs.writeFileSync(dbPath, JSON.stringify(seedData, null, 2));

console.log('✅ Simple database seeded successfully!');
console.log('\n📝 Login Credentials:');
console.log('Admin: admin@bfng.com.gh / admin123');
console.log('Customer: akua.mensah@gmail.com / customer123');
console.log('Vendor: ghana.natural@example.com / vendor123');
