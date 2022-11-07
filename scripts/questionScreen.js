const MAX_OPTIONS = 4

/**
 * Creates and returns an option for a question.
 * Call the provided function once the question is completed
 * @param {string} option 
 * @param {boolean} isCorrect 
 * @param {function} onQuestionCompleted 
 * @param {Object} onQuestionCompletedParams 
 * @returns {HTMLButtonElement} the option element
 */
function createOptionElement(option, isCorrect, isRadio){
    let optionElement = document.createElement("button");
    optionElement.innerText = option;

    if(isCorrect){
        optionElement.classList.add("correctOption");
    }else{
        optionElement.classList.add("wrongOption");
    }

    optionElement.onclick = () => {
        let questionForm = optionElement.parentElement;
        if(!questionForm.classList.contains("questionEvaluated")){
            if(optionElement.classList.contains("chosenOption")){
                optionElement.classList.remove("chosenOption");
            }else{
                optionElement.classList.add("chosenOption");
            }
        }
        if(isRadio){
            for(let child of questionForm.children){
                if(child !== optionElement){
                    child.classList.remove("chosenOption");
                }
            }
        }
    }

    return optionElement;
}

/**
 * loads a question and calls the provided function once the question is completed
 * @param {int} index 
 * @param {function} onQuestionCompleted 
 * @param {Object} onQuestionCompletedParams 
 */
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
        createOptionElement(rightOptions[getRandom(rightOptions.length)], true, true)
    ];
    while(optionElements.length < MAX_OPTIONS && wrongOptions.length > 0){
        optionElements.push(
            createOptionElement(wrongOptions.splice(getRandom(wrongOptions.length), 1), false, true)
        )
    }

    optionElements = shuffle(optionElements);

    let questionElement = document.getElementById("question");
    let questionForm = document.getElementById("questionForm");
    let questionLabel = document.getElementById("questionLabel");
    let questionAnswerSubmit = document.getElementById("questionAnwserSubmit");
    
    questionElement.innerText = question;
    questionLabel.innerText = label;
    questionAnswerSubmit.innerText = "Prüfen";
    questionAnswerSubmit.onclick = () => {
        evaluateQuestion(onQuestionCompleted, onQuestionCompletedParams);
    }
    questionForm.innerHTML = "";
    questionForm.className = "";
    for(let optionElement of optionElements){
        questionForm.appendChild(optionElement);
    }
}

function evaluateQuestion(onQuestionCompleted, onQuestionCompletedParams){
    let anyOptionSelected = false;
    let isCorrect = true;

    let questionForm = document.getElementById("questionForm");
    for(let child of questionForm.children){
        if(child.classList.contains("chosenOption")){
            anyOptionSelected = true;
            if(child.classList.contains("wrongOption")){
                isCorrect = false;
                break;
            }
        }else{
            if(child.classList.contains("correctOption")){
                isCorrect = false;
            }
        }
    }

    if(anyOptionSelected){
        questionForm.classList.add("questionEvaluated");

        let question = `${document.getElementById("question").innerText}#`;
        let index;
        for(let i=0;i<quiz.length;i++){
            if(quiz[i].startsWith(question)){
                index = i;
                break;
            }
        }
        
        updateStatistic(index, isCorrect);

        let questionAnwserSubmit = document.getElementById("questionAnwserSubmit");
        questionAnwserSubmit.innerText = "Nächste Frage";
        questionAnwserSubmit.onclick = () => {
            onQuestionCompleted(onQuestionCompletedParams)
        }
    }else{
        fadeInfo("keine Antwort angeben");
    }
}

/**
 * Loads a list of questions in a random order.
 * Calls the provided function once every question is completed
 * @param {{questions: int[], finish: function}} param0 
 */
function loadListQuestion({questions, finish}){
    if(questions.length > 0){
        let index = questions.splice(getRandom(questions.length), 1);
        loadQuestion(index, loadListQuestion, {questions: questions, finish: finish});
    }else{
        finish();
    }
}

/**
 * Starts a loop of random questions in no particular order
 */
function loadRandomQuestion(){
    loadQuestion(getRandom(quiz.length), loadRandomQuestion, {});
}

/**
 * updates the loaded question without changing the function called after completion
 * @param {int} index 
 */
function updateLoadedQuestion(index){
    let [head, foot] = quiz[index].split(">");
    let [question, label] = head.split("#");

    if(label === null || label === undefined || label === ""){
        label = "andere";
    }
    
    let options = foot.split("|");
    let sepIndex = options.indexOf("");
    let rightOptions = options.slice(0, sepIndex);
    let wrongOptions = options.slice(sepIndex+1, options.length);

    let questionElement = document.getElementById("question");
    let questionForm = document.getElementById("questionForm");
    let questionLabel = document.getElementById("questionLabel");

    questionElement.innerText = question;
    questionLabel.innerText = label;

    let count = 0;
    let sampleWrongOption;
    for(let option of questionForm.children){
        if(option.classList.contains("correctOption")){
            option.innerText = rightOptions[getRandom(rightOptions.length)];
            count++;
        }else{
            if(wrongOptions.length > 0){
                sampleWrongOption = option;
                option.innerText = wrongOptions.splice(getRandom(wrongOptions.length), 1);
                count++;
            }else{
                option.remove();
            }
        }
    }

    while(count < MAX_OPTIONS && wrongOptions.length > 0){
        let option = sampleWrongOption.cloneNode(true);
        option.innerText = wrongOptions.splice(getRandom(wrongOptions.length), 1);
        option.classList.remove("chosenOption");
        option.onclick = () => {
            sampleWrongOption.click();

            sampleWrongOption.classList.remove("chosenOption");
            option.classList.add("chosenOption");
        }
        questionForm.appendChild(option);
        count++;
    }
}
