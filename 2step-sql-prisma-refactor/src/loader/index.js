const prisma = require("../prismaClient");

async function load() {
  try {
    await prisma.$connect();
    console.log("✅ Prisma DB connected");
  } catch (err) {
    console.error("❌ Prisma DB connection failed", err);
    process.exit(1);
  }
}

async function unload() {
  try {
    await prisma.$disconnect();
    console.log("🔌 Prisma DB disconnected");
  } catch (err) {
    console.error("❌ Prisma DB disconnection failed", err);
  }
}

module.exports = {
  load,
  unload,
  prisma
};
