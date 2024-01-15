// import chromedriver so that selenium can by itself open a chrome driver
require("chromedriver");
const assert = require("assert");

// import this class from selenium
const {Builder, By} = require("selenium-webdriver");

describe('First script', function () {
    let driver;

    before(async function () {
        driver = await new Builder().forBrowser('chrome').build();
    });

    it('Verbindunssuche Elemente Displayed Test', async function () {
        await driver.get('file:///C:/Users/iekorkmaz/WebstormProjects/browser_extension_db/popup.html');
        let homePage = await driver.findElement(By.css('#homepage'));
        assert.equal(true, await homePage.isDisplayed());
    });

    after(async () => await driver.quit());
});