const { createStockOrderService } = require("../Services/stockOrderService");
const { createStocksService } = require("../Services/stocksService");

exports.createNewStockOrderController = async (req, res, next) => {
  try {
    const { entries, stockOrder } = req.body;
    console.log(stockOrder);

    // const result = await createNewCustomerService(newRequest);

    const createStockOrder = await createStockOrderService(stockOrder);
    const createStocks = await createStocksService(entries);
    res.status(200).send({ createStockOrder, createStocks });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: "New Customer Create Failed",
      error: error.message,
    });
  }
};
