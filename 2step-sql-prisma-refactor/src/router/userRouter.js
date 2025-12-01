const express = require("express");
const { userController } = require("../controller");
const { authMiddleware } = require("../middleware");

const userRouter = express.Router();

//GET / api /me
userRouter.get(
  "/",
  authMiddleware.isAuthenticated,
  userController.getUserInfo
);

//POST /api/me
userRouter.put(
  "/",
  authMiddleware.isAuthenticated,
  userController.updateUserInfo
);

module.exports = userRouter;
