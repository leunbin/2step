const jsonwebtoken = require("jsonwebtoken");
const config = require("../config");

const isAuthenticated = (req, res, next) => {
  // 클라이언트가 HTTP 헤더에 토큰을 담아서 보냈는지를 확인하는 과정
  // 만약 헤더의 authorization 속성에 값을 안담아서 보냈다면 거부
  if (req.headers["authorization"] === undefined) {
    res.status(401).json({
      error:
        "권한이 없거나 인증되지 않은 유저입니다. 본인의 권한을 체크하거나 로그인 해주세요",
      data: null,
    }); //
  }
  // Authorization: Bearer <token>
  const token = req.headers["authorization"].slice(7);
  // Bearer Authentication의 접두사인 Bearer 문자열 제거

  // verify로 현재 JWT가 내(서버)가 발급한 토큰인지를 secert값을 이용해서 검증. 앞서 말했다시피 발급은 회원가입(sign-up) 또는 로그인(sign-in) 단계에서 이루어진다
  // 검증이 완료되면 token에 담긴 payload값을 JS의 객체 형태로 반환해준다.
  const userInfo = jsonwebtoken.verify(token, config.jwtSecret);
  // { id: string, email: string, isAdmin: boolean }

  // 토큰 검증이 성공적으로 완료되면 토큰에 담긴 값을 이후 request handler에서도 사용할수 있도록 임시 저장소인 res.locals에 등록
  // 이렇게 등록을 해놓으면 이후의 app.post, app.get, app.put, app.delete에서도 토큰에 담긴 유저 정보를 사용할 수 있다.
  // 미들웨어에서 request handler에 값을 전달해주는 느낌.
  res.locals.user = userInfo;
  next();
};

module.exports = {
  isAuthenticated,
};
