const { default: mongoose } = require("mongoose");
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
  // Validate the ID format first
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid stock ID format");
  }

  const result = await stocksModel
    .findById(id)
    .populate("supplierId")
    .populate("productId")
    .exec();

  if (!result) {
    throw new Error("Stock not found");
  }

  return result;
};
