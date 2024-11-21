const cron = require("node-cron");
const path = require("path");
const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());

// UpdateDeliveryAndPaymentStatus
const UpdateDeliveryAndPaymentStatus = require("./utils/UpdateDeliveryAndPaymentStatus/UpdateDeliveryAndPaymentStatus");

//Schedule the function to run at the top of every hour

// cron.schedule("* * * * * *", () => {
//   UpdateDeliveryAndPaymentStatus();
// });

const orderRequestRoute = require("./Routes/Order.Routes");
const customerRequestRoute = require("./Routes/Customer.Routes");

app.get("/", (req, res) => {
  res.send("CHIBA PC MART API - DEV");
});

// Define a route to serve the PDF file
app.get("/pdfs/:fileName", (req, res) => {
  console.log("hello");
  const fileName = req.params.fileName;
  const directory = path.join(__dirname, "pdfs");
  const filePath = path.join(directory, fileName);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(404).send("File not found");
    }
  });
});

app.use("/api/v1/orders", orderRequestRoute);
app.use("/api/v1/customer", customerRequestRoute);

module.exports = app;
