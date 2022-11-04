let statistic;

let statisticCanvas;
let statisticCanvasContext;

const STATISTICS_MAX_COUNT = 2;
const STATISTICS_COLORS = ["#AA0000", "#FF3333", "#AAAAAA", "#33FF33", "#00AA00"];

/**
 * Initializes the statitics
 */
function loadStatistic(){
    statisticCanvas = document.getElementById("statisticCanvas");
    statisticCanvasContext = statisticCanvas.getContext("2d", {willReadFrequently: true});

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

/**
 * Sets the statistic of the question at the given index
 * @param {int} index 
 * @param {boolean} isCorrect 
 */
function updateStatistic(index, isCorrect){
    if(isCorrect){
        statistic[index] = Math.min(statistic[index] + 1, 2 * STATISTICS_MAX_COUNT);

        // skip inital state
        if(statistic[index] == STATISTICS_MAX_COUNT){
            statistic[index]++;
        }
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

/**
 * Saves the statistic to local storage and updates the canvas pie-chart
 */
function saveStatistic(){
    localStorage.setItem("quizStatistics", statistic.join(""));

    statisticCanvasContext.clearRect(0, 0, statisticCanvas.width, statisticCanvas.height);

    let statisticNumbers = document.getElementById("statisticNumbers");
    statisticNumbers.innerHTML = "";

    for(let i=0;i<=2 * STATISTICS_MAX_COUNT;i++){
        let commulativeCount = 0;
        let absoluteCount = 0;
        for(let x of statistic){
            if(x == i){
                commulativeCount++;
                absoluteCount++;
            }else if(x > i){
                commulativeCount++;
            }
        }
        
        let commulativePercent = commulativeCount / statistic.length;
        let absolutePercent = absoluteCount / statistic.length;

        statisticCanvasContext.fillStyle = STATISTICS_COLORS[i];
        statisticCanvasContext.beginPath();
        statisticCanvasContext.moveTo(statisticCanvas.width / 2, statisticCanvas.height / 2);
        statisticCanvasContext.arc(statisticCanvas.width / 2, statisticCanvas.height / 2, statisticCanvas.width, -Math.PI / 2, -Math.PI / 2 + commulativePercent * 2 * Math.PI);
        statisticCanvasContext.closePath();
        statisticCanvasContext.fill();

        let group = document.createElement("div");
        group.classList.add(".hoverable");
        group.innerText = absolutePercent.toFixed(2);
        group.style.backgroundColor = STATISTICS_COLORS[i];
        group.style.opacity = Math.max(absolutePercent, 0.2);
        if(absoluteCount > 0){
            group.onclick = () => {
                loadStatisticQuestions(i);
            }
        }else{
            group.onclick = () => {};
        }

        statisticNumbers.appendChild(group);
    }
}

/**
 * resets all statistics to the initial value
 */
function resetStatistic(){
    statistic = statistic.map(_ => STATISTICS_MAX_COUNT);
    saveStatistic();
}

/**
 * Loads all questions with the provided score
 * @param {int} score
 */
function loadStatisticQuestions(score){
    questions = [];
    for(let i=0;i<statistic.length;i++){
        if(statistic[i] == score){
            questions.push(i);
        }
    }
    
    loadListQuestion({questions: questions, finish: () => {
        document.getElementById("statisticScreen").checked = true;
    }});
    document.getElementById("questionScreen").checked = true;
}

/**
 * Loads all questions with the score provided by the canvas color at click
 * @param {Event} e 
 */
function loadStatisticQuestionsCanvasClick(e){
    let rect = statisticCanvas.getBoundingClientRect();
    
    let x = statisticCanvas.width * (e.clientX - rect.left) / rect.width;
    let y = statisticCanvas.height * (e.clientY - rect.top) / rect.height;

    let [r, g, b] = statisticCanvasContext.getImageData(x, y, 1, 1).data;
    let color = `#${((r << 16) | (g << 8) | b).toString(16)}`.toUpperCase();

    for(let i=0;i<STATISTICS_COLORS.length;i++){
        if(STATISTICS_COLORS[i] === color){
            loadStatisticQuestions(i);
        }
    }
}
