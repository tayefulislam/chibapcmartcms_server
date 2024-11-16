require("dotenv").config();

const app = require("./app");
const { default: mongoose } = require("mongoose");

const port = process.env.PORT || 5000;
const uri = process.env.URI;

mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
