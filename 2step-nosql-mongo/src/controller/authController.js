const { authService } = require("../service");
const utils = require("../misc/utils");
const AppError = require("../misc/AppError");
const commonErrors = require("../misc/commonErrors");

const authController = {
  async postSignUp(req, res, next) {
    try {
      const { email, password, firstName, lastName, address, isAdmin } =
        req.body;

      if (email === undefined) {
        throw new AppError(
          commonErrors.requestValidationError,
          "이메일은 필수값입니다.",
          400
        );
      }
      const newUser = await authService.signUp({
        email,
        password,
        firstName,
        lastName,
        address,
        isAdmin,
      });

      res.status(201).json(utils.buildResponse(newUser));
    } catch (error) {
      next(error);
    }
  },

  async postSignIn(req, res, next) {
    try {
      const { email, password } = req.body;
      const token = await authService.signIn({
        email,
        plainPassword: password,
      });
      res.status(201).json(utils.buildResponse(token));
      console.log("로그인 성공")
    } catch (error) {
      console.log(error)
      next(error);
    }
  },

  async postWithdraw(req, res, next) {
    try {
      const { id } = res.locals.user;
      const deletedUser = await authService.withdraw(id);
      res.json(utils.buildResponse(deletedUser));
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;
