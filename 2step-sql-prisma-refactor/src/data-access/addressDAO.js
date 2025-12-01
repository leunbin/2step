class AddressDAO{
  async createAddress(prismaOrTx, data) {
    return prismaOrTx.address.create({ data });
  }

  async findByUserId(prismaOrTx, userId) {
    return prismaOrTx.address.findUnique({
      where: {userId}
    })
  }

  async updateAddressByUserId(prismaOrTx, userId, data) {
    return prismaOrTx.address.update({
      where: { userId },
      data
    });
  }

  async deleteByUserId(prismaOrTx, userId) {
    return prismaOrTx.address.delete({
      where: {userId}
    })
  }

  async softDelete(prismaOrTx, userId) {
    return prismaOrTx.address.update({
      where: { userId },
      data: { deletedAt: new Date() }
    })
  }
}

module.exports = new AddressDAO();