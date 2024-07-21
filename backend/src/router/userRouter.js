const express = require("express");
const { userController } = require("../controller");
const { authMiddleware } = require("../middleware");

const userRouter = express.Router();

//POST / api /v1 /me
userRouter.get("/", authMiddleware.isAuthenticated, userController.getUserInfo);

//POST / api /v1 /me
userRouter.put(
  "/",
  authMiddleware.isAuthenticated,
  userController.updateUserInfo
);

module.exports = userRouter;
