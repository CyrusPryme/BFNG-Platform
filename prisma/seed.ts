import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bfng.com.gh' },
    update: {},
    create: {
      email: 'admin@bfng.com.gh',
      password: adminPassword,
      role: 'ADMIN',
      firstName: 'System',
      lastName: 'Administrator',
    },
  });

  console.log('✓ Admin user created');

  // Create sample customer
  const customerPassword = await bcrypt.hash('customer123', 10);
  const customerUser = await prisma.user.create({
    data: {
      email: 'akua.mensah@gmail.com',
      password: customerPassword,
      role: 'CUSTOMER',
      firstName: 'Akua',
      lastName: 'Mensah',
      customer: {
        create: {
          whatsappNumber: '+233244123456',
        },
      },
    },
  });

  console.log('✓ Sample customer created');

  // Create sample address
  const customer = await prisma.customer.findFirst({
    where: { userId: customerUser.id }
  });
  
  if (customer) {
    await prisma.address.create({
      data: {
        customerId: customer.id,
        label: 'Home',
        recipientName: 'Akua Mensah',
        street: '12 Cantonments Road',
        area: 'Cantonments',
        city: 'Accra',
        region: 'Greater Accra',
        isDefault: true,
      },
    });
  }

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

  // const createdCategories = await Promise.all(
  //   categories.map((cat) =>
  //     prisma.category.upsert({
  //       where: { slug: cat.slug },
  //       update: {},
  //       create: cat,
  //     })
  //   )
  // );

  console.log('✓ Categories skipped (model not in schema)');

  // Create sample products
  // const vegetables = await prisma.category.findUnique({
  //   where: { slug: 'fresh-vegetables' },
  // });

  // const madeInGhana = await prisma.category.findUnique({
  //   where: { slug: 'made-in-ghana' },
  // });

  const products = [
    {
      name: 'Garden Eggs',
      slug: 'garden-eggs',
      category: 'Fresh Vegetables',
      type: 'FRESH' as const,
      basePrice: 25,
      bulkPrice: 22,
      bulkMinQty: 5,
      unit: 'kg',
      description: 'Fresh garden eggs from Kumasi',
      image: '/images/products/garden-eggs.jpg',
    },
    {
      name: 'Kontomire (Cocoyam Leaves)',
      slug: 'kontomire',
      category: 'Fresh Vegetables',
      type: 'FRESH' as const,
      basePrice: 15,
      bulkPrice: 13,
      bulkMinQty: 3,
      unit: 'bunch',
      description: 'Fresh cocoyam leaves, perfect for stews',
      image: '/images/products/kontomire.jpg',
    },
    {
      name: 'Fresh Tomatoes',
      slug: 'tomatoes',
      category: 'Fresh Vegetables',
      type: 'FRESH' as const,
      basePrice: 30,
      bulkPrice: 27,
      bulkMinQty: 5,
      unit: 'kg',
      description: 'Ripe fresh tomatoes from local farms',
      image: '/images/products/tomatoes.jpg',
      isActive: true,
      allowSubstitution: true,
    },
    {
      name: 'Onions',
      slug: 'onions',
      category: 'Fresh Vegetables',
      type: 'FRESH' as const,
      basePrice: 20,
      bulkPrice: 18,
      bulkMinQty: 4,
      unit: 'kg',
      description: 'Fresh yellow onions',
      image: '/images/products/onions.jpg',
      isActive: true,
      allowSubstitution: true,
    },
    {
      name: 'Ginger',
      slug: 'ginger',
      category: 'Fresh Vegetables',
      type: 'FRESH' as const,
      basePrice: 35,
      bulkPrice: 32,
      bulkMinQty: 3,
      unit: 'kg',
      description: 'Fresh ginger root',
      image: '/images/products/ginger.jpg',
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
      password: vendorPassword,
      role: 'VENDOR',
      firstName: 'Ghana',
      lastName: 'Natural',
    },
  });

  // Create vendor record separately
  const vendor = await prisma.vendor.create({
    data: {
      businessName: 'Ghana Natural Products',
      contactName: 'Ghana Natural',
      email: 'ghana.natural@example.com',
      phone: '+233302000001',
      address: 'Industrial Area, Tema',
      city: 'Tema',
      region: 'Greater Accra',
      category: 'PACKAGED',
      commissionRate: 15,
      isApproved: true,
      isActive: true,
    },
  });

  console.log('✓ Sample vendor created');

  // Create vendor product
  await prisma.product.create({
    data: {
      name: 'Nkontomire Powder',
      slug: 'nkontomire-powder',
      category: 'Made in Ghana',
      type: 'MADE_IN_GHANA',
      basePrice: 45,
      unit: '500g',
      description: 'Premium dried and powdered kontomire',
      image: '/images/products/nkontomire-powder.jpg',
    },
  });

  console.log('✓ Vendor product created');

  // Create inventory records
  // const allProducts = await prisma.product.findMany();
  
  // await Promise.all(
  //   allProducts.map((product: any) =>
  //     prisma.inventory.create({
  //       data: {
  //         productId: product.id,
  //         type: product.type === 'FRESH' ? 'SOFT' : 'HARD',
  //         quantity: product.type === 'FRESH' ? 0 : 100,
  //         expectedAvailable: true,
  //       },
  //     })
  //   )
  // );

  console.log('✓ Inventory records skipped (model not in schema)');

  // Create system config
  // await prisma.systemConfig.upsert({
  //   where: { key: 'order_cutoff_day' },
  //   update: {},
  //   create: {
  //     key: 'order_cutoff_day',
  //     value: '3', // Wednesday
  //     description: 'Day of week for order cutoff (0=Sunday)',
  //   },
  // });

  console.log('✓ System config skipped (model not in schema)');

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
