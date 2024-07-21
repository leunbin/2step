const express = require("express");
const { categoryController } = require("../controller");
const categoryRouter = express.Router();

// POST /api/v1/categories
categoryRouter.post("/", categoryController.postCategory);

// GET /api/v1/categories/:categoryId
categoryRouter.get("/:categoryId", categoryController.getCategory);

// GET /api/v1/categories
categoryRouter.get("/", categoryController.getCategories);

// PUT /api/v1/categories/:categoryId
categoryRouter.put("/:categoryId", categoryController.putCategory);

// DELETE /api/v1/categories/:categoryId
categoryRouter.delete("/:categoryId", categoryController.deleteCategory);

module.exports = categoryRouter;
