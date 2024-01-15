// import chromedriver so that selenium can by itself open a chrome driver
require("chromedriver");
const assert = require("assert");

const {Builder, By} = require("selenium-webdriver");

describe('First script', function () {
    let driver;

    before(async function () {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.get('file:///C:/Users/iekorkmaz/WebstormProjects/browser_extension_db/popup.html');
    });

    it('Verbindunssuche Elemente Displayed Test', async function () {
        let homePage = await driver.findElement(By.css('#homepage'));
        assert.equal(true, await homePage.isDisplayed());
    });

    after(async () => await driver.quit());
});