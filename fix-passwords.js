// Fix the password hashes in our database
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'db.json');

// Read current data
const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Generate correct password hashes
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

async function fixPasswords() {
  console.log('🔧 Fixing password hashes...');
  
  // Fix admin password
  const adminHash = await hashPassword('admin123');
  data.users[0].password = adminHash;
  
  // Fix customer password  
  const customerHash = await hashPassword('customer123');
  data.users[1].password = customerHash;
  
  // Fix vendor password
  const vendorHash = await hashPassword('vendor123');
  data.users[2].password = vendorHash;
  
  // Write back to file
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  
  console.log('✅ Password hashes fixed!');
  console.log('\n📝 Updated Credentials:');
  console.log('Admin: admin@bfng.com.gh / admin123');
  console.log('Customer: akua.mensah@gmail.com / customer123');
  console.log('Vendor: ghana.natural@example.com / vendor123');
}

fixPasswords().catch(console.error);
