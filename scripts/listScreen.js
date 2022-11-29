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

        //progress bar
        var p = 20 + '%';  //ToDo
        var r = document.querySelector(':root');
        r.style.setProperty('--percentage', p);

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
