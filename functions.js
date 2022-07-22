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

var one_cycle = async (driver, radio_button, method = By.css) => {
    // second page //ok
    await click_button(driver, radio_button, method);
    await click_button(driver, second_page.bouton_étape_suivante, method)
    // third page //ko
    let text = await driver.findElement(By.css(third_page.texte_non)).getText(); //undefined??
    console.log(text)
    if (text === third_page.message_no_rdv_found){
        print_highlited("no available RDVs.");
        // await driver.back();
    }
    else{
        print_highlited("YES!!")
        await wait(100000)
        //TODO add send mail or SMS
    }
}

var whole_cycle = async (driver, method = By.css) => {
    buttons = [
        second_page.bouton_radio_1,
        second_page.bouton_radio_2,
        second_page.bouton_radio_3
    ]
    buttons.map(button => {
        one_cycle(driver, button)
    })
}

var handle_error = async (driver) => {
    console.log("before : "+error.forbidden)
    await driver.findElement(By.css, error.forbidden)
    console.log(error.forbidden)
}

module.exports = { click_button, wait, one_cycle, handle_error, whole_cycle };