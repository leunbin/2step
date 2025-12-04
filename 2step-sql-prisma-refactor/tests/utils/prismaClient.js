jest.mock('../../src/prismaClient', () => {
  console.log("🔥 SQLite PrismaClient MOCK APPLIED");

  const { PrismaClient } = require('../generated/sqlite');
  const prisma = new PrismaClient();

  console.log("🔥 SQLite DB URL:", process.env.DATABASE_URL);

  return prisma;
});
