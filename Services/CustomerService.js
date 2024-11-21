const CustomerModel = require("../models/Customer");

// Create New Customer
exports.createNewCustomerService = async (newCustomer) => {
  // console.log("New customer - service" + newCustomer);
  const result = await CustomerModel.create(newCustomer);
  return result;
};

// Get Customer by Id
exports.getCustomerDetailsById = async (id) => {
  const result = await CustomerModel.findById(id);
  return result;
};
