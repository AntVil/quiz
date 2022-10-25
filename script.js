let quiz;
let statistic;

const STATISTICS_MAX_COUNT = 2;
const STATISTICS_COLORS = ['#999', '#FE4', '#0F0'];

window.onload = async function(){
    await loadQuestionList();

    loadRandomQuestion();

    loadStatistic();
}

function loadRandomQuestion(){
    loadQuestion(getRandom(quiz.length), loadRandomQuestion);
}

async function loadQuestionList(){
    quiz = (
        await (await fetch("quiz.txt")).text()
    ).split("\n").map(s => s.trim()).filter(s => s.length > 0);

    let categories = {};

    let head, foot, question, label;
    for(let i=0;i<quiz.length;i++){
        [head, foot] = quiz[i].split(">");
        [question, label] = head.split("#");

        if(label === null || label === undefined || label === ""){
            label = "andere";
        }
        
        if(label in categories){
            categories[label].push([question, i]);
        }else{
            categories[label] = [[question, i]];
        }
    }

    let allQuestionsElement = document.getElementById("allQuestionsScreen").nextElementSibling;
    
    for(let category of Object.keys(categories)){
        let header = document.createElement("h3");
        header.innerText = category;
        allQuestionsElement.appendChild(header);
        for(let [question, index] of categories[category]){
            let item = document.createElement("button");
            item.id = `question${index}`;
            item.onclick = () => {
                document.getElementById("randomQuestionsScreen").checked = true;
                loadQuestion(index, () => {
                    document.getElementById("allQuestionsScreen").checked = true;
                });
            }
            let text = document.createElement("span");
            text.innerText = question;
            for(let i=0;i<STATISTICS_MAX_COUNT;i++){
                item.appendChild(document.createElement("span"));
            }
            item.appendChild(text);
            
            allQuestionsElement.appendChild(item);
        }
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

function createOptionElement(index, option, isCorrect, onQuestionCompleted){
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
                onQuestionCompleted();
            }
        }
    }

    return optionElement;
}

function loadQuestion(index, onQuestionCompleted){
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
        createOptionElement(index, rightOptions[getRandom(rightOptions.length)], true, onQuestionCompleted)
    ];
    while(optionElements.length < 4 && wrongOptions.length > 0){
        optionElements.push(
            createOptionElement(index, wrongOptions.splice(getRandom(wrongOptions.length), 1), false, onQuestionCompleted)
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
        statistic.push(0);
    }

    for(let i=0;i<statistic.length;i++){
        let children = document.getElementById(`question${i}`).children;
        for(let j=0;j<statistic[i];j++){
            children[j].style.backgroundColor = "#0F0"
        }
    }

    saveStatistic();
}

function updateStatistic(index, isCorrect){
    if(isCorrect){
        statistic[index] = Math.min(statistic[index] + 1, STATISTICS_MAX_COUNT);
    }else{
        statistic[index] = 0;
    }
    saveStatistic();
    
    let children = document.getElementById(`question${index}`).children;
    
    if(statistic[index] > 0){
        if(statistic[index] > 1){
            children[0].style.backgroundColor = "#0F0";
            children[1].style.backgroundColor = "#0F0";
        }else{
            children[0].style.backgroundColor = "#0F0";
            children[1].style.backgroundColor = "";
        }
    }else{
        children[0].style.backgroundColor = "";
        children[1].style.backgroundColor = "";
    }
}

function saveStatistic(){
    localStorage.setItem("quizStatistics", statistic.join(""));

    let canvas = document.getElementsByTagName("canvas")[0];
    let ctxt = canvas.getContext("2d");
    ctxt.clearRect(0, 0, canvas.width, canvas.height);

    for(let i=0;i<=STATISTICS_MAX_COUNT;i++){
        let count = 0;
        for(let x of statistic){
            if(x >= i){
                count ++;
            }
        }
        console.log(i)
        let percent = count / statistic.length;

        ctxt.fillStyle = STATISTICS_COLORS[i];
        ctxt.beginPath();
        ctxt.moveTo(canvas.width / 2, canvas.height / 2);
        ctxt.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, -Math.PI / 2, -Math.PI / 2 + percent * 2 * Math.PI);
        ctxt.fill();
    }
}
