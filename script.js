let quiz;
let statistic;

const STATISTICS_MAX_COUNT = 2;
const STATISTICS_COLORS = ["#A00", "#F33", "#999", "#3F3", "#0A0"];

window.onload = async function(){
    if("serviceWorker" in navigator){
        navigator.serviceWorker.register("./sw.js");
    }

    await loadQuestionList();
    loadRandomQuestion();
    loadStatistic();
}

function loadRandomQuestion(){
    loadQuestion(getRandom(quiz.length), loadRandomQuestion, {});
}

function loadCategoryQuestion({questions, finish}){
    console.log(questions)
    if(questions.length > 0){
        let index = questions.splice(getRandom(questions.length), 1);
        console.log(index)
        loadQuestion(index, loadCategoryQuestion, {questions: questions, finish: finish});
    }else{
        finish();
    }
}

async function loadQuestionList(){
    try{
        quiz = await (await fetch("quiz.txt")).text();
        localStorage.setItem("quizQuestions", quiz);
    }catch{
        quiz = localStorage.getItem("quizQuestions");
    }

    quiz = quiz.split("\n").map(s => s.trim()).filter(s => s.length > 0);
    
    let categories = {};

    let head, foot, question, label;
    for(let i=0;i<quiz.length;i++){
        [head, foot] = quiz[i].split(">");
        [question, label] = head.split("#");

        if(label === null || label === undefined || label === ""){
            label = "andere";
            quiz[i] = quiz[i].replace(/#[^>]*>|>/, `#${label}>`)
        }
        
        if(label in categories){
            categories[label].push([question, i]);
        }else{
            categories[label] = [[question, i]];
        }
    }

    let allQuestionsElement = document.getElementById("listScreen").nextElementSibling;
    
    for(let category of Object.keys(categories)){
        // toggle
        let categoryToggle = document.createElement("input");
        categoryToggle.type = "checkbox";
        categoryToggle.id = `${category}CategoryToggle`;
        allQuestionsElement.appendChild(categoryToggle);

        // header
        let header = document.createElement("label");
        header.setAttribute("for", `${category}CategoryToggle`);
        let headerTitle = document.createElement("h3");
        headerTitle.innerText = category;

        let categoryButton = document.createElement("button");
        console.log(categories[category])
        console.log(categories[category].map((_, i) => i))
        categoryButton.onclick = () => {
            document.getElementById("questionScreen").checked = true;
            loadCategoryQuestion({
                "questions": categories[category].map(([_, i]) => i),
                "finish": () => {
                    document.getElementById("listScreen").checked = true;
                }
            })
        }

        header.appendChild(headerTitle);
        header.appendChild(categoryButton);
        allQuestionsElement.appendChild(header);

        // content
        let categoryContent = document.createElement("div");
        for(let [question, index] of categories[category]){
            let item = document.createElement("button");
            item.id = `question${index}`;
            item.onclick = () => {
                document.getElementById("questionScreen").checked = true;
                loadQuestion(index, () => {
                    document.getElementById("listScreen").checked = true;
                });
            }
            let text = document.createElement("span");
            text.innerText = question;
            for(let i=0;i<STATISTICS_MAX_COUNT;i++){
                item.appendChild(document.createElement("span"));
            }
            item.appendChild(text);
            
            categoryContent.appendChild(item);
        }
        let gapSize = parseInt(getComputedStyle(document.body).getPropertyValue("--gap-size").split("px")[0]);
        let itemHeight = parseInt(getComputedStyle(document.body).getPropertyValue("--list-item-height").split("px")[0]);
        categoryContent.style.height = `${itemHeight * categories[category].length + gapSize * Math.max(categories[category].length - 1, 0)}px`;
        allQuestionsElement.appendChild(categoryContent);
    }
}

function getRandom(max){
    return Math.floor(Math.random() * max);
}

function shuffle(arr){
    let temp, index;
    for(let i=0;i<arr.length;i++){
        index = getRandom(arr.length);
        temp = arr[index];
        arr[index] = arr[i];
        arr[i] = temp;
    }
    return arr;
}

function createOptionElement(index, option, isCorrect, onQuestionCompleted, onQuestionCompletedParams){
    let optionElement = document.createElement("button");
    optionElement.innerText = option;

    if(isCorrect){
        optionElement.classList.add("correctOption");
    }else{
        optionElement.classList.add("wrongOption");
    }

    optionElement.onclick = () => {
        optionElement.classList.add("chosenOption");

        // add to stats
        updateStatistic(index, optionElement.classList.contains("correctOption"));

        let questionForm = optionElement.parentElement;
        questionForm.classList.add("optionChosen");
        
        for(let option of questionForm.children){
            option.onclick = () => {
                questionForm.classList.remove("optionChosen");
                onQuestionCompleted(onQuestionCompletedParams);
            }
        }
    }

    return optionElement;
}

function loadQuestion(index, onQuestionCompleted, onQuestionCompletedParams){
    let [head, foot] = quiz[index].split(">");
    let [question, label] = head.split("#");

    if(label === null || label === undefined || label === ""){
        label = "andere";
    }
    
    let options = foot.split("|");
    let sepIndex = options.indexOf("");
    let rightOptions = options.slice(0, sepIndex);
    let wrongOptions = options.slice(sepIndex+1, options.length);

    let optionElements = [
        createOptionElement(index, rightOptions[getRandom(rightOptions.length)], true, onQuestionCompleted, onQuestionCompletedParams)
    ];
    while(optionElements.length < 4 && wrongOptions.length > 0){
        optionElements.push(
            createOptionElement(index, wrongOptions.splice(getRandom(wrongOptions.length), 1), false, onQuestionCompleted, onQuestionCompletedParams)
        )
    }

    optionElements = shuffle(optionElements);

    let questionElement = document.getElementById("question");
    let questionForm = document.getElementById("questionForm");
    let questionLabel = document.getElementById("questionLabel");
    
    questionElement.innerText = question;
    questionLabel.innerText = label;
    questionForm.innerHTML = "";
    for(let optionElement of optionElements){
        questionForm.appendChild(optionElement);
    }
}

function loadStatistic(){
    statisticString = localStorage.getItem("quizStatistics");
    statistic = [];
    if(statisticString !== null && statisticString !== undefined && statisticString !== ""){
        statistic = statisticString.split("").map(n => parseInt(n));
    }
    
    for(let i=statistic.length;i<quiz.length;i++){
        statistic.push(STATISTICS_MAX_COUNT);
    }

    for(let i=0;i<statistic.length;i++){
        let children = document.getElementById(`question${i}`).children;
        let diff = statistic[i] - STATISTICS_MAX_COUNT;
        let color = (diff > 0) ? "#0F0" : "#F00";
        for(let j=0;j<Math.abs(diff);j++){
            children[j].style.backgroundColor = color;
        }
    }

    saveStatistic();
}

function updateStatistic(index, isCorrect){
    if(isCorrect){
        statistic[index] = Math.min(statistic[index] + 1, 2 * STATISTICS_MAX_COUNT);
    }else{
        statistic[index] = Math.max(Math.min(statistic[index] - 1, STATISTICS_MAX_COUNT - 1), 0);
    }
    saveStatistic();
    
    let children = document.getElementById(`question${index}`).children;

    let diff = statistic[index] - STATISTICS_MAX_COUNT;
    let color = (diff > 0) ? "#0F0" : "#F00";
    for(let i=0;i<Math.abs(diff);i++){
        children[i].style.backgroundColor = color;
    }
    for(let i=Math.abs(diff);i<STATISTICS_MAX_COUNT;i++){
        children[i].style.backgroundColor = "";
    }
}

function saveStatistic(){
    localStorage.setItem("quizStatistics", statistic.join(""));

    let canvas = document.getElementsByTagName("canvas")[0];
    let ctxt = canvas.getContext("2d");
    ctxt.clearRect(0, 0, canvas.width, canvas.height);

    for(let i=0;i<=2 * STATISTICS_MAX_COUNT;i++){
        let count = 0;
        for(let x of statistic){
            if(x >= i){
                count ++;
            }
        }
        
        let percent = count / statistic.length;

        ctxt.fillStyle = STATISTICS_COLORS[i];
        ctxt.beginPath();
        ctxt.moveTo(canvas.width / 2, canvas.height / 2);
        ctxt.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 + i, -Math.PI / 2, -Math.PI / 2 + percent * 2 * Math.PI);
        ctxt.fill();
    }
}

function navitageToLabel(label){
    for(let child of document.getElementById("listScreen").nextElementSibling.children){
        if(child.type === "checkbox" || child.type === "radio"){
            child.checked = false;
        }
    }
    let toggle = document.getElementById(`${label}CategoryToggle`);
    toggle.checked = true;
    setTimeout(() => toggle.nextElementSibling.scrollIntoView(), 100);
}
