import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Test query
    const users = await prisma.user.findMany();
    console.log(`✅ Users table accessible. Found ${users.length} users`);
    
    // Test media query
    const media = await prisma.media.findMany();
    console.log(`✅ Media table accessible. Found ${media.length} media items`);
    
    await prisma.$disconnect();
    console.log('✅ All tests passed!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  }
}

testDatabase();