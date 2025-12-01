const { productService } = require("../service");
const utils = require("../misc/utils");

const productController = {
  async postProduct(req, res, next) {
    try {
      const {
        name,
        price,
        size,
        color,
        discountRate,
        description,
        company,
        imgUrl,
        category,
        state
      } = req.body;
      const product = await productService.createProduct({
        name,
        price,
        size,
        color,
        discountRate,
        description,
        company,
        imgUrl,
        category,
        state
      });
      res.status(201).json(utils.buildResponse(product));
      console.log("상품 POST 성공");
    } catch (error) {
      next(error);
    }
  },
  async getProduct(req, res, next) {
    try {
      const { productId } = req.params;
      const product = await productService.getproduct(productId);
      res.json(utils.buildResponse(product));
      console.log("상품 GET 성공");
    } catch (error) {
      next(error);
    }
  },

  async getProducts(req, res, next) {
    try {
      const {
        name,
        price,
        size,
        color,
        discountRate,
        description,
        company,
        imgUrl,
        category,
        state
      } = req.query;
      const categories = await productService.getproducts({
        name,
        price,
        size,
        color,
        discountRate,
        description,
        company,
        imgUrl,
        category,
        state
      });
      res.json(utils.buildResponse(categories));
      console.log("상품 전체 GET 성공");
    } catch (error) {
      next(error);
    }
  },

  async putProduct(req, res, next) {
    try {
      const { productId } = req.params;
      const {
        name,
        price,
        size,
        color,
        discountRate,
        description,
        company,
        imgUrl,
        category,
        state
      } = req.body;
      const product = await productService.updateProduct(productId, {
        name,
        price,
        size,
        color,
        discountRate,
        description,
        company,
        imgUrl,
        category,
        state
      });
      res.json(utils.buildResponse(product));
      console.log("상품 PUT 성공");
    } catch (error) {
      next(error);
    }
  },
  async deleteProduct(req, res, next) {
    try {
      const { productId } = req.params;
      const product = await productService.deleteProduct(productId);
      res.json(utils.buildResponse(product));
      console.log("상품 DELETE 성공");
    } catch (error) {
      next(error);
    }
  },
};

module.exports = productController;
