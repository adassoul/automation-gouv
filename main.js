const { Builder, By, Key, until } = require("selenium-webdriver")
const chrome = require("selenium-webdriver/chrome");

let driver = new Builder()
.forBrowser("chrome")
.setChromeOptions()
.build()

const { whole_cycle, creates_file_name } = require("./functions");

(async () => {
    const file_path = creates_file_name(driver)
    
    while(1){
        await whole_cycle(driver, file_path)
    }
})();