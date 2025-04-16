const express = require("express");

const router = express.Router();

const stockOrderHandleController = require("../Controllers/StockOrderController");

router
  .route("/createNewStockOrder")
  .post(stockOrderHandleController.createNewStockOrderController);

router
  .route("/getAllStockOrders")
  .get(stockOrderHandleController.getAllStockOrderController);

module.exports = router;
