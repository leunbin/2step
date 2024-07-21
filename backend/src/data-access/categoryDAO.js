const { Category } = require("./model");
const AppError = require("../misc/AppError");
const commonErrors = require("../misc/commonErrors");

class CategoryDAO {
  async create({ name }) {
    try {
      const category = await Category.create({
        name,
      });
      return category.toObject();
    } catch (error) {
      console.log(error);
      throw new AppError(
        commonErrors.databaseError,
        "Internal Server Error",
        500,
      );
    }
  }

  async findById(id) {
    const category = await Category.findById(id).lean();
    return category;
  }
  async findMany() {
    const categories = await Category.find().lean();
    return categories;
  }

  async updateById(id, name) {
    const updatedCategory = await Category.findByIdAndUpdate(id, name, {
      runValidators: true,
      new: true,
    }).lean();
    return updatedCategory;
  }

  async deleteById(id) {
    const deletedCategory = await Category.findByIdAndDelete(id);
    return deletedCategory;
  }
}

module.exports = new CategoryDAO();
