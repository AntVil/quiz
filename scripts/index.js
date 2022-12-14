let quiz;

window.onload = async function(){
    if("serviceWorker" in navigator){
        navigator.serviceWorker.register("./serviceWorker.js");
    }

    setViewportSize();

    await loadQuiz();

    loadSettings();
    
    loadStatistic();
    loadQuestionList();
}

window.onresize = () => {
    if(document.activeElement.tagName !== 'TEXTAREA' && document.activeElement.tagName !== 'INPUT'){
        setViewportSize();
    }
}

window.onorientationchange = () => {
    // check if keyboard is used
    if(document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'INPUT'){
        document.activeElement.blur();
    }
    setViewportSize();
}

/**
 * sets the css viewport size, since vw and vh are not consistent
 */
function setViewportSize(){
    document.documentElement.style.setProperty('--screen-width', `${window.innerWidth}px`);
    document.documentElement.style.setProperty('--screen-height', `${window.innerHeight}px`);
}

/**
 * loads the quiz from cache or downloads it and adjusts the cached statistic if necessary
 */
async function loadQuiz(){
    let downloadedQuiz;
    let cachedQuiz;
    
    try{
        downloadedQuiz = (await (await fetch("quiz.txt")).text()).split("\n").map(s => s.trim()).filter(s => s.length > 0);
    }catch{

    }
    
    try{
        cachedQuiz = localStorage.getItem("quizQuestions").split("\n").map(s => s.trim()).filter(s => s.length > 0);
    }catch{
        quiz = downloadedQuiz;
        return;
    }

    if(downloadedQuiz === undefined){
        quiz = cachedQuiz;
    }else{
        quiz = downloadedQuiz;
        
        let cachedStatistic = localStorage.getItem("quizStatistics");
        let newStatistic = "";

        for(let i=0;i<quiz.length;i++){
            let index = -1;
            for(let j=0;j<cachedQuiz.length;j++){
                if(quiz[i].startsWith(`${cachedQuiz[j].split("#")[0]}#`)){
                    index = j;
                    break;
                }
            }
            if(index !== -1 && cachedStatistic[index] !== undefined){
                newStatistic += cachedStatistic[index];
            }else{
                newStatistic += STATISTICS_MAX_COUNT;
            }
        }

        localStorage.setItem("quizStatistics", newStatistic);
    }
}
