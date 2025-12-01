const express = require("express");
const { authController } = require("../controller");
const { authMiddleware } = require("../middleware");

const authRouter = express.Router();

//POST / api /v1 /auth/sign-up
authRouter.post("/sign-up", authController.postSignUp);

//POST / api /v1 /auth/sign-in
authRouter.post("/sign-in", authController.postSignIn);

//POST / api /v1 /auth/withdraw
authRouter.post(
  "/withdraw",
  authMiddleware.isAuthenticated,
  authController.postWithdraw
);

module.exports = authRouter;
