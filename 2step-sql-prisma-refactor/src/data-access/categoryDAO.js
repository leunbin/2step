class CategoryDAO {
  async create(prismaOrTx, data) {
    return await prismaOrTx.category.create({ data });
  }

  async findById(prismaOrTx, id) {
    return await prismaOrTx.category.findUnique({ where: { id } });
  }

  async findByIds(prismaOrTx, ids) {
    return await prismaOrTx.category.findMany({ where: {
      id: { in: ids }
    }});
  }

  async findByCode(prismaOrTx, code) {
    return await prismaOrTx.category.findUnique({ where: {code}});
  }

  async findMany(prismaOrTx, options = {}) {
    const {
      onlyActive = true,
      ids = null,
      skip = 0,
      take = 100,
      includeProducts = false,
      select = null,
    } = options;

    const where = {};

    if (onlyActive) {
      where.isActive = true;
    }

    if(Array.isArray(ids) && ids.length > 0) {
      where.id = { in: ids };
    }

    return await prismaOrTx.category.findMany({
      where,
      skip,
      take,
      orderBy: { order: 'asc' },
      include: includeProducts
      ? {products: true}
      : undefined,
      select: select || undefined
    });
  }

  async findMaxOrder(prismaOrTx) {
    const result = await prismaOrTx.category.aggregate({
      _max: { order: true}
    });

    return result._max.order;
  }

  async updateById(prismaOrTx, id, data) {
    return await prismaOrTx.category.update({
      where: { id },
      data
    });
  }

  async updateIsActive (prismaOrTx, id, active) {
    return await prismaOrTx.category.update({
      where: { id },
      data: { isActive: active}
    })
  }

  // async deleteById(prismaOrTx, id) {
  //   return prismaOrTx.category.delete({
  //     where: { id: id }
  //   });
  // }

  async updateIsActiveByIds(prismaOrTx, ids) {
    return await prismaOrTx.category.updateMany({
      where: {id: { in: ids }},
      data:{
        isActive: false
      }
    });
  }
}

module.exports = new CategoryDAO();
