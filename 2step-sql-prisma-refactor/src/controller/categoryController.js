const { categoryService } = require("../service");
const utils = require("../misc/utils");

const categoryController = {
  async postCategory(req, res, next) {
    try {
      const data = req.body;
      const category = await categoryService.createCategory(data);

      res.status(201).json(utils.buildResponse(category));
    } catch (error) {
      next(error);
    }
  },

  async getCategory(req, res, next) {
    try {
      const categoryId = Number(req.params.categoryId);
      const category = await categoryService.getCategory(categoryId);

      res.status(201).json(utils.buildResponse(category));
    } catch (error) {
      next(error);
    }
  },

  async getCategories(req, res, next) {
    try {
      const options = req.query;
      const categories = await categoryService.getCategories(options);

      res.status(201).json(utils.buildResponse(categories));
    } catch (error) {
      next(error);
    }
  },

  async putCategory(req, res, next) {
    try {
      const categoryId = Number(req.params.categoryId);
      const data = req.body;
      const category = await categoryService.updateCategory(categoryId, data);
      
      res.status(201).json(utils.buildResponse(category));
    } catch (error) {
      next(error);
    }
  },

  async deleteCategory(req, res, next) {
    try {
      const categoryId= Number(req.params.categoryId);
      const mode = req.query.mode;
      const targetId = Number(req.query.targetId);
      
      const category = await categoryService.deleteCategory(categoryId, mode, targetId);
      res.status(201).json(utils.buildResponse(category));
    } catch (error) {
      next(error);
    }
  },

  async putActiveCategory(req, res, next) {
    try{
      const id = Number(req.params.categoryId);
      const result = await categoryService.setInActive(id);

      res.status(201).json(utils.buildResponse(result));
    } catch (error) {
      next(error)
    }
  },

  async putCategoryOrder(req, res, next) {
    try{
      const datas = req.body;
      const result = await categoryService.updateOrder(datas);

      res.status(201).json(utils.buildResponse(result));
    } catch (e) {
      next(e);
    }
  },

  async putCategoryMerge(req, res, next) {
    try{
      const datas = req.body;
      const targetId = Number(req.query.targetId);
      const result = await categoryService.mergeCategory(datas, targetId);
  
      res.status(201).json(utils.buildResponse(result));
    } catch(e) {
      next(e);
    }
  }
};

module.exports = categoryController;
