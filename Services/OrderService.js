const orderModel = require("../models/Order");

exports.createNewOrderService = async (order) => {
  const result = await orderModel.create(order);
  return result;
};

// get all order details with customer details

exports.getAllOrderDetailsService = async (req) => {
  const keyword = req.query.s || ""; // Use an empty string if the keyword is not provided
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  // If the keyword is provided and not just a blank string, use the $text search query
  const query = keyword.trim() ? { $text: { $search: keyword } } : {};

  const result = await orderModel
    .find(query, keyword.trim() ? { score: { $meta: "textScore" } } : {})
    .sort(keyword.trim() ? { score: { $meta: "textScore" } } : { _id: -1 })
    .populate("customerId")
    .populate("paymentObjId")
    .skip((page - 1) * limit)
    .limit(limit)
    .exec();

  let totalOrders;

  if (keyword.trim()) {
    totalOrders = await orderModel.countDocuments(query);
  } else {
    totalOrders = await orderModel.countDocuments();
  }

  const calculation = {
    result,
    totalPages: Math.ceil(totalOrders / limit),
    currentPage: page,
  };

  return calculation;
};

// exports.getAllOrderDetailsService = async (req) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;

//   // console.log("CHECKed 2");
//   const result = await orderModel
//     .find()
//     .sort({ _id: -1 })
//     .populate("customerId")
//     .populate("paymentObjId")
//     .skip((page - 1) * limit)
//     .limit(limit)
//     .exec();

//   const totalOrders = await orderModel.countDocuments();

//   const calculation = {
//     result,
//     totalPages: Math.ceil(totalOrders / limit),
//     currentPage: page,
//   };

//   // console.log(result);

//   // res.json({ orders, totalPages: Math.ceil(totalOrders / limit), currentPage: page, });

//   return calculation;
// };

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

// get order total amount by status

exports.getOrderTotalAmountByStatusService = async () => {
  const result = await orderModel.aggregate([
    {
      $group: {
        _id: "$deliveryStatus",
        totalAmount: { $sum: { $toInt: "$totalAmount" } },
        documentCount: { $sum: 1 },
      },
    },
    {
      $project: {
        deliveryStatus: "$_id",
        _id: 0,
        totalAmount: 1,
        documentCount: 1,
      },
    },
  ]);
  return result;
};

exports.getPreOrderCountService = async () => {
  const result = await orderModel.countDocuments({ orderType: "Pre-Order" });
  return result;
};
