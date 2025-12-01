const authMiddleware = require("./authMiddleware");
const errorMiddleware = require("./errorMiddleware");
const adminMiddleware = require("./adminMiddleware");

module.exports = {
  authMiddleware,
  errorMiddleware,
  adminMiddleware,
};
