const express = require("express");

const router = express.Router();

const stocksHandleController = require("../Controllers/StockController");

router.route("/").get(stocksHandleController.getAllStocksController);

module.exports = router;
