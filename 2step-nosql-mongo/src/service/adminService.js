const { orderDAO } = require("../data-access/orderDAO");
const AppError = require("../misc/AppError.js");
const commonErrors = require("../misc/commonErrors.js");

class AdminService {
  //주문 생성
  async createOrder({ orderData }) {
    const newOrder = await orderDAO.create(orderData);

    return newOrder;
  }

  //주문 가져오기
  async getOrder(orderNumber) {
    const order = await orderDAO.findByorderNumber(orderNumber);
    return order;
  }

  //배송 상태 수정
  async updateOrder(orderNumber, deliverStatus) {
    try {
      const order = await orderDAO.findByorderNumber(orderNumber);

      if (!order) {
        throw new AppError(
          commonErrors.resourceNotFoundError,
          "주문번호와 일치하는 주문이 없습니다.",
          404,
        );
      }

      order.deliverStatus = deliverStatus;
      await order.save();
    } catch (error) {
      console.error("주문 업데이트 중 오류 발생", error.message);
      throw new AppError(
        commonErrors.internalServerError,
        "주문을 업데이트하는 동안 오류가 발생했습니다.",
        500,
      );
    }
  }

  // 주문 삭제
  async deleteOrder(orderNumber) {
    try {
      const isExistingOrder = await orderDAO.findByorderNumber(orderNumber);

      if (!isExistingOrder) {
        commonErrors.resourceNotFoundError,
          "해당 주문이 존재하지 않습니다.",
          404;
      }

      const deletedOrder = await orderDAO.deleteOne(orderNumber);
      return deletedOrder;
    } catch (error) {
      console.error("주문 업데이트 중 오류 발생", error.message);
      throw new AppError(
        commonErrors.internalserverError,
        "주문을 업데이트하는 동안 오류가 발생 했습니다.",
        500,
      );
    }
  }
}

module.exports = new AdminService();
