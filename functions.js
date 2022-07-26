const { By } = require("selenium-webdriver")
const { first_page, second_page, third_page, general, error } = require("./elements.json")
const { setTimeout } = require("timers/promises");
const { NoSuchElementError } = require("selenium-webdriver/lib/error");

var click_button = async (driver, button, method = By.css) => {
    await driver.findElement(method(button)).click()
};

var wait = async (ms) => {
    const d = new Date()
    console.log(d.toLocaleTimeString() + " : waiting "+ms+" seconds...")
    await setTimeout(1000*ms);
    console.log(d.toLocaleTimeString() + " : waited "+ms+" seconds")
}

var print_highlited = (text) => {
    console.log("\n\n"+text+"\n\n")
}

var pre_whole_cycle = async (driver) => {
    await driver.get(general.gouv_url);
    await click_button(driver, first_page.case_à_cocher)
    await click_button(driver, first_page.bouton_demande_rdv)
}

var one_cycle = async (driver, radio_button) => {
    // second page
    await click_button(driver, radio_button);
    await click_button(driver, second_page.bouton_étape_suivante)
    // third page
    let text = await driver.findElement(By.css(third_page.texte_non)).getText();
    if (text === third_page.message_no_rdv_found){
        print_highlited("no available RDVs.");
        await driver.navigate().back()
    }
    else{
        print_highlited("YES!!")
        await wait(100000)
        //TODO add send mail or SMS
    }
}

var whole_cycle = async (driver) => {
    const buttons = [
        second_page.bouton_radio_1,
        second_page.bouton_radio_2,
        second_page.bouton_radio_3
    ]
    for(let i = 0; i < buttons.length; i++){
        try{
            await pre_whole_cycle(driver)
            await one_cycle(driver, buttons[i])
        }
        catch(e){
            if (e instanceof NoSuchElementError){
                console.log("/////********"+ e.name +"********//////")
                console.log("/////****************//////")
                console.error(e)
    
                await handle_error(driver)

            }
        }
    }
}

var handle_error = async (driver) => {
    const error_text = await driver.findElement(By.css(error.forbidden)).getText()
    const d = new Date()
    if(error_text === error.surcharge_message){
        print_highlited(d.toLocaleTimeString() + " : surcharge... Try in a minute")
        await wait(60)
    }
    else if(error_text === error.forbidden_message){
        print_highlited(d.toLocaleTimeString() + " : forbidden... Try in an hour")
        await wait(3600)
    }
}

module.exports = { whole_cycle };