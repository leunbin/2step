const { Product } = require("./model");
const utils = require("../misc/utils");
const AppError = require("../misc/AppError");
const commonErrors = require("../misc/commonErrors");

class ProductDAO {
  async create({
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
  }) {
    try {
      const product = await Product.create({
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
      return product.toObject();
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
    const product = await Product.findById(id).lean();
    return product;
  }
  async findMany() {
    const product = await Product.find().lean();
    return product;
  }

  async updateOne(
    id,
    {
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
    },
  ) {
    const sanitizedToUpdate = utils.sanitizeObject({
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
    const plainUpdatedProduct = await Product.findByIdAndUpdate(
      id,
      sanitizedToUpdate,
      {
        runValidators: true,
        new: true,
      },
    ).lean();
    return plainUpdatedProduct;
  }

  async deleteById(id) {
    const deletedProduct = await Product.findByIdAndDelete(id);
    return deletedProduct;
  }
}

module.exports = new ProductDAO();
