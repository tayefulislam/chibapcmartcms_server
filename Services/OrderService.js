const orderModel = require("../models/Order");

exports.createNewOrderService = async (order) => {
  const result = await orderModel.create(order);

  // console.log(result);

  return result;
};
