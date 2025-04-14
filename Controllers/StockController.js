const {
  getAllStocksService,
  getSingleStockByIdService,
} = require("../Services/stocksService");

exports.getAllStocksController = async (req, res, next) => {
  try {
    const result = await getAllStocksService(req);

    res.status(200).send(result);
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: "Get All Supplier Failed",
      error: error.message,
    });
  }
};

exports.getSingleStockByIdController = async (req, res, next) => {
  const id = req.params.id;
  // console.log(id);
  try {
    const result = await getSingleStockByIdService(id);

    res.status(200).send(result);
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: "Get Single Stock By Id Failed",
      error: error.message,
    });
  }
};
