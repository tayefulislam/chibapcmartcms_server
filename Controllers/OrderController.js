const OrderModel = require("../models/Order");
const PaymentModel = require("../models/Payments");
const { createNewCustomerService } = require("../Services/CustomerService");
const {
  createNewOrderService,
  getAllOrderDetailsService,
} = require("../Services/OrderService");

const { createNewPaymentService } = require("../Services/PaymentsService");

// Create New Customer
exports.createNewOrderController = async (req, res, next) => {
  try {
    const newRequest = req.body;

    const customer = newRequest.customerDetails;
    const payment = newRequest.paymentDetails;

    const getOrderDocumentsSize = await OrderModel.countDocuments();
    const getPaymentDocumentsSize = await PaymentModel.countDocuments();
    // console.log(payment);

    // This will create a new order id increase by depand on dorder doucment size BSJ002451
    let newOrderId = `BSJ${String(getOrderDocumentsSize).padStart(6, "0")}`;

    // This will create a new payment id increase by depand on dorder doucment size PAY002451
    let newPaymentId = `PAY${String(getPaymentDocumentsSize).padStart(6, "0")}`;

    // DUPLICATE ORDER ID CHECK
    // let getLastOrder = await Order.find()
    //   .sort({ _id: -1 })
    //   .select("orderId")
    //   .limit(1);

    // console.log("Hello", getLastOrder[0].orderId);

    // // IF THE ORDER ID IS DUPLICATE THEN CREATE A NEW ORDER ID
    // if (getLastOrder[0].orderId === newOrderId) {
    //   newOrderId = `BSJA${String(getOrderDocumentsSize + 3 + "D").padStart(5, "0")}`;
    // }

    // // Fist Create Customer and get the details
    const createNewCustomerResult = await createNewCustomerService(customer);

    // Create New payment and get details
    payment.paymentId = newPaymentId;
    payment.customerId = createNewCustomerResult._id;
    payment.orderId = newOrderId;

    // console.log(payment);

    const createNewPayment = await createNewPaymentService(payment);

    // inject the customer id , payment id and order id
    const newOrder = newRequest.orderDetails;
    newOrder.customerId = createNewCustomerResult._id;
    newOrder.paymentObjId = createNewPayment._id;
    newOrder.orderId = newOrderId;
    newOrder.paymentId = newPaymentId;

    // Create New Order and get the details
    const createNewOrderResult = await createNewOrderService(newOrder);
    console.log(createNewOrderResult);

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

// GET ALL ORDER DETAILS
exports.getAllOrderDetailsController = async (req, res, next) => {
  console.log("checked");
  try {
    const result = await getAllOrderDetailsService();

    res.status(200).send(result);
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: "Get All Order Details Failed",
      error: error.message,
    });
  }
};
