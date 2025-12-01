const { authService } = require("../service");
const utils = require("../misc/utils");

const authController = {

  async postRegister(req, res, next) {
    try {
      const data = req.body;
      const result = await authService.register(data);

      res.status(201).json(utils.buildResponse(result));
    } catch (error) {
      next(error); // 에러 미들웨어로 전달
    }
  },

  async postLogIn(req, res, next) {
    try {
      const { email, password } = req.body;
      const token = await authService.login({
        email,
        plainPassword: password,
      })

      res.status(201).json(utils.buildResponse(token));
    } catch (error) {
      next(error);
    }
  },

  async postWithdraw(req, res, next) {
    try {
      const { id } = res.locals.user;
      const deletedUser = await authService.withdraw(id);

      res.status(201).json(utils.buildResponse(deletedUser));
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;
