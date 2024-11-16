const { createNewCustomerService } = require("../Services/CustomerService");

exports.createNewOrderController = async (req, res, next) => {
  try {
    const newRequest = req.body;
    // console.log(newRequest);
    // const customer = newRequest[0];

    // console.log("customer", customer);
    // const order = newRequest[1];
    // console.log("order", order);

    // // Fist Create Customer and get the details

    // const createNewCustomer = await createNewCustomerService(customer);
    // console.log("createNewCustomer", createNewCustomer);

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
