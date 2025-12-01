class ProductOptionDAO {
  async findByUniqueOption(prismaOrTx, { productId, size, color }){
    return prismaOrTx.productOption.findUnique({
      where: {
        productId_size_color: {
          productId,
          size,
          color,
        },
      },
    });
  }

  async findById(prismaOrTx, id) {
    return prismaOrTx.productOption.findUnique({ where: { id } });
  }

  async findByProductId(prismaOrTx, productId) {
    return prismaOrTx.productOption.findMany({
      where: { productId }
    })
  }

  async createOne(prismaOrTx, productId, data) {
    return prismaOrTx.productOption.create({
      data: {
        productId: productId,
        size: data.size,
        color: data.color,
        stock: data.stock,
      }
    })
  }

  async createMany(prismaOrTx, productId, datas) {
    const data = datas.map((d) => ({
      productId,
      size: d.size,
      color: d.color,
      stock: d.stock
    }));

    return prismaOrTx.productOption.createMany({
      data,
    })
  }

  async deleteByProductId(prismaOrTx, productId) {
    return prismaOrTx.productOption.deleteMany({
      where: { productId }
    })
  }

  async decreaseStock(prismaOrTx, id, quantity) {
    return prismaOrTx.productOption.update({
      where: { id: id },
      data: {
        stock: { decrement: quantity }
      }
    })
  }

  async increaseStock(prismaOrTx, id, quantity) {
    return prismaOrTx.productOption.update({
      where: { id: id },
      data: {
        stock: { increment: quantity }
      }
    })
  }
}

module.exports = new ProductOptionDAO();