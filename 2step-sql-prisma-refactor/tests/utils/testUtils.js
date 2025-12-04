const prisma = require("../../src/prismaClient");

console.log("Test Client Init URL:", process.env.DATABASE_URL);


async function clearDatabase() {
  await prisma.orderItem.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.delivery.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productOption.deleteMany();
  await prisma.product.deleteMany();
  await prisma.address.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
}

module.exports = {
  prisma,
  clearDatabase,
};
