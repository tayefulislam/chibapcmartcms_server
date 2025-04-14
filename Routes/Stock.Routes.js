const express = require("express");

const router = express.Router();

const stocksHandleController = require("../Controllers/StockController");

router.route("/allStocks").get(stocksHandleController.getAllStocksController);
router.route("/:id").get(stocksHandleController.getSingleStockByIdController);

module.exports = router;
