const Customer = require("../models/Customer");
const { createNewCustomerService } = require("../Services/CustomerService");
const { createNewOrderService } = require("../Services/OrderService");

// Create New Customer
exports.createNewOrderController = async (req, res, next) => {
  try {
    const newRequest = req.body;

    // console.log(newRequest);

    const customer = newRequest.customerDetails;

    // // Fist Create Customer and get the details

    const createNewCustomerResult = await createNewCustomerService(customer);
    const getDocumentsSize = await Customer.countDocuments();

    // This will create a new order id increase by depand on dorder doucment size BSJ002451
    const newOrderId = `BSJ${String(getDocumentsSize).padStart(6, "0")}`;

    // inject the customer id and order id
    const order = newRequest.orderDetails;
    console.log(order);
    order.customerId = createNewCustomerResult._id;
    order.orderId = newOrderId;

    const createNewOrderResult = await createNewOrderService(order);

    const result = "ok";

    res.status(200).send(result);
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: "New Order Create Failed",
      error: error.message,
    });
  }
};
