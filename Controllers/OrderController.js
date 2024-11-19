const Order = require("../models/Order");
const { createNewCustomerService } = require("../Services/CustomerService");
const { createNewOrderService } = require("../Services/OrderService");

// Create New Customer
exports.createNewOrderController = async (req, res, next) => {
  try {
    const newRequest = req.body;

    const customer = newRequest.customerDetails;

    const getDocumentsSize = await Order.countDocuments();

    // This will create a new order id increase by depand on dorder doucment size BSJ002451
    let newOrderId = `BSJ${String(getDocumentsSize).padStart(6, "0")}`;

    // DUPLICATE ORDER ID CHECK
    // let getLastOrder = await Order.find()
    //   .sort({ _id: -1 })
    //   .select("orderId")
    //   .limit(1);

    // console.log("Hello", getLastOrder[0].orderId);

    // // IF THE ORDER ID IS DUPLICATE THEN CREATE A NEW ORDER ID
    // if (getLastOrder[0].orderId === newOrderId) {
    //   newOrderId = `BSJA${String(getDocumentsSize + 3 + "D").padStart(5, "0")}`;
    // }

    // // Fist Create Customer and get the details
    const createNewCustomerResult = await createNewCustomerService(customer);

    // inject the customer id and order id
    const newOrder = newRequest.orderDetails;
    newOrder.customerId = createNewCustomerResult._id;
    newOrder.orderId = newOrderId;

    // Create New Order and get the details
    const createNewOrderResult = await createNewOrderService(newOrder);

    const result = createNewOrderResult;

    res.status(200).send(result);
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: "New Order Create Failed",
      error: error.message,
    });
  }
};
