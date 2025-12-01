const { orderDAO, deliveryDAO, customerDAO, orderItemDAO, productOptionDAO } = require("../data-access/index.js");
const AppError = require("../misc/AppError.js");
const commonErrors = require("../misc/commonErrors.js");
const { updateValidation } = require("../misc/utils.js");
const prisma = require("../prismaClient.js");

class AdminService {
  //배송 상태 수정
  async updateOrder(id, data) {
    const order = await orderDAO.findById(prisma, id);

    if(!order) {
      throw new AppError(
        commonErrors.resourceNotFoundError,
        "주문이 없습니다.",
        404
      );
    }

    if(order.status === "DELIVERED" || order.satus === "CANCELED") {
      throw new AppError(
        commonErrors.businessError,
        "이미 배송 되었거나 취소된 건입니다.",
        400
      );
    }

    const result = await prisma.$transaction(async(tx) => {
      const { order, delivery, customer } = data;

      if(order) updateValidation(order, { type: "order" });
      if(delivery) updateValidation(delivery, { type: "delivery" });
      if(customer) updateValidation(customer, { type: "customer" });

      let updatedOrder;
      let updatedDelivery;
      let updatedCustomer;

      if(order){
        updatedOrder = await orderDAO.updateById(tx, id, order);
      }else{
        updatedOrder = await orderDAO.findById(tx, id);
      }

      if(delivery) {
        updatedDelivery = await deliveryDAO.updateByOrderId(tx, id, delivery);
      } else{
        updatedDelivery = await deliveryDAO.findByOrderId(tx, id);
      }

      if(customer){
        updatedCustomer = await customerDAO.updateByOrderId(tx, id, customer);
      }else {
        updatedCustomer = await customerDAO.findByOrderId(tx, id)
      }

      return ({ order: updatedOrder, delivery: updatedDelivery, customer: updatedCustomer});
    })

    return result;
  }

  // 주문 삭제
  async deleteOrder(id) {
    const order = await orderDAO.findById(prisma, id);

    if(!order) {
      throw new AppError(
        commonErrors.resourceNotFoundError,
        "주문이 없습니다.",
        404
      );
    }

    if(order.status === "DELIVERED" || order.satus === "CANCLED") {
      throw new AppError(
        commonErrors.businessError,
        "이미 배송 되었거나 취소된 건입니다.",
        400
      );
    }

    const result = await prisma.$transaction(async(tx) => {
      const orderItems = await orderItemDAO.findByOrderId(tx, id);

      for(const item of orderItems) {
        await productOptionDAO.increaseStock(tx, item.productOptionId, item.quantity);
      }

      await orderItemDAO.deleteByOrderId(tx, id);
      await customerDAO.deleteByOrderId(tx, id);
      await deliveryDAO.deleteByOrderId(tx, id);
      await orderDAO.deleteById(tx, id);

      return true;
    })

    return result;
  }
}

module.exports = new AdminService();
