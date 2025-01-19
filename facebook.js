const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: true }); // Headless mode
  const page = await browser.newPage();
  const url = "https://www.facebook.com/profile.php?id=100093664735002"; // Replace with the desired URL

  try {
    // await page.setUserAgent(
    //   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    // );

    await page.goto(url, { waitUntil: "networkidle2" });

    // Get the entire HTML of the page
    const html = await page.content();

    const links = html.match(/xlink:href="([^"]*)"/g);

    const formattedLinks = links.map((link) =>
      link.replace(/xlink:href="/g, "href=")
    );

    const firstLink = formattedLinks[0].replace(/"/g, "").replace(/href=/g, "");
    console.log(firstLink.replace(/amp;/g, ""));

    // Copy to clipboard
  } catch (error) {
    console.error("Error fetching HTML:", error.message);
  } finally {
    await browser.close(); // Close the browser
  }
})();
