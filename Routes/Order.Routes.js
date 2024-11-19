const express = require("express");

const router = express.Router();

const ordersHandleController = require("../Controllers/OrderController");

router
  .route("/getAllOrderDetails")
  .get(ordersHandleController.getAllOrderDetailsController);

router
  .route("/createOrder")
  .post(ordersHandleController.createNewOrderController);

module.exports = router;
