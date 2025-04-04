const itemModel = require("../models/Item");

exports.createNewItemService = async (item) => {
  console.log(item);
  const result = await itemModel.create(item);
  return result;
};

exports.getAllItemService = async () => {
  const result = await itemModel.find({});
  return result;
};

exports.getItemByIdService = async (id) => {
  console.log(id);
  const result = await itemModel.findById({ _id: id });
  return result;
};
