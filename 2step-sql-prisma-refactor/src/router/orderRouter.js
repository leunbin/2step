const express = require("express");
const { orderController } = require("../controller");
const { authMiddleware } = require("../middleware");

const router = express.Router();

//@desc get all orders
router.get(
  "/",
  authMiddleware.isAuthenticated,
  orderController.getOrders
);

//@desc create order
router.post(
  "/",
  authMiddleware.isAuthenticated,
  orderController.createOrder
);

//@desc update order by id
router.put(
  "/:id",
  authMiddleware.isAuthenticated,
  orderController.updateOrder
);

//@desc delete order
router.delete(
  "/:id",
  authMiddleware.isAuthenticated,
  orderController.deleteOrder
);

module.exports = router;
