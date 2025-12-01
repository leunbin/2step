const { insertCategory } = require("./category.fixture");
const { insertCustomer } = require("./customer.fixture");
const { insertDelivery } = require("./delivery.fixture");
const { insertOrder } = require("./order.fixture");
const { insertOrderitem } = require("./orderitem.fixture");
const { insertProduct } = require("./product.fixture");
const { insertProductOptions } = require("./productoption.fixture");
const { insertUser } = require("./user.fixture");

module.exports = {
  insertUser,
  insertProduct,
  insertProductOptions,
  insertCategory,
  insertCustomer,
  insertDelivery,
  insertOrderitem,
  insertOrder,
}