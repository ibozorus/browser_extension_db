// import chromedriver so that selenium can by itself open a chrome driver
require("chromedriver");
const assert = require("assert");

const {Builder, By, until} = require("selenium-webdriver");

describe('First script', function () {
    let driver;
    this.timeout(50000)
    const path = "file:///C:/Users/iekorkmaz/WebstormProjects/browser_extension_db/popup.html"
    before(async function () {
        driver = await new Builder().forBrowser('chrome').build();
    });

    it('Verbindunssuche Elemente Displayed Test', async function () {
        await driver.get(path);
        let homePage = await driver.findElement(By.css('#homepage'));
        let dropDownMenu = await driver.findElement(By.css('#dropdownMenuButton1'));
        let vonInput = await driver.findElement(By.css('#von-input'));
        let stationTauschen = await driver.findElement(By.css('#station-tauschen'));
        let nachInput = await driver.findElement(By.css('#nach-input'));
        let suchenButton = await driver.findElement(By.css('#suchen-button'));
        assert.equal(true, await homePage.isDisplayed());
        assert.equal(true, await dropDownMenu.isDisplayed());
        assert.equal(true, await vonInput.isDisplayed());
        assert.equal(true, await stationTauschen.isDisplayed());
        assert.equal(true, await nachInput.isDisplayed());
        assert.equal(true, await suchenButton.isDisplayed());
    });
    it('Verbindunssuche Interaktion Test', async function () {
        await driver.get(path);
        let vonInput = await driver.findElement(By.css('#von-input'));
        let vonInputModal = await driver.findElement(By.css('#von-input-modal'));
        let stationTauschen = await driver.findElement(By.css('#station-tauschen'));
        let nachInput = await driver.findElement(By.css('#nach-input'));
        let nachInputModal = await driver.findElement(By.css('#nach-input-modal'));
        let suchenButton = await driver.findElement(By.css('#suchen-button'));

        assert.equal(true, await vonInput.isEnabled());
        assert.equal(true, await stationTauschen.isEnabled());
        assert.equal(true, await nachInput.isEnabled());
        assert.equal(true, await suchenButton.isEnabled());

        vonInput.click();
        vonInputModal.click();
        vonInputModal.sendKeys("W");
        vonInputModal.sendKeys("e");
        vonInputModal.sendKeys("i");
        vonInputModal.sendKeys("m");
        vonInputModal.sendKeys("a");
        vonInputModal.sendKeys("r");
        await driver.sleep(5000)
        await driver.findElement(await By.css("#von-liste > div:first-child")).click();
        nachInput.click();
        nachInputModal.click();
        nachInputModal.sendKeys("E");
        nachInputModal.sendKeys("r");
        nachInputModal.sendKeys("f");
        nachInputModal.sendKeys("u");
        nachInputModal.sendKeys("r");
        nachInputModal.sendKeys("t");
        await driver.sleep(5000);
        await driver.findElement(await By.css("#nach-liste > div:first-child")).click();
        await driver.findElement(await By.css("#suchen-button")).click();
        await driver.sleep(5000);
        assert.equal(true, await driver.findElement(By.css("#result-items")).isDisplayed());

    });
    it('Options and Hinfahrtsdatum Sichtbarkeitstest', async function () {
        await driver.get('file:///C:/Users/iekorkmaz/WebstormProjects/browser_extension_db/popup.html');
        let hinfahrtButton = await driver.findElement(By.css('#verbindungs-suche > div.container > form > div > div:nth-child(3) > button'));
        let optionsButton = await driver.findElement(By.css('#verbindungs-suche > div.container > form > div > div:nth-child(4) > button'));
        hinfahrtButton.click();
        assert.equal(true, await driver.findElement(By.css("#hinfahrt-modal > div > div > div.modal-body.row > div")).isDisplayed());
        assert.equal(true, await driver.findElement(By.css("#apply-hinfahrt")).isDisplayed());
        await driver.findElement(By.css("#apply-hinfahrt")).click();
        optionsButton.click();
        assert.equal(true, await driver.findElement(By.css("#options-modal > div > div > div.modal-body.row > div.form-check.col-6")).isDisplayed());
        assert.equal(true, await driver.findElement(By.css("#options-modal > div > div > div.modal-body.row > div.form-group.col-6")).isDisplayed());
        assert.equal(true, await driver.findElement(By.css("#apply-options")).isDisplayed());
        await driver.findElement(By.css("#withBike")).click();
        let maxTransfers = await driver.findElement(By.css("#maxTransfers"));
        maxTransfers.click();
        maxTransfers.sendKeys(1);
        await driver.findElement(By.css("#apply-options")).click();
    });
    it('Fahrplan Test', async function () {
        await driver.get(path);
        let dropDownMenu = await driver.findElement(By.css('#dropdownMenuButton1'));
        let wechselFahrplan = await driver.findElement(By.css('#wechsel-fahrplan'));
        let haltestelleInput = await driver.findElement(By.css("#haltestelle-input"));
        let vonInput = await driver.findElement(By.css("#von-input"));
        dropDownMenu.click();
        wechselFahrplan.click();
        await driver.sleep(1000)
        haltestelleInput.click();
        await driver.sleep(1000)
        vonInput.click();
        vonInput.sendKeys("W");
        vonInput.sendKeys("e");
        vonInput.sendKeys("i");
        vonInput.sendKeys("m");
        vonInput.sendKeys("a");
        vonInput.sendKeys("r");
        await driver.sleep(1000);
        //await driver.findElement(await By.css("#von-liste > li:first-child")).click();
    });

    after(async () => await driver.quit());
});