const AppError = require("../misc/AppError");
const commonErrors = require("../misc/commonErrors");

const isAdmin = (req, res, next) => {
  const user = res.locals.user;

  if(!user) {
    return next(
      new AppError(
        commonErrors.authorizationError,
        "로그인이 필요합니다.",
        401
      )
    );
  }

  if(!user.isAdmin){
    return next(
      new AppError(
        commonErrors.authorizationError,
        "관리자 권한이 필요합니다.",
        401
      )
    )
  }

  next();
}

module.exports = {
  isAdmin
};