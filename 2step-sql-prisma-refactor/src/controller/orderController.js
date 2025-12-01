const { orderService } = require("../service");
const utils = require("../misc/utils");

const orderController = {
  async getOrders (req, res, next){
    try {
      const orderId = Number(req.query.orderId);
      const orderNumber = Number(req.query.orderNumber);
      const { id } = res.locals.user;

      if(orderId) {
        const result = await orderService.getOrderById(orderId);
        res.status(200).json(utils.buildResponse(result));
      }

      if(orderNumber) {
        const result = await orderService.getOrderByOrderNum(orderNum);
        res.status(200).json(utils.buildResponse(result));
      }

      const result = await orderService.getOrdersByUserId(id); // id 로 주문 찾기
      res.status(200).json(utils.buildResponse(result));
    } catch (error) {
      next(error);
    }
  },

  async createOrder(req, res, next){
    try {
      const orderData = req.body;
      const user = res.locals.user;
      const result = await orderService.createOrder(user, orderData);

      res.status(201).json(utils.buildResponse(result))
    } catch (error) {
      next(error);
    }
  },

    async updateOrder(req, res, next){
    try {
      const id = Number(req.params.id);
      const data = req.body;
      const result = await orderService.updateOrder(id, data);

      res.status(200).json(utils.buildResponse(result));
    } catch (error) {
      next(error);
    }
  },

  async deleteOrder(req, res, next){
    try {
      const id = Number(req.params.id);
      const result = await orderService.deleteOrder(id);

      res.status(200).json(utils.buildResponse(result));
    } catch (error) {
      next(error);
    }
  },
};

module.exports = orderController;
