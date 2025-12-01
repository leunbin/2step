const jsonwebtoken = require("jsonwebtoken");
const config = require("../config");
const AppError = require("../misc/AppError");
const commonErrors = require("../misc/commonErrors");

const isAuthenticated = (req, res, next) => {
  if (req.headers["authorization"] === undefined) {
    return next(
      new AppError(
        commonErrors.authorizationError,
        "권한이 없거나 인증되지 않은 유저입니다.",
        401
      )
    )
  }
  const token = req.headers["authorization"].slice(7);

  const userInfo = jsonwebtoken.verify(token, config.jwtSecret);
  // { id: string, email: string, isAdmin: boolean }

  res.locals.user = userInfo;
  next();
};

module.exports = {
  isAuthenticated
};