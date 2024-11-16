const CustomerModel = require("../models/Customer");

exports.createNewCustomerService = async (newCustomer) => {
  const result = await CustomerModel.create(newCustomer);
  return result;
};
