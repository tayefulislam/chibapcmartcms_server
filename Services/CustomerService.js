const CustomerModel = require("../models/Customer");

exports.createNewCustomerService = async (newCustomer) => {
  console.log("New customer - service" + newCustomer);

  const result = await CustomerModel.create(newCustomer);

  // console.log(result);

  return result;
};
