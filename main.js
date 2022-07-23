const { Builder, By, Key, until } = require("selenium-webdriver")
const chrome = require("selenium-webdriver/chrome");
const { NoSuchElementError } = require("selenium-webdriver/lib/error");


const fail = '//*[@id="FormBookingCreate"]'
const fail_css = "#FormBookingCreate"

let driver = new Builder()
.forBrowser("chrome")
.setChromeOptions()
.build()

const { general, error, first_page, second_page, third_page } = require("./elements.json");
const { click_button, wait, handle_error, whole_cycle, pre_whole_cycle } = require("./functions");


(async () => {
    try{
        await pre_whole_cycle(driver)

        while(1){
            await whole_cycle(driver)
        }
    }
    catch(e){
        if (e instanceof NoSuchElementError){
            console.log("/////********"+ e.name +"********//////")
            console.log("/////****************//////")
            console.error(e)

            await handle_error(driver)

            await wait(50)
        }
    }
})();