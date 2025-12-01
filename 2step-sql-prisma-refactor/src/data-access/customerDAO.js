class CustomerDAO {

async create(prismaOrTx, data) {
  return prismaOrTx.customer.create({
    data
  });
}

  async findByOrderId(prismaOrTx, orderId) {
    return prismaOrTx.customer.findUnique({ 
      where: { orderId }
    })
  }

  async updateByOrderId(prismaOrTx, orderId, data) {
    return prismaOrTx.customer.update({
      where: { orderId },
      data
    })
  }

  async deleteByOrderId(prismaOrTx, orderId) {
    return prismaOrTx.customer.delete({
      where: { orderId }
    });
  }
}

module.exports = new CustomerDAO();