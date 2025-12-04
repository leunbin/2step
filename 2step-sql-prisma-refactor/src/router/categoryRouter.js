const express = require("express");
const { categoryController } = require("../controller");
const categoryRouter = express.Router();

// GET /api/categories
categoryRouter.get(
  "/", 
  categoryController.getCategories
);

// GET /api/categories/:categoryId
categoryRouter.get(
  "/:categoryId", 
  categoryController.getCategory
);


module.exports = categoryRouter;
