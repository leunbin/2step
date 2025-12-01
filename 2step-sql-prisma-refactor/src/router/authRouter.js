const express = require("express");
const { authController } = require("../controller");
const { authMiddleware } = require("../middleware");

const authRouter = express.Router();

authRouter.post(
  "/register",
  authController.postRegister
);

authRouter.post(
  "/login",
  authController.postLogIn
);

authRouter.post(
  "/withdraw",
  authMiddleware.isAuthenticated,
  authController.postWithdraw
);

module.exports = authRouter;
