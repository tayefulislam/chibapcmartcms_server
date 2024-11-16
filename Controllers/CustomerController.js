const { createNewCustomerService } = require("../Services/CustomerService");

exports.createNewCustomerController = async (req, res, next) => {
  try {
    const newRequest = req.body;
    const result = await createNewCustomerService(newRequest);
    res.status(200).send(result);
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: "New Customer Create Failed",
      error: error.message,
    });
  }
};
