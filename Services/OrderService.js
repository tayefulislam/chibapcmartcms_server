const orderModel = require("../models/Order");
const moment = require("moment-timezone");

exports.createNewOrderService = async (order) => {
  const result = await orderModel.create(order);
  return result;
};

// get all order details with customer details
// exports.getAllOrderDetailsService = async (req) => {
//   const keyword = req.query.s || ""; // Use an empty string if the keyword is not provided
//   // const keyword = encodeURIComponent(req.query.s) || ""; // Use an empty string if the keyword is not provided

//   // console.log(keyword);
//   const orderType = req.query.orderType || "";
//   const page = parseInt(req.query.page) || 1;
//   // const limit = parseInt(req.query.limit);
//   const limit = 100;
//   const deliveryStatus = req.query.deliveryStatus || "";

//   const searchQuery = [];

//   // Add the search stage only if the keyword is provided and not empty
//   if (keyword.trim()) {
//     searchQuery.push({
//       $search: {
//         index: "default", // Name of the autocomplete index created in MongoDB Atlas
//         compound: {
//           should: [
//             {
//               autocomplete: {
//                 query: keyword,
//                 path: "searchKeyWord",
//                 tokenOrder: "sequential",
//               },
//             },
//             {
//               autocomplete: {
//                 query: keyword,
//                 path: "orderId",
//                 tokenOrder: "sequential",
//               },
//             },
//             {
//               autocomplete: {
//                 query: keyword,
//                 path: "paymentId",
//                 tokenOrder: "sequential",
//               },
//             },
//             {
//               autocomplete: {
//                 query: keyword,
//                 path: "itemsDetails.itemName",
//                 tokenOrder: "sequential",
//               },
//             },
//           ],
//         },
//       },
//     });
//   }

//   const matchStage = {};

//   if (orderType.trim()) {
//     matchStage.orderType = orderType;
//   }

//   if (deliveryStatus.trim()) {
//     matchStage.deliveryStatus = deliveryStatus;
//   }

//   if (Object.keys(matchStage).length > 0) {
//     searchQuery.push({ $match: matchStage });
//   }

//   console.log(matchStage);

//   // if (orderType.trim()) {
//   //   searchQuery.push({ $match: { orderType: orderType } });
//   // }

//   // if (deliveryStatus.trim()) {
//   //   searchQuery.push({ $match: { deliveryStatus: deliveryStatus } });
//   // }

//   // Conditionally add sorting by deliveryDate for "Pre-Order" only

//   if (orderType.trim() === "Pre-Order") {
//     searchQuery.push({ $sort: { deliveryDate: 1 } });
//   } else {
//     searchQuery.push({ $sort: { _id: -1 } });
//   }

//   // Add lookup stages to populate the referenced fields
//   searchQuery.push(
//     {
//       $lookup: {
//         from: "customers",
//         localField: "customerId",
//         foreignField: "_id",
//         as: "customerId",
//       },
//     },
//     {
//       $unwind: "$customerId",
//     },
//     {
//       $lookup: {
//         from: "payments",
//         localField: "paymentObjId",
//         foreignField: "_id",
//         as: "paymentObjId",
//       },
//     },
//     {
//       $unwind: "$paymentObjId",
//     },
//     { $skip: (page - 1) * limit },

//     { $limit: limit }
//   );

//   const result = await orderModel.aggregate(searchQuery).exec();

//   // Count documents matching the search query
//   const totalOrdersQuery = [
//     {
//       $search: {
//         index: "autocomplete",
//         compound: {
//           should: [
//             {
//               autocomplete: {
//                 query: keyword,
//                 path: "searchKeyWord",
//                 tokenOrder: "sequential",
//               },
//             },
//             {
//               autocomplete: {
//                 query: keyword,
//                 path: "orderId",
//                 tokenOrder: "sequential",
//               },
//             },
//             {
//               autocomplete: {
//                 query: keyword,
//                 path: "paymentId",
//                 tokenOrder: "sequential",
//               },
//             },
//             {
//               autocomplete: {
//                 query: keyword,
//                 path: "itemsDetails.itemName",
//                 tokenOrder: "sequential",
//               },
//             },
//           ],
//         },
//       },
//     },
//     {
//       $count: "total",
//     },
//   ];

//   // Add the match stage to the count query if orderType is provided

//   if (orderType.trim()) {
//     totalOrdersQuery.push({ $match: { orderType: orderType } });
//   }

//   if (deliveryStatus.trim()) {
//     totalOrdersQuery.push({ $match: { deliveryStatus: deliveryStatus } });
//   }

//   // Only perform the count query if a keyword is provided

//   // async  performCountQuery (keyword) => {
//   //   const countResult = await orderModel.aggregate(totalOrdersQuery).exec();
//   //   return countResult[0]?.total || 0;
//   // }

//   console.log("totalOrdersQuery", totalOrdersQuery);
//   const totalOrders = keyword.trim()
//     ? await orderModel.aggregate(totalOrdersQuery).exec()
//     : await orderModel.countDocuments();

//   console.log("totalOrdersQuery", totalOrdersQuery);

//   const calculation = {
//     result,
//     totalPages: Math.ceil(
//       (totalOrders[0] ? totalOrders[0].total : totalOrders) / limit
//     ),
//     currentPage: page,
//   };

//   return calculation;
// };

exports.getAllOrderDetailsService = async (req) => {
  const keyword = req.query.s || "";
  const orderType = req.query.orderType || "";
  const page = parseInt(req.query.page) || 1;
  const limit = 100;
  const deliveryStatus = req.query.deliveryStatus || "";

  console.log("Input Parameters:", {
    keyword,
    orderType,
    page,
    limit,
    deliveryStatus,
  });

  const searchQuery = [];
  const matchStage = {};

  // Add search stage if keyword is provided
  if (keyword.trim()) {
    searchQuery.push({
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
    });
  }

  // Add match stages for orderType and deliveryStatus
  if (orderType.trim()) {
    matchStage.orderType = orderType;
  }

  if (deliveryStatus.trim()) {
    matchStage.deliveryStatus = deliveryStatus;
  }

  if (Object.keys(matchStage).length > 0) {
    searchQuery.push({ $match: matchStage });
  }

  console.log("Match Stage:", matchStage);

  // Add sorting
  if (orderType.trim() === "Pre-Order") {
    searchQuery.push({ $sort: { deliveryDate: 1 } });
  } else {
    searchQuery.push({ $sort: { _id: -1 } });
  }

  // Add pagination
  searchQuery.push({ $skip: (page - 1) * limit }, { $limit: limit });

  // Add lookup stages
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
    }
  );

  console.log("Search Query:", JSON.stringify(searchQuery, null, 2));

  let result, totalOrders;

  try {
    result = await orderModel.aggregate(searchQuery).exec();
    console.log("Query Result:", result);

    // Build totalOrdersQuery
    const totalOrdersQuery = [];

    if (keyword.trim()) {
      totalOrdersQuery.push({
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
      });
    }

    if (orderType.trim()) {
      totalOrdersQuery.push({ $match: { orderType: orderType } });
    }

    if (deliveryStatus.trim()) {
      totalOrdersQuery.push({ $match: { deliveryStatus: deliveryStatus } });
    }

    totalOrdersQuery.push({ $count: "total" });

    console.log(
      "Total Orders Query:",
      JSON.stringify(totalOrdersQuery, null, 2)
    );

    // Execute the count query
    totalOrders = keyword.trim()
      ? await orderModel.aggregate(totalOrdersQuery).exec()
      : await orderModel.countDocuments(matchStage);

    console.log("Total Orders Result:", totalOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Failed to fetch orders");
  }

  // Calculate totalPages
  const totalPages = Math.ceil(
    (totalOrders[0]?.total || totalOrders || 0) / limit
  );

  console.log("Total Pages:", totalPages);

  return {
    result,
    totalPages,
    currentPage: page,
  };
};

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

exports.getOrderTotalAmountByStatusService = async (startDate, endDate) => {
  let aggregateQuery = [];

  const startDateStr = moment
    .tz(startDate, "YYYY-MM-DD", "Asia/Tokyo")
    .format("YYYY-MM-DDTHH:mm:ssZ");
  const endDateStr = moment
    .tz(endDate, "YYYY-MM-DD", "Asia/Tokyo")
    .endOf("day")
    .format("YYYY-MM-DDTHH:mm:ssZ");

  // console.log(startDateStr);
  // console.log(endDateStr);

  if (startDate && endDate) {
    aggregateQuery.push({
      $match: {
        deliveryDate: {
          $gte: startDateStr,
          $lte: endDateStr,
        },
      },
    });
  }

  aggregateQuery.push(
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
    }
  );

  // console.log(aggregateQuery);
  const result = await orderModel.aggregate(aggregateQuery);
  return result;
};

exports.getPreOrderCountService = async () => {
  const result = await orderModel.countDocuments({ orderType: "Pre-Order" });

  // console.log("Pre" + result);
  return result;
};
