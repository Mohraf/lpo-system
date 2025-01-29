import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient({
//   log: ['query', 'info', 'warn', 'error'],
// });

// // Test connection on startup
// async function testConnection() {
//   try {
//     await prisma.$connect();
//     console.log('✅ Database connected successfully');
//     await prisma.$disconnect();
//   } catch (error) {
//     console.error('❌ Database connection error:', error);
//     process.exit(1);
//   }
// }

// testConnection();

// export { prisma };