const orderModel = require("../models/Order");

exports.createNewOrderService = async (order) => {
  const result = await orderModel.create(order);
  return result;
};

// get all order details with customer details
exports.getAllOrderDetailsService = async (req) => {
  const keyword = req.query.s || ""; // Use an empty string if the keyword is not provided
  // const keyword = encodeURIComponent(req.query.s) || ""; // Use an empty string if the keyword is not provided

  console.log(keyword);
  const orderType = req.query.orderType || "";
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const deliveryStatus = req.query.deliveryStatus || "";

  const searchQuery = [];

  // Add the search stage only if the keyword is provided and not empty
  if (keyword.trim()) {
    searchQuery.push({
      $search: {
        index: "default", // Name of the autocomplete index created in MongoDB Atlas
        compound: {
          should: [
            {
              autocomplete: {
                query: keyword,
                path: "searchKeyWord",
                tokenOrder: "sequential",
              },
            },
            {
              autocomplete: {
                query: keyword,
                path: "orderId",
                tokenOrder: "sequential",
              },
            },
            {
              autocomplete: {
                query: keyword,
                path: "paymentId",
                tokenOrder: "sequential",
              },
            },
            {
              autocomplete: {
                query: keyword,
                path: "itemsDetails.itemName",
                tokenOrder: "sequential",
              },
            },
          ],
        },
      },
    });
  }

  if (orderType.trim()) {
    searchQuery.push({ $match: { orderType: orderType } });
  }

  if (deliveryStatus.trim()) {
    searchQuery.push({ $match: { deliveryStatus: deliveryStatus } });
  }

  // Conditionally add sorting by deliveryDate for "Pre-Order" only

  if (orderType.trim() === "Pre-Order") {
    searchQuery.push({ $sort: { deliveryDate: 1 } });
  } else {
    searchQuery.push({ $sort: { _id: -1 } });
  }

  // Add lookup stages to populate the referenced fields
  searchQuery.push(
    {
      $lookup: {
        from: "customers",
        localField: "customerId",
        foreignField: "_id",
        as: "customerId",
      },
    },
    {
      $unwind: "$customerId",
    },
    {
      $lookup: {
        from: "payments",
        localField: "paymentObjId",
        foreignField: "_id",
        as: "paymentObjId",
      },
    },
    {
      $unwind: "$paymentObjId",
    },
    { $skip: (page - 1) * limit },

    { $limit: limit }
  );

  const result = await orderModel.aggregate(searchQuery).exec();

  // Count documents matching the search query
  const totalOrdersQuery = [
    {
      $search: {
        index: "autocomplete",
        compound: {
          should: [
            {
              autocomplete: {
                query: keyword,
                path: "searchKeyWord",
                tokenOrder: "sequential",
              },
            },
            {
              autocomplete: {
                query: keyword,
                path: "orderId",
                tokenOrder: "sequential",
              },
            },
            {
              autocomplete: {
                query: keyword,
                path: "paymentId",
                tokenOrder: "sequential",
              },
            },
            {
              autocomplete: {
                query: keyword,
                path: "itemsDetails.itemName",
                tokenOrder: "sequential",
              },
            },
          ],
        },
      },
    },
    {
      $count: "total",
    },
  ];

  // Add the match stage to the count query if orderType is provided

  if (orderType.trim()) {
    totalOrdersQuery.push({ $match: { orderType: orderType } });
  }

  if (deliveryStatus.trim()) {
    totalOrdersQuery.push({ $match: { deliveryStatus: deliveryStatus } });
  }

  // Only perform the count query if a keyword is provided
  const totalOrders = keyword.trim()
    ? await orderModel.aggregate(totalOrdersQuery).exec()
    : await orderModel.countDocuments();

  const calculation = {
    result,
    totalPages: Math.ceil(
      (totalOrders[0] ? totalOrders[0].total : totalOrders) / limit
    ),
    currentPage: page,
  };

  return calculation;
};

// exports.getAllOrderDetailsService = async (req) => {
//   const keyword = req.query.s || ""; // Use an empty string if the keyword is not provided
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;

//   // If the keyword is provided and not just a blank string, use the $text search query
//   const query = keyword.trim() ? { $text: { $search: keyword } } : {};

//   const result = await orderModel
//     .find(query, keyword.trim() ? { score: { $meta: "textScore" } } : {})
//     .sort(keyword.trim() ? { score: { $meta: "textScore" } } : { _id: -1 })
//     .populate("customerId")
//     .populate("paymentObjId")
//     .skip((page - 1) * limit)
//     .limit(limit)
//     .exec();

//   let totalOrders;

//   if (keyword.trim()) {
//     totalOrders = await orderModel.countDocuments(query);
//   } else {
//     totalOrders = await orderModel.countDocuments();
//   }

//   const calculation = {
//     result,
//     totalPages: Math.ceil(totalOrders / limit),
//     currentPage: page,
//   };

//   return calculation;
// };

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

exports.updateDeliveryStatusService = async (id, status, date) => {
  if (date) {
    console.log("From updateDeliveryStatusService", date);
  }

  if (date) {
    const result = await orderModel.findByIdAndUpdate(
      id,
      { deliveryStatus: status, deliveryDate: date },
      { new: true }
    );
    return result;
  } else {
    const result = await orderModel.findByIdAndUpdate(
      id,
      { deliveryStatus: status },
      { new: true }
    );
    return result;
  }
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
        totalAmount: {
          $sum: {
            $toInt: {
              $ifNull: [
                {
                  $convert: {
                    input: "$totalAmount",
                    to: "int",
                    onError: 0,
                    onNull: 0,
                  },
                },
                0,
              ],
            },
          },
        },
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

  console.log("Pre" + result);
  return result;
};
