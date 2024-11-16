const Order = require("../models/Order");

exports.createNewOrderService = async (newOrder) => {
  const result = await Order.create(newOrder);
  return result;
};
