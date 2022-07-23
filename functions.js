const { By } = require("selenium-webdriver")
const { first_page, second_page, third_page, general, error } = require("./elements.json")
const { setTimeout } = require("timers/promises");

var click_button = async (driver, button, method = By.css) => {
    await driver.findElement(method(button)).click()
};

var wait = async (ms) => {
    console.log("waiting "+ms+" seconds...")
    await setTimeout(1000*ms);
    console.log("waited "+ms+" seconds")
}

var print_highlited = (text) => {
    console.log("\n\n"+text+"\n\n")
}

var pre_whole_cycle = async (driver) => {
    await driver.get(general.gouv_url);
    await click_button(driver, first_page.case_à_cocher)
    await click_button(driver, first_page.bouton_demande_rdv)
}

var one_cycle = async (driver, radio_button, method = By.css) => {
    // second page //ok
    await click_button(driver, radio_button, method);
    await click_button(driver, second_page.bouton_étape_suivante, method)
    // third page //ko
    let text = await driver.findElement(By.css(third_page.texte_non)).getText(); //undefined??
    console.log(text)
    if (text === third_page.message_no_rdv_found){
        print_highlited("no available RDVs.");
        console.log("before history.back")
        await driver.navigate().back()
        console.log("after history.back")
    }
    else{
        print_highlited("YES!!")
        await wait(100000)
        //TODO add send mail or SMS
    }
}

var whole_cycle = async (driver, method = By.css) => {
    const buttons = [
        second_page.bouton_radio_1,
        second_page.bouton_radio_2,
        second_page.bouton_radio_3
    ]
    // let a = 0
    // while(!a){
    //     buttons.map(async button => {
    //         a = await one_cycle(driver, button)
    //     })
    // }
    for(let i = 0; i < buttons.length; i++){
        await one_cycle(driver, buttons[i])
    }
}

var handle_error = async (driver) => {
    // console.log("before : "+error.forbidden)
    const error_text = await driver.findElement(By.css(error.forbidden)).getText()
    // console.log(error.forbidden)
    if(error_text === error.surcharge_message){
        print_highlited("Surcharge... Try in a minute")
        await wait(60)
    }
    else if(error_text === error.forbidden_message){
        print_highlited("Forbidden... Try in an hour")
        await wait(3600)
    }
}

module.exports = { click_button, wait, one_cycle, handle_error, whole_cycle, pre_whole_cycle };