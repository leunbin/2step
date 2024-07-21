const { userDAO } = require("../data-access");
const AppError = require("../misc/AppError");
const commonErrors = require("../misc/commonErrors");

//회원 조회
class UserService {
  async getUserInfo(userId) {
    const user = await userDAO.findById(userId);
    if (!user) {
      throw new AppError(
        commonErrors.resourceNotFoundError,
        "해당하는 사용자를 찾을 수 없습니다.",
        404
      );
    }

    // 사용자 정보에서 민감한 정보 필터링 (예: 패스워드 등)
    const userInfo = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin,
      address: user.address,
    };

    return userInfo;
  }

  // 다른 사용자 관련 기능을 추가할 수 있습니다.

  async updateUser(userId, updatedInfo) {
    const user = await userDAO.findById(userId);
    if (!user) {
      throw new AppError(
        commonErrors.resourceNotFoundError,
        "해당하는 사용자를 찾을 수 없습니다.",
        404
      );
    }

    // 업데이트할 정보만 선택하여 업데이트

    const { password, ...updatedDataWithoutPassword } = updatedInfo;
    const updatedUser = await userDAO.updateById(
      userId,
      updatedDataWithoutPassword
    );

    // 업데이트된 사용자 정보 반환
    return {
      ...updatedUser,
      password: undefined, // 패스워드를 응답에서 제외
    };
  }
}

module.exports = new UserService();
