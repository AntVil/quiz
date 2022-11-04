let quiz;

window.onload = async function(){
    if("serviceWorker" in navigator){
        navigator.serviceWorker.register("./serviceWorker.js");
    }

    setViewportSize();

    try{
        quiz = await (await fetch("quiz.txt")).text();
        localStorage.setItem("quizQuestions", quiz);
    }catch{
        quiz = localStorage.getItem("quizQuestions");
    }
    quiz = quiz.split("\n").map(s => s.trim()).filter(s => s.length > 0);
    
    loadQuestionList();
    loadRandomQuestion();
    loadStatistic();

    loadSettings();
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

function setViewportSize(){
    document.documentElement.style.setProperty('--screen-width', `${window.innerWidth}px`);
    document.documentElement.style.setProperty('--screen-height', `${window.innerHeight}px`);
}
