/**
 * Creates and returns an option for a question.
 * Call the provided function once the question is completed
 * @param {int} index 
 * @param {string} option 
 * @param {boolean} isCorrect 
 * @param {function} onQuestionCompleted 
 * @param {Object} onQuestionCompletedParams 
 * @returns {HTMLButtonElement} the option element
 */
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

        // add to statistic
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

/**
 * Loads a list of questions in a random order.
 * Calls the provided function once every question is completed
 * @param {{questions: int[], finish: function}} param0 
 */
function loadListQuestion({questions, finish}){
    if(questions.length > 0){
        let index = questions.splice(getRandom(questions.length), 1);
        console.log(index)
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
