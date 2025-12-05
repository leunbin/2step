const express = require("express");
const { productController } = require("../controller");
const productRouter = express.Router();

// GET /api/products/category/:categoryId
productRouter.get(
  "/category/:categoryId",
  productController.getProducts
);

// GET /api/products
productRouter.get(
  "/", 
  productController.getProducts
);

// GET /api/products/:productId
productRouter.get(
  "/:productId", 
  productController.getProduct
);


module.exports = productRouter;
