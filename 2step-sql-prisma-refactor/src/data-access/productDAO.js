class ProductDAO {
  async create(prismaOrTx, data) {
    return prismaOrTx.product.create({ data });
  }

  async findById(prismaOrTx, id) {
    return await prismaOrTx.product.findUnique({ where: { id } });
  }

  async findByProductCode (prismaOrTx, productCode) {
    return await prismaOrTx.product.findUnique({ where: { productCode }});
  }

  async findMany(prismaOrTx, options = {}) {
    const {
      categoryId,
      state,
      skip = 0,
      take = 20,
      includeHidden = false,
      includeDiscontinued = false, 
    } = options;

    const where = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if(state) {
      where.state = state;
    } else {
      const exclude = [];
      if(!includeHidden) exclude.push("HIDDEN");
      if(!includeDiscontinued) exclude.push('DISCONTINUED');

      if(exclude.length > 0 ) {
        where.state = {notIn: exclude};
      }
    }

    return await prismaOrTx.product.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc'}
    });
  }

  async updateById(prismaOrTx, id, data) {
    return await prismaOrTx.product.update({
      where: { id },
      data
    })
  }

  async updateStateByCategoryId(prismaOrTx, categoryId, newState) {
    const result = await prismaOrTx.product.updateMany({
      where: { categoryId: categoryId },
      data: { state: newState }
    })

    return result;
  }

  async updateCategoryByCategoryId(prismaOrTx, categoryId, targetId) {
    return await prismaOrTx.product.updateMany({
      where: { categoryId },
      data: {categoryId: targetId}
    })
  }

  async updateCategoryByCategoryIds(prismaOrTx, sourceIds, targetId) {
    return await prismaOrTx.product.updateMany({
      where: {
        categoryId: { in: sourceIds }
      },
      data:{
        categoryId: targetId
      }
    })
  }

  async deleteById(prismaOrTx, id) {
    return await prismaOrTx.product.delete({
      where: { id }
    })
  }
}

module.exports = new ProductDAO();
