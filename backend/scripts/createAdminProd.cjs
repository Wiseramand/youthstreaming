const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('Creating admin user for production...');

    // Admin credentials
    const adminEmail = 'admin@youthangola.com';
    const adminPassword = 'AdminYouth2024!'; // Change this in production!
    const adminName = 'Youth Angola Admin';

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (existingAdmin) {
      console.log('Admin user already exists:', adminEmail);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true,
      }
    });

    // Create admin profile
    await prisma.profile.create({
      data: {
        fullName: adminName,
        avatarUrl: 'https://ui-avatars.com/api/?name=Admin+Youth&background=random',
        bio: 'Administrador do Youth Angola Streaming',
        userId: admin.id,
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('⚠️  Remember to change the password after first login!');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();