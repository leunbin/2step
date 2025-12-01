const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userDAO } = require("../data-access");
const config = require("../config");
const AppError = require("../misc/AppError");
const commonErrors = require("../misc/commonErrors");

class AuthService {
  async signUp({ email, password, isAdmin, firstName, lastName, address }) {
    const existingUser = await userDAO.findByEmail(email);
    if (existingUser !== null) {
      throw new AppError(
        commonErrors.inputError,
        "이미 존재하는 이메일 입니다",
        400
      );
    }
    //새로운 유저
    const hashedPassword = await bcrypt.hash(password, 15);

    const newUser = await userDAO.create({
      email,
      password: hashedPassword,
      isAdmin,
      firstName,
      lastName,
      address,
    });

    return {
      id: newUser._id,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      address: newUser.address,
    };
  }

  async signIn({ email, plainPassword }) {
    const user = await userDAO.findByEmail(email);
    if (user === null) {
      throw new AppError(
        commonErrors.resourceNotFoundError,
        "이메일 또는 패스워드가 잘못 되었습니다.",
        400
      );
    }

    const isPasswordValid = await bcrypt.compare(plainPassword, user.password);
    if (!isPasswordValid) {
      throw new AppError(
        commonErrors.resourceNotFoundError,
        "이메일 또는 패스워드가 잘못 되었습니다",
        400
      );
    }
    const tokenPayload = {
      id: user._id,
      email,
      isAdmin: user.isAdmin,
    };
    const encodedToken = await new Promise((resolve, reject) => {
      jwt.sign(
        tokenPayload,
        config.jwtSecret,
        { expiresIn: "6h" },
        (error, encoded) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(encoded);
        }
      );
    });
    return encodedToken;
  }

  //회원 탈퇴
  async withdraw(id) {
    const deletedUser = await userDAO.deleteById(id);
    return deletedUser;
  }
}

module.exports = new AuthService();
