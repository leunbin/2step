class UserDAO {
  async createUser(prismaOrTx, data) {
    return prismaOrTx.user.create({ data });
  }

  async findById(prismaOrTx,id) {
    return prismaOrTx.user.findUnique({
      where: {id},
      include: {
        address: true,
      }
    });
  }

  async findByEmail(prismaOrTx, email) {
    return prismaOrTx.user.findUnique({
      where: {email},
      include: {
        address: true
      }
    });
  }

  async updateById(prismaOrTx, id, data) {
    return prismaOrTx.user.update({
      where: { id },
      data
    });
  }

  async deleteById(prismaOrTx, id) {
    return prismaOrTx.user.delete({
      where: { id }
    });
  }

  async softDelete(prismaOrTx, id) {
    return prismaOrTx.user.update({
      where: { id },
      data: { deletedAt: new Date() }
    })
  }
}

module.exports = new UserDAO();
