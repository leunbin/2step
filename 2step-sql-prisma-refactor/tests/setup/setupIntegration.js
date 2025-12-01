const { bootstrap } = require("../../src/app");
const { clearDatabase, prisma } = require("../utils/testUtils");

beforeAll(async () => {
  global.__APP__ = await bootstrap();
});

beforeEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});
