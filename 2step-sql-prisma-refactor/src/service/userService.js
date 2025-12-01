const { userDAO, addressDAO } = require("../data-access");
const AppError = require("../misc/AppError");
const commonErrors = require("../misc/commonErrors");
const prisma =  require("../prismaClient");
const bcrypt = require("bcrypt");


class UserService {
  async getUserById(id) {
    const result = await userDAO.findById(prisma, id);
    return result;
  }
  
  async registerUser(payload) {
    const { email, password, firstName, lastName, address } = payload;

    const user = await prisma.$transaction(async (tx) => {
      const existing = await userDAO.findByEmail(tx, email);

      if(existing) {
        throw new AppError(
          commonErrors.businessError,
          "이미 존재하는 이메일입니다.",
          400
        )
      }

      const hashed = await bcrypt.hash(password, 10);

      const newUser = await userDAO.createUser(tx, {
        email,
        password: hashed,
        firstName,
        lastName,
      });

      if (address) {
        await addressDAO.createAddress(tx,{
          userId: newUser.id,
          street: address.street,
          detailedAddress: address.detailedAddress,
          postalCode: address.postalCode,
        });
      }

      return newUser; // 트랜잭션 커밋 완료
    });

    return user; // jwt는 바깥에서
  }

  async updateUser(userId, payload) {
    
    const { firstName, lastName, address } = payload;

    try{
      const user = await prisma.$transaction(async (tx) => {  
        await userDAO.updateById(tx, userId, {
          firstName,
          lastName,
        });

        if (address) {
          await addressDAO.updateAddressByUserId(tx, userId, {
            street: address.street,
            detailedAddress: address.detailedAddress,
            postalCode: address.postalCode,
          })
        }


        const result = await userDAO.findById(tx, userId);
        return result
      });

      return user;
    } catch (e) {
      if(e.code === 'P2025') {
        throw new AppError(
          commonErrors.resourceNotFoundError,
          "사용자가 없습니다.",
          404
        )
      }

      throw e;
    }

  }
}

module.exports = new UserService();
