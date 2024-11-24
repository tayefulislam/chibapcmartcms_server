const axios = require("axios");
const cheerio = require("cheerio");
// const puppeteer = require("puppeteer");
// const fs = require("fs");
// const path = require("path");

// const directory = path.join(__dirname, "pdfs");
// if (!fs.existsSync(directory)) {
//   fs.mkdirSync(directory);
// }

// async function saveWebsiteAsPDF(url, filePath) {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto(url, { waitUntil: "networkidle2" });
//   await page.pdf({ path: filePath, format: "A4" });
//   await browser.close();
//   console.log("PDF saved to", filePath);
// }

let trackId = 711072773143;

const url = `https://trackings.post.japanpost.jp/services/srv/search/direct?reqCodeNo1=${trackId}&searchKind=S002&locale=en`;

let status = "Sent";

axios
  .get(url)
  .then((response) => {
    const html = response.data;
    let $ = cheerio.load(html);

    // Example: Extracting all paragraph text
    // japan post
    let content = $("td")
      .map((i, el) => $(el).text())
      .get()
      .join("\n");

    // new code

    if (content) {
      // Check Return

      if (content.lastIndexOf("Returned to sender") > 1) {
        console.log("Returned to sender");
        console.log(content.lastIndexOf("Returned to sender"));

        status = "Returned";
        // saveWebsiteAsPDF(url, path.join(directory, `${trackId}.pdf`));

        content = "";
      }

      // Check Final Delivery

      if (content.lastIndexOf("Final delivery") > 1) {
        console.log("Final delivery");
        console.log(content.lastIndexOf("Final delivery"));
        status = "Delivered";
        // saveWebsiteAsPDF(url, path.join(directory, `${trackId}.pdf`));
        content = "";
      }

      if (content.lastIndexOf("Allocated to delivery staff") > 1) {
        console.log("Allocated to delivery staff");
        console.log(content.lastIndexOf("Allocated to delivery staff"));
        status = "Out for delivery";
        // saveWebsiteAsPDF(url, path.join(directory, `${trackId}.pdf`));
        content = "";
      }

      // Check Redelivery Status

      if (
        content.lastIndexOf("A request for re-delivery was received") >
        content.lastIndexOf("Absence. Attempted delivery.")
      ) {
        console.log("A request for re-delivery was received ");
        console.log(
          content.lastIndexOf("A request for re-delivery was received")
        );
        status = "Redelivery Done";
        content = "";
      }

      // if (content.lastIndexOf("A request for re-delivery was received") > 1) {
      //   console.log("A request for re-delivery was received ");
      //   console.log(
      //     content.lastIndexOf("A request for re-delivery was received")
      //   );
      //   status = "Redelivery Done";
      //   content = "";
      // }

      // Check Absence

      if (content.lastIndexOf("Absence. Attempted delivery.") > 1) {
        console.log("Absence. Attempted delivery.");
        console.log(content.lastIndexOf("Absence. Attempted delivery."));
        status = "Attempted";
        content = "";
      }

      // Check Investigation ( Normal Happend When address is incorret or Reject the Item)

      if (content.lastIndexOf("Investigation") > 1) {
        console.log("Investigation");
        console.log(content.lastIndexOf("Investigation"));
        status = "Investigation";
        content = "";
      }

      if (content.lastIndexOf("Processing at delivery post office") > 1) {
        console.log("Processing at delivery post office");
        console.log(content.lastIndexOf("Processing at delivery post office"));
        status = "Reached Post Office";
        content = "";
      }

      // Check Out From Post office or not

      if (content.lastIndexOf("En route") > 1) {
        console.log("En route");
        console.log(content.lastIndexOf("En route"));
        status = "En route";
        content = "";
      }

      //

      if (content.indexOf("Posting/Collection") > 1) {
        console.log("Posting/Collection");
        console.log(content.indexOf("Posting/Collection"));
        status = "Post Office Drop";
        content = "";
      }

      //
    }

    console.log(status);

    //

    // old code

    // const content = $("p")
    //   .map((i, el) => $(el).text())
    //   .get()
    //   .join("\n");

    //   console.log(content);

    //   console.log(content.toLocaleLowerCase().includes("final delivery"));

    //   console.log(content.toLocaleLowerCase().indexOf("processing at delivery post office"));

    // console.log(content.lastIndexOf());

    // const finalDeliveryIndex = content.toLocaleLowerCase().indexOf("delivered");

    // if (finalDeliveryIndex > 1) {
    //   const getDeliveryTime = content.slice(
    //     finalDeliveryIndex - 20,
    //     finalDeliveryIndex
    //   );

    //   console.log(getDeliveryTime);
    // }

    //   const returnDeliveryIndex = content.toLocaleLowerCase().indexOf("returned to sender");

    //   console.log(returnDeliveryIndex)

    //   if (returnDeliveryIndex > 1) {

    //       const getDeliveryTime = content.slice(returnDeliveryIndex - 20, returnDeliveryIndex);

    //     console.log(getDeliveryTime)
    //   }
  })
  .catch((error) => {
    console.error(`Error fetching the URL: ${error}`);
  });
