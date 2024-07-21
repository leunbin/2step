const express = require("express");
const { orderController } = require("../controller");
const { authMiddleware } = require("../middleware");

const router = express.Router();

//@desc get all orders
router.get(
  "/",
  authMiddleware.isAuthenticated,
  orderController.getAllOrders,
);

//@desc get an order by orderNumber
router.get("/:orderNumber", orderController.getOrder);

//@desc create order
router.post(
  "/",
  authMiddleware.isAuthenticated,
  orderController.createOrder);

//@desc update order by customer
router.put(
  "/:orderNumber",
  authMiddleware.isAuthenticated,
  orderController.updateOrder,
);

//@desc delete order
router.delete(
  "/:orderNumber",
  authMiddleware.isAuthenticated,
  orderController.deleteOrder,
);

module.exports = router;
