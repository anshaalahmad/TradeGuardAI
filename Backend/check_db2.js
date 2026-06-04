require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    const allWallets = await prisma.wallet.findMany();
    console.log('All Wallets:', JSON.stringify(allWallets, null, 2));
    
    const users = await prisma.user.findMany({ select: { id: true, email: true } });
    console.log('Users:', JSON.stringify(users, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
run();
