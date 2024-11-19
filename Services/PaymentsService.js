const paymentModel = require("../models/Payments");

exports.createNewPaymentService = async (payment) => {
  console.log(payment);
  const result = await paymentModel.create(payment);

  console.log(result);
  return result;
};
