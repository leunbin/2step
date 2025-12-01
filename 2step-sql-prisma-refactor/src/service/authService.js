const jwt = require("jsonwebtoken");
const { userDAO, addressDAO } = require("../data-access");
const config = require("../config");
const userService = require("./userService");
const bcrypt = require("bcrypt");
const prisma = require("../prismaClient");
const AppError = require("../misc/AppError");
const commonErrors = require("../misc/commonErrors");

class AuthService {
  async register(payload) {
    //트랜잭션 수행
    const user = await userService.registerUser(payload);

    const tokenPayload = {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    const accessToken = jwt.sign(tokenPayload, config.jwtSecret,{
      expiresIn: config.jwtExpiresIn,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token: accessToken,
    }
  }

  async login({ email, plainPassword }) {
    const user = await userDAO.findByEmail(prisma, email);

    if(!user) {
      throw new AppError(
        commonErrors.businessError,
        "사용자가 없습니다.",
        400
      );
    }

    const isMatch = await bcrypt.compare(plainPassword, user.password);

    if(!isMatch) {
      throw new AppError(
        commonErrors.authenticationError,
        "비밀번호가 일치하지 않습니다.",
        401
      );
    }

    const payload = {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    const accessToken = jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token: accessToken
    }
  }

  async withdraw(userId) {
    try{
      await prisma.$transaction(async (tx) => {
        await userDAO.softDelete(tx, userId);
        
        const address = await addressDAO.findByUserId(tx, userId);

        if(address) {
          await addressDAO.softDelete(tx,userId);
        }
      });

      return true;
    } catch (e) {
      if (e.code === 'P2025') {
        throw new AppError(
          commonErrors.resourceNotFoundError,
          '사용자가 없습니다.',
          404
        )
      }

      throw e;
    }
  }
}

module.exports = new AuthService();
