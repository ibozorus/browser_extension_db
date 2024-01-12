// import chromedriver so that selenium can by itself open a chrome driver
require("chromedriver");

// import this class from selenium
const { Builder } = require("selenium-webdriver");

(async function openChromeTest() {
    // open chrome browser
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        // go to example website
        await driver.get("https://example.com/");
    } finally {
        // close the chrome browser
        await driver.quit();
    }
})();