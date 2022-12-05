/**
 * creates/updates the listScreen
 */
function loadQuestionList(){
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
    allQuestionsElement.innerHTML = "";

    let questionIndex = 0;
    
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
        categoryButton.ariaLabel = category;

        categoryButton.onclick = () => {
            loadListQuestion({
                "questions": categories[category].map(([_, i]) => i),
                "finish": () => {
                    document.getElementById("listScreen").checked = true;
                }
            });
            document.getElementById("questionScreen").checked = true;
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
        
        //progress bar

        statisticString = localStorage.getItem("quizStatistics");
        statistic = [];
        if(statisticString !== null && statisticString !== undefined && statisticString !== ""){
            statistic = statisticString.split("").map(n => parseInt(n));
        }

        for(let i=statistic.length;i<quiz.length;i++){
            statistic.push(STATISTICS_MAX_COUNT);
        }

        let category_stat = 0;
        for(let i=questionIndex;i<(categories[category].length+questionIndex);i++){
            let diff = statistic[i] - STATISTICS_MAX_COUNT;
            if(diff > 0){
                category_stat += diff;
            }
        }
        questionIndex = categories[category].length - 1;

        let p = (category_stat/(2*categories[category].length))*100;
        
        // this should work, but doesn't  ¯\_(ツ)_/¯ :
        //categoryButton.setAttribute("style", "border-top: 5px solid");
        //categoryButton.setAttribute("style", `border-image: linear-gradient(to rigth, green ${p}%, red ${p}%)`);
        //so I still do this:
        var r = document.querySelector(':root');
        r.style.setProperty('--percentage', p + "%");
    }
}

/**
 * Scrolls to the provided label in the listScreen
 * @param {string} label 
 */
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
