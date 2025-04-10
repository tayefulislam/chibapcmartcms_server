const stocksModel = require("../models/Stocks");

exports.createStocksService = async (entries) => {
  const result = await stocksModel.insertMany(entries);
  return result;
};

exports.getAllStocksService = async () => {
  const result = await stocksModel.find({}).populate("productId");
  return result;
};
