class OrderDAO {
  async create(prismaOrTx, data) {
    return await prismaOrTx.order.create({ data });
  }

  async findById(prismaOrTx, id) {
    return await prismaOrTx.order.findUnique({ where: { id } });
  }

  async findByUserId(prismaOrTx, userId) {
    return await prismaOrTx.order.findMany({where: { userId }})
  }

  async findByOrderNumber(prismaOrTx, orderNumber) {
    return await prismaOrTx.order.findUnique({ where: { orderNumber }});
  }

  async updateById(prismaOrTx, id, data) {
    return await prismaOrTx.order.update({
      where: { id },
      data
    })
  }

  async deleteById(prismaOrTx, id) {
    return await prismaOrTx.order.delete({ where: { id } });
  }
}

module.exports = new OrderDAO();
