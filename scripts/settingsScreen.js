let settingElementFunctions = {
    "settingFontSize": ({value}) => {
        document.documentElement.style.setProperty('--font-size', `${value}px`);
    },
    "settingFontStyle": ({value}) => {
        document.documentElement.style.setProperty('--font-family', `${value}`);
    },
    "settingAppearance": ({value}) => {
        if(value === "light"){
            document.documentElement.style.setProperty('--theme-color-0', "var(--light-theme-color-0)");
            document.documentElement.style.setProperty('--theme-color-1', "var(--light-theme-color-1)");
            document.documentElement.style.setProperty('--theme-color-2', "var(--light-theme-color-2)");
            document.documentElement.style.setProperty('--theme-color-3', "var(--light-theme-color-3)");
            document.documentElement.style.setProperty('--font-color', "var(--light-font-color)");
        }else if(value === "dark"){
            document.documentElement.style.setProperty('--theme-color-0', "var(--dark-theme-color-0)");
            document.documentElement.style.setProperty('--theme-color-1', "var(--dark-theme-color-1)");
            document.documentElement.style.setProperty('--theme-color-2', "var(--dark-theme-color-2)");
            document.documentElement.style.setProperty('--theme-color-3', "var(--dark-theme-color-3)");
            document.documentElement.style.setProperty('--font-color', "var(--dark-font-color)");
        }else{
            document.documentElement.style.setProperty('--theme-color-0', "");
            document.documentElement.style.setProperty('--theme-color-1', "");
            document.documentElement.style.setProperty('--theme-color-2', "");
            document.documentElement.style.setProperty('--theme-color-3', "");
            document.documentElement.style.setProperty('--font-color', "");
        }
    },
    "settingStartScreen": ({value, isStartUp}) => {
        if(isStartUp){
            document.getElementById(value).checked = true;
        }
    }
};

/**
 * loads all settings from previous sessions
 * is called once at the start
 */
function loadSettings(){
    let settings = JSON.parse(localStorage.getItem("quizSettings"));
    if(settings === undefined || settings === null || settings === ""){
        settings = {};
    }

    for(let settingElementId of Object.keys(settingElementFunctions)){
        if(settingElementId in settings){
            document.getElementById(settingElementId).value = settings[settingElementId];
        }
    }
    
    saveSettings(true);
}

/**
 * applies all settings and saves them for future sessions
 * @param {boolean} isStartUp 
 */
function saveSettings(isStartUp){
    let settings = {};
    for(let settingElementId of Object.keys(settingElementFunctions)){
        let value = document.getElementById(settingElementId).value;
        settings[settingElementId] = value;
        settingElementFunctions[settingElementId]({
            value: value,
            isStartUp: isStartUp
        });
    }
    localStorage.setItem("quizSettings", JSON.stringify(settings));
}

/**
 * prompts the user to confirm the deletion of all statistic data
 */
function promptResetStatistic(){
    if(window.confirm("Gesamte Statistik zurücksetzen?")){
        resetStatistic();
    }
}
