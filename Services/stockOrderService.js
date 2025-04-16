const stockOrderModel = require("../models/StockOrder");

exports.createStockOrderService = async (stockOrder) => {
  const result = await stockOrderModel.create(stockOrder);
  return result;
};

exports.getAllStockOrderService = async () => {
  const result = await stockOrderModel.find({});
  return result;
};
