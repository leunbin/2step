const express = require("express");

const authRouter = require("./authRouter");
const userRouter = require("./userRouter");
const orderRouter = require("./orderRouter");
const categoryRouter = require("./categoryRouter");
const productRouter = require("./productRouter");
const adminRouter = require("./adminRouter");

const v1Router = express.Router();

v1Router.use("/auth", authRouter);
v1Router.use("/me", userRouter);
v1Router.use("/orders", orderRouter);
v1Router.use("/categories", categoryRouter);
v1Router.use("/products", productRouter);
v1Router.use("/admin", adminRouter);

module.exports = {
  v1: v1Router
};
