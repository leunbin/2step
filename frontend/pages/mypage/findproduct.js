import PRODUCT_DATA from "../common/data/productdata";

function findProduct(products) {
  const productData = [];
  for (const product of PRODUCT_DATA.data) {
    for (let i = 0; i < products.length; i++) {
      if (product._id === products[i]) {
        productData.push(product);
      }
    }
  }

  return productData;
}

export default findProduct;
