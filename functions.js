const { By } = require("selenium-webdriver")
const { first_page, second_page, third_page, general, error } = require("./elements.json")
const { setTimeout } = require("timers/promises");
const { NoSuchElementError } = require("selenium-webdriver/lib/error");
const fs = require("fs")


var click_button = async (driver, button, method = By.css) => {
    await driver.findElement(method(button)).click()
};

var wait = async (ms, file_path) => {
    print_highlited("waiting "+ms+" seconds...", file_path)
    await setTimeout(1000*ms);
    print_highlited("waited "+ms+" seconds", file_path)
}

var print_highlited = (text, file_path) => {
    const d = new Date()
    const time_now = d.toLocaleTimeString()
    const timed_text = `${time_now} : ${text}`
    const timed_n_highlighted_text = `\n${timed_text}\n`
    file_path 
        ? logs_info_in_file(timed_n_highlighted_text, file_path) 
        : console.log(timed_n_highlighted_text)
}

var pre_whole_cycle = async (driver) => {
    await driver.get(general.gouv_url);
    await click_button(driver, first_page.case_à_cocher)
    await click_button(driver, first_page.bouton_demande_rdv)
}

var one_cycle = async (driver, radio_button, file_path) => {
    // second page
    await click_button(driver, radio_button);
    await click_button(driver, second_page.bouton_étape_suivante)
    // third page
    let text = await driver.findElement(By.css(third_page.texte_non)).getText();
    if (text === third_page.message_no_rdv_found){
        print_highlited("no available RDVs.", file_path);
        await driver.navigate().back()
    }
    else{
        print_highlited("YES!!", file_path)
        await wait(100000, file_path)
        //TODO add send mail or SMS
    }
}

var whole_cycle = async (driver, file_path) => {
    const buttons = [
        second_page.bouton_radio_1,
        second_page.bouton_radio_2,
        second_page.bouton_radio_3
    ]
    for(let i = 0; i < buttons.length; i++){
        try{
            await pre_whole_cycle(driver)
            await one_cycle(driver, buttons[i], file_path)
        }
        catch(e){
            if (e instanceof NoSuchElementError){
                console.log("/////********"+ e.name +"********//////")
                console.log("/////****************//////")
                console.error(e)
    
                await handle_error(driver, file_path)

            }
        }
    }
}

var handle_error = async (driver, file_path) => {
    const error_text = await driver.findElement(By.css(error.forbidden)).getText()
    if(error_text === error.surcharge_message){
        print_highlited("surcharge... Try in a minute", file_path)
        await wait(60, file_path)
    }
    else if(error_text === error.forbidden_message){
        print_highlited("forbidden... Try in an hour", file_path)
        await wait(3600, file_path)
    }
}

// files
var creates_file_name = (driver) => {
    const d = new Date()
    const file_date = `${d.toLocaleDateString().replace("/","").replace("/","")}_${d.toLocaleTimeString().replace(":","").replace(":","")}`
    const file_path = "logs\\attempt_at_"+file_date
    return file_path
}

var logs_info_in_file = (info, file_path) => {
    fs.writeFile(file_path, info, {flag : "a"}, err => { console.log(err)})
}

module.exports = { whole_cycle, creates_file_name };