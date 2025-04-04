const {
  createNewItemService,
  getAllItemService,
  getItemByIdService,
} = require("../Services/ItemService");

exports.createNewItemController = async (req, res, next) => {
  //   console.log("req", req.body);
  const newItem = req.body;
  // console.log(newItem);

  try {
    const result = await createNewItemService(newItem);

    res.status(200).send(result);
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: "Create New Item Failed",
      error: error.message,
    });
  }
};

exports.getAllItemController = async (req, res, next) => {
  try {
    const result = await getAllItemService();

    res.status(200).send(result);
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: "Get All Item Failed",
      error: error.message,
    });
  }
};

exports.getSingleItemByIdController = async (req, res, next) => {
  const id = req.params.productId;
  console.log(id);
  try {
    const result = await getItemByIdService(id);

    res.status(200).send(result);
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: "Get All Item Failed",
      error: error.message,
    });
  }
};
