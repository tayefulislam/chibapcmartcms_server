const orderModel = require("../models/Order");

exports.createNewOrderService = async (order) => {
  const result = await orderModel.create(order);
  return result;
};

// get all order details with customer details

exports.getAllOrderDetailsService = async () => {
  // console.log("CHECKed 2");
  const result = await orderModel
    .find()
    .sort({ _id: -1 })
    .populate("customerId")
    .populate("paymentObjId")
    .exec();

  // console.log(result);
  return result;
};

// get single order details with customer and payment details

exports.getSingleOrderWithCustomerPaymentDetailsService = async (id) => {
  const result = await orderModel
    .findById(id)
    .populate("customerId") // populate customer details
    .populate("paymentObjId") // populate payment details
    .exec();
  return result;
};

exports.updateDeliveryStatusService = async (id, status) => {
  console.log("From updateDeliveryStatusService", id, status);

  const result = await orderModel.findByIdAndUpdate(
    id,
    { deliveryStatus: status },
    { new: true }
  );
  return result;
};
