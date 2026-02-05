import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bfng.com.gh' },
    update: {},
    create: {
      email: 'admin@bfng.com.gh',
      phone: '+233200000001',
      password: adminPassword,
      role: 'ADMIN',
      firstName: 'System',
      lastName: 'Administrator',
      emailVerified: new Date(),
    },
  });

  console.log('✓ Admin user created');

  // Create sample customer
  const customerPassword = await bcrypt.hash('customer123', 10);
  const customerUser = await prisma.user.create({
    data: {
      email: 'akua.mensah@gmail.com',
      phone: '+233244123456',
      password: customerPassword,
      role: 'CUSTOMER',
      firstName: 'Akua',
      lastName: 'Mensah',
      emailVerified: new Date(),
      customer: {
        create: {
          isDiaspora: false,
          isInstitutional: false,
          whatsappNumber: '+233244123456',
          preferredDeliveryDay: 'Friday',
        },
      },
    },
  });

  console.log('✓ Sample customer created');

  // Create sample address
  await prisma.address.create({
    data: {
      customerId: customerUser.customer!.id,
      label: 'Home',
      recipientName: 'Akua Mensah',
      recipientPhone: '+233244123456',
      street: '12 Cantonments Road',
      area: 'Cantonments',
      city: 'Accra',
      region: 'Greater Accra',
      landmark: 'Near Trust Hospital',
      gpsAddress: 'GA-123-4567',
      isDefault: true,
    },
  });

  console.log('✓ Sample address created');

  // Create categories
  const categories = [
    {
      name: 'Fresh Vegetables',
      slug: 'fresh-vegetables',
      description: 'Farm-fresh vegetables from Ghanaian markets',
    },
    {
      name: 'Fruits',
      slug: 'fruits',
      description: 'Fresh tropical fruits',
    },
    {
      name: 'Grains & Cereals',
      slug: 'grains-cereals',
      description: 'Rice, maize, millet, and more',
    },
    {
      name: 'Made in Ghana',
      slug: 'made-in-ghana',
      description: 'Locally produced goods',
    },
    {
      name: 'Proteins',
      slug: 'proteins',
      description: 'Meat, fish, and eggs',
    },
    {
      name: 'Dairy & Oils',
      slug: 'dairy-oils',
      description: 'Milk, butter, cooking oils',
    },
  ];

  const createdCategories = await Promise.all(
    categories.map((cat) =>
      prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat,
      })
    )
  );

  console.log('✓ Categories created');

  // Create sample products
  const vegetables = await prisma.category.findUnique({
    where: { slug: 'fresh-vegetables' },
  });

  const madeInGhana = await prisma.category.findUnique({
    where: { slug: 'made-in-ghana' },
  });

  const products = [
    {
      name: 'Garden Eggs',
      slug: 'garden-eggs',
      categoryId: vegetables!.id,
      type: 'FRESH' as const,
      basePrice: 25,
      bulkPrice: 22,
      bulkMinQty: 5,
      unit: 'kg',
      description: 'Fresh garden eggs from Kumasi',
      isActive: true,
      isFeatured: true,
      allowSubstitution: true,
    },
    {
      name: 'Kontomire (Cocoyam Leaves)',
      slug: 'kontomire',
      categoryId: vegetables!.id,
      type: 'FRESH' as const,
      basePrice: 15,
      bulkPrice: 13,
      bulkMinQty: 3,
      unit: 'bunch',
      description: 'Fresh kontomire for light soup',
      isActive: true,
      isFeatured: true,
      allowSubstitution: true,
    },
    {
      name: 'Fresh Tomatoes',
      slug: 'tomatoes',
      categoryId: vegetables!.id,
      type: 'FRESH' as const,
      basePrice: 30,
      bulkPrice: 27,
      bulkMinQty: 5,
      unit: 'kg',
      description: 'Ripe tomatoes',
      isActive: true,
      allowSubstitution: true,
    },
    {
      name: 'Onions',
      slug: 'onions',
      categoryId: vegetables!.id,
      type: 'FRESH' as const,
      basePrice: 20,
      bulkPrice: 18,
      bulkMinQty: 5,
      unit: 'kg',
      description: 'Fresh onions',
      isActive: true,
      allowSubstitution: true,
    },
    {
      name: 'Ginger',
      slug: 'ginger',
      categoryId: vegetables!.id,
      type: 'FRESH' as const,
      basePrice: 35,
      unit: 'kg',
      description: 'Fresh ginger root',
      isActive: true,
      allowSubstitution: false,
    },
  ];

  await Promise.all(
    products.map((product) =>
      prisma.product.upsert({
        where: { slug: product.slug },
        update: {},
        create: product,
      })
    )
  );

  console.log('✓ Sample products created');

  // Create sample vendor
  const vendorPassword = await bcrypt.hash('vendor123', 10);
  const vendorUser = await prisma.user.create({
    data: {
      email: 'ghana.natural@example.com',
      phone: '+233302000001',
      password: vendorPassword,
      role: 'VENDOR',
      firstName: 'Ghana',
      lastName: 'Natural',
      vendor: {
        create: {
          businessName: 'Ghana Natural Products',
          description: 'Premium Made-in-Ghana products',
          phoneNumber: '+233302000001',
          email: 'ghana.natural@example.com',
          address: 'Industrial Area, Tema',
          region: 'Greater Accra',
          isApproved: true,
          isActive: true,
          defaultCommissionRate: 15,
        },
      },
    },
  });

  console.log('✓ Sample vendor created');

  // Create vendor product
  await prisma.product.create({
    data: {
      name: 'Nkontomire Powder',
      slug: 'nkontomire-powder',
      categoryId: madeInGhana!.id,
      type: 'MADE_IN_GHANA',
      basePrice: 45,
      unit: '500g',
      description: 'Premium dried and powdered kontomire',
      vendorId: vendorUser.vendor!.id,
      commissionRate: 15,
      isActive: true,
      isFeatured: true,
      allowSubstitution: false,
    },
  });

  console.log('✓ Vendor product created');

  // Create inventory records
  const allProducts = await prisma.product.findMany();
  
  await Promise.all(
    allProducts.map((product) =>
      prisma.inventory.create({
        data: {
          productId: product.id,
          type: product.type === 'FRESH' ? 'SOFT' : 'HARD',
          quantity: product.type === 'FRESH' ? 0 : 100,
          expectedAvailable: true,
        },
      })
    )
  );

  console.log('✓ Inventory records created');

  // Create system config
  await prisma.systemConfig.upsert({
    where: { key: 'order_cutoff_day' },
    update: {},
    create: {
      key: 'order_cutoff_day',
      value: '3', // Wednesday
      description: 'Day of week for order cutoff (0=Sunday)',
    },
  });

  await prisma.systemConfig.upsert({
    where: { key: 'buying_cycle_day' },
    update: {},
    create: {
      key: 'buying_cycle_day',
      value: '4', // Thursday
      description: 'Day of week for bulk buying (0=Sunday)',
    },
  });

  console.log('✓ System configuration created');

  console.log('🎉 Database seeded successfully!');
  console.log('\n📝 Login Credentials:');
  console.log('Admin: admin@bfng.com.gh / admin123');
  console.log('Customer: akua.mensah@gmail.com / customer123');
  console.log('Vendor: ghana.natural@example.com / vendor123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
