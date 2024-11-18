const Customer = require("../models/Customer");
const { createNewCustomerService } = require("../Services/CustomerService");
const { createNewOrderService } = require("../Services/OrderService");

exports.createNewOrderController = async (req, res, next) => {
  try {
    const newRequest = req.body;

    const customer = newRequest[0];

    // console.log("customer", customer);

    // // Fist Create Customer and get the details

    const createNewCustomerResult = await createNewCustomerService(customer);
    const getDocumentSize = await Customer.countDocuments();
    console.log(getDocumentSize);

    // This will create a new order id increase by depand on dorder doucment size BSJ002451
    const newOrderId = `BSJ${String(getDocumentSize).padStart(6, "0")}`;

    // console.log("createNewCustomer", createNewCustomerResult);

    const order = newRequest[1];
    order.customerId = createNewCustomerResult._id;
    order.orderId = newOrderId;
    console.log("order", order);

    const createNewOrderResult = await createNewOrderService(order);

    console.log(createNewOrderResult);

    const result = "Test From Order Controller";

    res.status(200).send(result);
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: "New Order Create Failed",
      error: error.message,
    });
  }
};
