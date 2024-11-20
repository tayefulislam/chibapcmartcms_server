const orderModel = require("../../models/Order");

async function UpdateDeliveryAndPaymentStatus() {
  const result = await orderModel
    .find(
      { deliveryStatus: { $nin: ["Canceled", "Delivered", "Pending"] } },
      "_id"
    )
    .populate({
      path: "paymentObjId",
      select: "courierName trackId",
    })
    .exec();

  result?.map((item) => {
    if (item.paymentObjId.trackId) {
      console.log(item);
    }
  });
}

module.exports = UpdateDeliveryAndPaymentStatus;
