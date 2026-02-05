// Test our simple authentication
const { findUserByEmail } = require('./lib/simple-db.js');
const bcrypt = require('bcryptjs');

async function testAuth() {
  console.log('🧪 Testing Authentication...');
  
  // Test finding admin user
  const admin = findUserByEmail('admin@bfng.com.gh');
  console.log('✅ Found admin user:', admin ? admin.email : 'Not found');
  
  if (admin) {
    // Test password verification
    const isValid = await bcrypt.compare('admin123', admin.password);
    console.log('✅ Password verification:', isValid ? 'Valid' : 'Invalid');
    
    console.log('📝 Admin user details:');
    console.log('  - Email:', admin.email);
    console.log('  - Role:', admin.role);
    console.log('  - Name:', admin.firstName, admin.lastName);
    console.log('  - Active:', admin.isActive);
  }
  
  // Test customer user
  const customer = findUserByEmail('akua.mensah@gmail.com');
  console.log('✅ Found customer user:', customer ? customer.email : 'Not found');
  
  if (customer) {
    const isValid = await bcrypt.compare('customer123', customer.password);
    console.log('✅ Customer password verification:', isValid ? 'Valid' : 'Invalid');
  }
  
  console.log('\n🎉 Authentication test completed!');
}

testAuth().catch(console.error);
