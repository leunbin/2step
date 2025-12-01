const express = require("express");
const { categoryController } = require("../controller");
const categoryRouter = express.Router();

// GET /api/v1/categories
categoryRouter.get(
  "/", 
  categoryController.getCategories
);

// GET /api/v1/categories/:categoryId
categoryRouter.get(
  "/:categoryId", 
  categoryController.getCategory
);


module.exports = categoryRouter;
