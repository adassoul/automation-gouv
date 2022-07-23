const { Builder, By, Key, until } = require("selenium-webdriver")
const chrome = require("selenium-webdriver/chrome");
const { NoSuchElementError } = require("selenium-webdriver/lib/error");


const fail = '//*[@id="FormBookingCreate"]'
const fail_css = "#FormBookingCreate"

let driver = new Builder()
.forBrowser("chrome")
.setChromeOptions()
.build()

const gouv_url = "https://www.val-doise.gouv.fr/booking/create/11343";
const { general, error, first_page, second_page, third_page } = require("./elements.json");
const { click_button, wait, one_cycle, handle_error, whole_cycle } = require("./functions");


(async () => {
    try{
        await driver.get(gouv_url);
        
        // first page
        // await click_button(driver, general.cookies)
        await click_button(driver, first_page.case_à_cocher)
        await click_button(driver, first_page.bouton_demande_rdv)


        let a = 0
        if(a){
            //1
            // second page
            await click_button(driver, second_page.bouton_radio_1);
            await click_button(driver, second_page.bouton_étape_suivante)
            // third page //ko
            console.log("1st try if wait")
            await wait(100)
            let text = await driver.findElement(By.css("#FormBookingCreate")).getText()
            console.log("2nd try if wait")
            await wait(100)
        }
        else {
            //2
            let un_cycle = 0
            console.log("1st try else wait")
            await wait(general.time_stamp)
            if(un_cycle){
                console.log("1st try else if wait")
                await wait(general.time_stamp)
                await one_cycle(driver, second_page.bouton_radio_1)
                try{
                    
                }
                catch(e){
                    console.log("!!"+e+"!!")
                }
                console.log("after history.back")

                await wait(10000)


            }
            else{
                console.log("1st try else else wait")
                await wait(general.time_stamp)
                while(1){
                    await whole_cycle(driver)
                }
            }
        }

    }
    catch(e){
        if (e instanceof NoSuchElementError){
            console.error("/////********"+ e.name +"********//////")
            console.error("/////****************//////")
            console.error("/////********"+ e +"********//////")
            console.error("/////****************//////")
            // console.log(Object.keys(e))
            console.log("1st catch wait")
            await wait(2)
            await handle_error(driver)
            console.log("2nd catch wait")
            await wait(50)
        }
        // console.log(e)
    }
})();