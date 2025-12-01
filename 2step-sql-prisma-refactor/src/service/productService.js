const { productDAO, productOptionDAO } = require("../data-access");
const AppError = require("../misc/AppError");
const commonErrors = require("../misc/commonErrors");
const { isDuplicated } = require("../misc/utils");
const prisma = require("../prismaClient");

class ProductService {
  async create (productInfo, optionsInfo) {
    const productCode = productInfo.productCode;
    const existing = await productDAO.findByProductCode(prisma, productCode);

    if(existing) {
      throw new AppError(
        commonErrors.resourceDuplicationError,
        "이미 존재하는 상품 코드 입니다.",
        409
      );
    }
    const product = await prisma.$transaction(async (tx) => {
      try{
        const item = await productDAO.create(tx, productInfo);
        const options = Array.isArray(optionsInfo) ? optionsInfo : (optionsInfo? [optionsInfo] : []);
        const productId = item.id;

        if(isDuplicated(options)) {
          throw new AppError(
            commonErrors.resourceDuplicationError,
            '중복된 상품 옵션입니다.',
            409
          )
        }

        await productOptionDAO.createMany(tx, productId, options);

        return item;
      } catch (e) {
        if(e.code === 'P2002') {
          throw new AppError(
            commonErrors.resourceDuplicationError,
            '중복된 데이터입니다.',
            409
          );
        }

        throw e;
      }
    })
    return product;
  }

  async getproduct(id) {
    const product = await productDAO.findById(prisma, id);
    if(!product) {
      throw new AppError(
        commonErrors.resourceNotFoundError,
        "해당 상품이 없습니다.",
        404
      )
    }
    return product;
  }

  async getproducts(options = {}) {
    const products = await productDAO.findMany(prisma, options);
    return products;
  }

  async updateProduct(productId, productData, optionsData) {    
    const oldProduct = await productDAO.findById(prisma, productId);
    
    if(!oldProduct) {
      throw new AppError(
        commonErrors.resourceNotFoundError,
        "해당 상품을 찾을 수 없습니다.",
        404
      );
    }

    const oldOptions = await productOptionDAO.findByProductId(prisma, productId);
    

    const newProduct = await prisma.$transaction(async(tx) => {
      try{
        const updated = await productDAO.updateById(tx, productId, productData);

        if(oldOptions) {
          await productOptionDAO.deleteByProductId(tx, productId);
        }
  
        const options = Array.isArray(optionsData) ? optionsData : (optionsData ? [optionsData] : []);
  
        if(isDuplicated(options)) {
          throw new AppError(
            commonErrors.resourceDuplicationError,
            "중복된 상품 옵션입니다.",
            409
          )
        }
        
        await productOptionDAO.createMany(tx, productId, options);
        
        return updated;
      } catch (e) {
        if(e.code === 'P2002') {
          throw new AppError(
            commonErrors.resourceDuplicationError,
            '중복된 데이터입니다.',
            409
          );
        }
      }
    })

    return newProduct;
  }

  async deleteProduct (id) {
    const product = await productDAO.findById(prisma, id);

    if(!product) {
      throw new AppError(
        commonErrors.resourceNotFoundError,
        "해당 상품이 없습니다.",
        404
      );
    }
    
    const result = await prisma.$transaction(async (tx) => {
      await productOptionDAO.deleteByProductId(tx, id);
      await productDAO.deleteById(tx, id);

      return true;
    })

    return result;
  }
}

module.exports = new ProductService();
