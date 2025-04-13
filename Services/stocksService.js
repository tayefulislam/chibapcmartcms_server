const stocksModel = require("../models/Stocks");

exports.createStocksService = async (entries) => {
  const result = await stocksModel.insertMany(entries);
  return result;
};

exports.getAllStocksService = async (req) => {
  const keyword = req?.query?.s || "";
  const page = parseInt(req?.query?.page) || 1;
  const limit = parseInt(req?.query?.limit) || 10;
  const stockStatus = req?.query?.itemStatus || "";

  const pipeline = [];

  // 1. Search Stage (Conditional)
  if (keyword.trim()) {
    pipeline.push({
      $search: {
        index: "default",
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
                path: "stockOrderId",
                tokenOrder: "sequential",
              },
            },
            {
              autocomplete: {
                query: keyword,
                path: "sku",
                tokenOrder: "sequential",
              },
            },
          ],
        },
      },
    });
  }

  // 2. Common Population Stages (Always Added)
  pipeline.push(
    {
      $lookup: {
        from: "suppliers",
        localField: "supplierId",
        foreignField: "_id",
        as: "supplierDetails",
      },
    },
    { $unwind: { path: "$supplierDetails", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "items",
        localField: "productId",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } }
  );

  // 3. Filter Stage (Conditional)
  if (stockStatus.trim()) {
    pipeline.push({ $match: { stockStatus } });
  }

  // 4. Create count pipeline first
  const countPipeline = [...pipeline];
  countPipeline.push({ $count: "total" });

  // 5. Add pagination to main pipeline
  pipeline.push({ $skip: (page - 1) * limit }, { $limit: limit });

  try {
    const [data, totalResult] = await Promise.all([
      stocksModel.aggregate(pipeline),
      stocksModel.aggregate(countPipeline),
    ]);

    const total = totalResult[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data,
      pagination: {
        currentPage: page,
        previousPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
        totalPages,
        totalDocuments: total,
        limit,
      },
    };
  } catch (error) {
    console.error("Error fetching stocks:", error);
    return {
      success: false,
      message: "Failed to fetch stocks data",
      error: error.message,
    };
  }
};

exports.getSingleStockByIdService = async (id) => {
  const result = await stocksModel
    .findById({ _id: id })
    .populate("productId")
    .populate("supplierId");
  return result;
};

// get all order details with customer details
exports.getAllOrderDetailsService = async (req) => {
  const keyword = req.query.s || "";

  console.log();

  // console.log(keyword);
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
