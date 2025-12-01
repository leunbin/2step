const { userService } = require("../service");
const utils = require("../misc/utils");

const userController = {

  async getUserInfo(req, res, next) {
    try {
      const { id } = res.locals.user; // res.locals.user에 저장된 토큰값
      const userInfo = await userService.getUserById(id);
      
      res.status(200).json(utils.buildResponse(userInfo));
    } catch (error) {
      next(error);
    }
  },

  async updateUserInfo(req, res, next) {
    try {
      const { id } = res.locals.user; // res.locals.user에 저장된 토큰값
      const updatedInfo = req.body;
      const updatedUser = await userService.updateUser(id, updatedInfo);
      res.status(200).json(utils.buildResponse(updatedUser));
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;
