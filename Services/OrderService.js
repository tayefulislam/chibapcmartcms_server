const orderModel = require("../models/Order");

exports.createNewOrderService = async (order) => {
  const result = await orderModel.create(order);
  return result;
};

// get all order details with customer details

exports.getAllOrderDetailsService = async () => {
  console.log("CHECKed 2");
  const result = await orderModel
    .find()
    .populate("customerId")
    .populate("paymentObjId")
    .exec();
  return result;
};
