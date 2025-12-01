const { categoryService } = require("../service");
const utils = require("../misc/utils");

const categoryController = {
  async postCategory(req, res, next) {
    try {
      const { name } = req.body;
      const category = await categoryService.createCategory({ name });
      res.status(201).json(utils.buildResponse(category));
      console.log("카테고리 POST 성공");
    } catch (error) {
      next(error);
    }
  },
  async getCategory(req, res, next) {
    try {
      const { categoryId } = req.params;
      const category = await categoryService.getCategory(categoryId);
      res.json(utils.buildResponse(category));
      console.log("카테고리 GET 성공");
    } catch (error) {
      next(error);
    }
  },

  async getCategories(req, res, next) {
    try {
      const { name } = req.query;
      const categories = await categoryService.getCategories({ name });
      res.json(utils.buildResponse(categories));
      console.log("카테고리 전체 GET 성공");
    } catch (error) {
      next(error);
    }
  },

  async putCategory(req, res, next) {
    try {
      const { categoryId } = req.params;
      const { name } = req.body;
      const category = await categoryService.updateCategory(categoryId, {
        name,
      });
      res.json(utils.buildResponse(category));
      console.log("카테고리 PUT 성공");
    } catch (error) {
      next(error);
    }
  },
  async deleteCategory(req, res, next) {
    try {
      const { categoryId } = req.params;
      const category = await categoryService.deleteCagegory(categoryId);
      res.json(utils.buildResponse(category));
      console.log("카테고리 DELETE 성공");
    } catch (error) {
      next(error);
    }
  },
};

module.exports = categoryController;
