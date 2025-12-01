class DeliveryDAO {
  async findByOrderId(prismaOrTx, orderId) {
    return prismaOrTx.delivery.findUnique({
      where: { orderId }
    });
  }

  async updateByOrderId(prismaOrTx, orderId, data) {
    return prismaOrTx.delivery.update({
      where: { orderId },
      data
    })
  }

  async create(prismaOrTx, data) {
    return prismaOrTx.delivery.create({
      data
    });
  }

  async deleteByOrderId(prismaOrTx, orderId) {
    return prismaOrTx.delivery.delete({
      where: { orderId }
    });
  }
}

module.exports = new DeliveryDAO();