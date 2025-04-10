const { getAllStocksService } = require("../Services/stocksService");

exports.getAllStocksController = async (req, res, next) => {
  try {
    const result = await getAllStocksService();

    res.status(200).send(result);
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: "Get All Supplier Failed",
      error: error.message,
    });
  }
};
