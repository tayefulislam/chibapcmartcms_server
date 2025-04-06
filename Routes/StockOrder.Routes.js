const express = require("express");

const router = express.Router();

const stockOrderHandleController = require("../Controllers/StockOrderController");

router
  .route("/createNewStockOrder")
  .post(stockOrderHandleController.createNewStockOrderController);

module.exports = router;
