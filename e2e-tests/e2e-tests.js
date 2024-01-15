// import chromedriver so that selenium can by itself open a chrome driver
require("chromedriver");

// import this class from selenium
const {Builder} = require("selenium-webdriver");

(async function openChromeTest() {
    // open chrome browser
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        // go to example website
        await driver.get("file:///C:/Users/iekorkmaz/WebstormProjects/browser_extension_db/popup.html");
        await driver.manage().window().setRect({ width: 500, height: 550 });
        await driver.sleep(3000)
    } finally {
        // close the chrome browser
        await driver.quit();
    }
})();