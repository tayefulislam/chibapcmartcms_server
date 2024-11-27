const moment = require("moment-timezone");

// Example input date and time
const getDeliveryTime = "11/23/2024 18:58";

// Parse the date as Japanese time zone
const deliveryDateJST = moment
  .tz(getDeliveryTime, "MM/DD/YYYY HH:mm", "Asia/Tokyo")
  .format();

// Format to ISO 8601 (which includes the timezone offset)
console.log("Japanese Time (JST):", deliveryDateJST); // Outputs: 2024-11-27T19:56:00+09:00
