let settingElementFunctions = {
    "settingFontSize": ({value}) => {
        document.documentElement.style.setProperty('--font-size', `${value}px`);
    },
    "settingFontStyle": ({value}) => {
        document.documentElement.style.setProperty('--font-family', `${value}`);
    },
    "settingAppearance": ({value}) => {
        if(value === "system"){
            document.documentElement.style.setProperty('--theme-color-0', "");
            document.documentElement.style.setProperty('--theme-color-1', "");
            document.documentElement.style.setProperty('--theme-color-2', "");
            document.documentElement.style.setProperty('--theme-color-3', "");
            document.documentElement.style.setProperty('--font-color', "");
        }else{
            document.documentElement.style.setProperty('--theme-color-0', `var(--${value}-theme-color-0)`);
            document.documentElement.style.setProperty('--theme-color-1', `var(--${value}-theme-color-1)`);
            document.documentElement.style.setProperty('--theme-color-2', `var(--${value}-theme-color-2)`);
            document.documentElement.style.setProperty('--theme-color-3', `var(--${value}-theme-color-3)`);
            document.documentElement.style.setProperty('--font-color', `var(--${value}-font-color)`);
        }
        document.getElementById("statusbarColor").content = getComputedStyle(document.body).getPropertyValue("--theme-color-0");
    },
    "settingStartScreen": ({value, isStartUp}) => {
        if(isStartUp){
            document.getElementById(value).checked = true;
        }
    },
    "multipleChoiceQuestionSetting": ({value}) => {

    },
    "gapTextQuestionSetting": ({value}) => {

    },
    "textQuestionSetting": ({value}) => {

    },
    "questionCounterSetting": ({value}) => {
        
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
