const { productService } = require("../service");
const utils = require("../misc/utils");

const productController = {
  async postProduct(req, res, next) {
    try {
      const { product, options } = req.body;
      const result = await productService.create(product, options);

      res.status(201).json(utils.buildResponse(result));
    } catch (error) {
      next(error);
    }
  },

  async getProduct(req, res, next) {
    try {
      const productId = Number(req.params.productId);
      const product = await productService.getproduct(productId);

      res.status(201).json(utils.buildResponse(product));
    } catch (error) {
      next(error);
    }
  },

  async getProducts(req, res, next) {
    try {
      const options = req.query;

      const result = await productService.getproducts(options);

      res.status(201).json(utils.buildResponse(result));
    } catch (error) {
      next(error);
    }
  },

  async putProduct(req, res, next) {
    try {
      const { productId } = req.params;
      const {product, options} = req.body;
      const result = await productService.updateProduct(productId, product, options);

      res.status(201).json(utils.buildResponse(result));
    } catch (error) {
      next(error);
    }
  },
  
  async deleteProduct(req, res, next) {
    try {
      const productId= Number(req.params.productId);
      const product = await productService.deleteProduct(productId);
      
      res.status(201).json(utils.buildResponse(product));
    } catch (error) {
      next(error);
    }
  },
};

module.exports = productController;
