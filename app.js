const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const orderRequestRoute = require("./Routes/Order.Routes");

app.get("/", (req, res) => {
  res.send("CHIBA PC MART API - DEV");
});

app.use("/api/v1/orders", orderRequestRoute);

module.exports = app;
