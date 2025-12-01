class OrderItemDAO{
  async createMany (prismaOrTx, datas) {
    return prismaOrTx.orderItem.createMany({
      data: datas,
    });
  }

  async findByOrderId(prismaOrTx, orderId) {
    return prismaOrTx.orderItem.findMany({
      where: { orderId: orderId }
    })
  }

  async deleteByOrderId(prismaOrTx, orderId) {
    return prismaOrTx.orderItem.deleteMany({
      where: { orderId: orderId }
    })
  }
}

module.exports = new OrderItemDAO();