const { Builder, By, Key, until } = require("selenium-webdriver")
const chrome = require("selenium-webdriver/chrome");

let driver = new Builder()
.forBrowser("chrome")
.setChromeOptions()
.build()

const { whole_cycle } = require("./functions");

(async () => {
    while(1){
        await whole_cycle(driver)
    }
})();