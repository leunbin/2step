const commonErrors = require("../../../src/misc/commonErrors");
const userService = require("../../../src/service/userService");
const { clearDatabase, prisma } = require("../../utils/testUtils")

describe('userService.update', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("User과 Address가 함께 수정된다.", async () => {
    const created =await userService.registerUser({
      email: "email@example.com",
      password: "password1234",
      firstName: "OldUser",
      lastName: "oldLastName",
      address: {
        street: "서울시 구주소",
        detailedAddress: "101동 101호",
        postalCode: "00000",
      }
    });
    
    const userId = created.id;
  
    const payload = {
      firstName: "NewUser",
      lastName: "NewLast",
      address: {
        street: "서울시 신주소",
        detailedAddress: "102동 102호",
        postalCode: "12234"
      }
    };
  
    const updatedUser = await userService.updateUser(userId, payload);
  
    expect(updatedUser.firstName).toBe(payload.firstName);
    expect(updatedUser.lastName).toBe(payload.lastName);
    expect(updatedUser.address.street).toBe(payload.address.street);
    expect(updatedUser.address.detailedAddress).toBe(payload.address.detailedAddress);
    expect(updatedUser.address.postalCode).toBe(payload.address.postalCode);
  
    const userInDb = await prisma.user.findUnique({
      where: { id: updatedUser.id},
      include: { address: true },
    });
  
    expect(userInDb).not.toBeNull();
    expect(userInDb.firstName).toBe(payload.firstName);
    expect(userInDb.lastName).toBe(payload.lastName);
    expect(userInDb.address.street).toBe(payload.address.street);
    expect(userInDb.address.detailedAddress).toBe(payload.address.detailedAddress);
    expect(userInDb.address.postalCode).toBe(payload.address.postalCode);
  })

  test("없는 사용자의 정보 수정 시 `사용자가 없습니다` 에러를 던진다.", async () => {
    const userId = 10;
    const payload = {
      firstName: "NewUser",
      lastName: "NewLast",
      address: {
        street: "서울시 신주소",
        detailedAddress: "102동 102호",
        postalCode: "12234"
      }
    };

    try{
      await userService.updateUser(userId, payload);
    } catch (e) {
      expect(e.name).toBe(commonErrors.resourceNotFoundError);
      expect(e.message).toBe('사용자가 없습니다.');
      expect(e.httpCode).toBe(404);
    }
  })
})
