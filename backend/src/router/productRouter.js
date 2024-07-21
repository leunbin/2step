const express = require("express");
const { productController } = require("../controller");
const productRouter = express.Router();

// POST /api/v1/products
productRouter.post("/", productController.postProduct);

// GET /api/v1/products/:productId
productRouter.get("/:productId", productController.getProduct);

// GET /api/v1/products
productRouter.get("/", productController.getProducts);

// PUT /api/v1/products/:productId
productRouter.put("/:productId", productController.putProduct);

// DELETE /api/v1/products/:productId
productRouter.delete("/:productId", productController.deleteProduct);

module.exports = productRouter;
