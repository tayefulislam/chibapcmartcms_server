exports.createNewStockOrderController = async (req, res, next) => {
  try {
    const newRequest = req.body;
    console.log(newRequest);
    // const result = await createNewCustomerService(newRequest);
    res.status(200).send("tes");
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: "New Customer Create Failed",
      error: error.message,
    });
  }
};
