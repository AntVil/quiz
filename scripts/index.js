let quiz;

window.onload = async function(){
    if("serviceWorker" in navigator){
        navigator.serviceWorker.register("./serviceWorker.js");
    }

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
}
