const express = require("express");
const { adminMiddleware, authMiddleware } = require("../middleware");
const { categoryController, productController, adminController } = require("../controller");

const adminRouter = express.Router();

// POST /admin/category
adminRouter.post(
  "/category",
  authMiddleware.isAuthenticated,
  adminMiddleware.isAdmin,
  categoryController.postCategory
)

// PUT /admin/category/order
adminRouter.put(
  "/category/order",
  authMiddleware.isAuthenticated,
  adminMiddleware.isAdmin,
  categoryController.putCategoryOrder
)

// PUT /admin/category/merge/targetId?
adminRouter.put(
  "/category/merge",
  authMiddleware.isAuthenticated,
  adminMiddleware.isAdmin,
  categoryController.putCategoryMerge
)

// POST /admin/product
adminRouter.post(
  "/product",
  authMiddleware.isAuthenticated,
  adminMiddleware.isAdmin,
  productController.postProduct
)

// PUT /admin/category/:categoryId
adminRouter.put(
  "/category/:categoryId",
  authMiddleware.isAuthenticated,
  adminMiddleware.isAdmin,
  categoryController.putCategory
)

// PUT /admin/category/active/:categoryId
adminRouter.put(
  "/category/active/:categoryId",
  authMiddleware.isAuthenticated,
  adminMiddleware.isAdmin,
  categoryController.putActiveCategory
)

// PUT /admin/product/:productId
adminRouter.put(
  "/product/:productId",
  authMiddleware.isAuthenticated,
  adminMiddleware.isAdmin,
  productController.putProduct
)

// DELETE /admin/product/:productId
adminRouter.delete(
  "/product/:productId",
  authMiddleware.isAuthenticated,
  adminMiddleware.isAdmin,
  productController.deleteProduct
)

// PUT /admin/category/soft-delete/:categoryId/?mode?targetId
adminRouter.put(
  "/category/soft-delete/:categoryId",
  authMiddleware.isAuthenticated,
  adminMiddleware.isAdmin,
  categoryController.deleteCategory
)

// PUT /admin/order/:orderId
adminRouter.put(
  "/order/:orderId",
  authMiddleware.isAuthenticated,
  adminMiddleware.isAdmin,
  adminController.putOrder
)

// DELETE /admin/order/:orderId
adminRouter.delete(
  "/order/:orderId",
  authMiddleware.isAuthenticated,
  adminMiddleware.isAdmin,
  adminController.deleteOrder
)

module.exports = adminRouter;