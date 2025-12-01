const { productDAO } = require("../data-access");
const AppError = require("../misc/AppError");
const commonErrors = require("../misc/commonErrors");

class ProductService {
  async createProduct({
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
    const newProduct = await productDAO.create({
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
    return newProduct;
  }
  async getproduct(id) {
    const product = await productDAO.findById(id);
    return product;
  }
  async getproducts() {
    const products = await productDAO.findMany();
    return products;
  }

  async updateProduct(
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
    const updatedProduct = await productDAO.updateById(id, {
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
    if (updatedProduct === null) {
      throw new AppError(
        commonErrors.resourceNotFoundError,
        "해당 상품이 존재하지 않습니다",
        404,
      );
    }
    return updatedProduct;
  }
  async deleteProduct(id) {
    const deleteProduct = await productDAO.deleteById(id);
    if (deleteProduct === null) {
      throw new AppError(
        commonErrors.resourceNotFoundError,
        "해당 상품이 존재하지 않습니다",
        404,
      );
    }
    return deleteProduct;
  }
}

module.exports = new ProductService();
