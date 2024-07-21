const { categoryDAO } = require("../data-access");
const AppError = require("../misc/AppError");
const commonErrors = require("../misc/commonErrors");

class CategoryService {
  async createCategory({ name }) {
    const newCategory = await categoryDAO.create({
      name,
    });
    return newCategory;
  }
  async getCategory(id) {
    const category = await categoryDAO.findById(id);
    return category;
  }
  async getCategories() {
    const categories = await categoryDAO.findMany();
    return categories;
  }

  async updateCategory(id, { name }) {
    const updatedCategory = await categoryDAO.updateById(id, { name });
    if (updatedCategory === null) {
      throw new AppError(
        commonErrors.resourceNotFoundError,
        "해당 카테고리가 존재하지 않습니다",
        404,
      );
    }
    return updatedCategory;
  }
  async deleteCategory(id) {
    const deleteCategory = await categoryDAO.deleteById(id);
    if (deleteCategory === null) {
      throw new AppError(
        commonErrors.resourceNotFoundError,
        "해당 카테고리가 존재하지 않습니다",
        404,
      );
    }
    return deleteCategory;
  }
}

module.exports = new CategoryService();
