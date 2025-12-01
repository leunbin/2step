const { User } = require("./model");
const AppError = require("../misc/AppError");
const commonErrors = require("../misc/commonErrors");

class UserDAO {
  async create({ email, password, firstName, lastName, isAdmin, address }) {
    try {
      const user = await User.create({
        email,
        password,
        firstName,
        lastName,
        isAdmin,
        address,
      });
      return user.toObject();
    } catch (error) {
      console.log(error);
      throw new AppError(
        commonErrors.databaseError,
        "Internal Server Error",
        500
      );
    }
  }

  async findById(id) {
    const user = await User.findById(id).lean();
    return user;
  }

  async findByEmail(email) {
    const users = await User.find({ email }).lean();
    if (users.length === 0) {
      return null;
    }
    return users[0];
  }

  async updateById(
    id,
    { email, password, firstName, lastName, isAdmin, address }
  ) {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        email,
        password,
        firstName,
        lastName,
        isAdmin,
        address,
      },
      {
        runValidators: true,
        new: true,
      }
    ).lean();
    return updatedUser;
  }

  async deleteById(id) {
    const deletedUser = await User.findByIdAndDelete(id);
    return deletedUser;
  }
}

module.exports = new UserDAO();
