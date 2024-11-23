const orderModel = require("../models/Order");

exports.createNewOrderService = async (order) => {
  const result = await orderModel.create(order);
  return result;
};

// get all order details with customer details

exports.getAllOrderDetailsService = async (req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  // console.log("CHECKed 2");
  const result = await orderModel
    .find()
    .sort({ _id: -1 })
    .populate("customerId")
    .populate("paymentObjId")
    .skip((page - 1) * limit)
    .limit(limit)
    .exec();

  const totalOrders = await orderModel.countDocuments();

  const calculation = {
    result,
    totalPages: Math.ceil(totalOrders / limit),
    currentPage: page,
  };

  // console.log(result);

  // res.json({ orders, totalPages: Math.ceil(totalOrders / limit), currentPage: page, });

  return calculation;
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

exports.updateOrderDetailsService = async (id, order) => {
  // const result = await orderModel.findByIdAndUpdate(id, order, { new: true });

  const result = await orderModel.findOneAndUpdate(
    { _id: id },
    { $set: order },
    { new: true }
  );
  return result;
};
