const MAX_OPTIONS = 4;

let questionGenerationOptions = {
    "multipleChoiceQuestionEnabled": false,
    "gapTextQuestionEnabled": false,
    "textQuestionEnabled": false,
    "availableSeconds": Infinity
}
let questionCountDownLoop = () => {};

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
 * Generates a question with exactly one correct anwser
 * @param {HTMLFormElement} questionForm 
 * @param {Array<string>} rightOptions 
 * @param {Array<string>|undefined} wrongOptions 
 * @returns successful
 */
function generateSingleCoiceQuestion(questionForm, rightOptions, wrongOptions){
    let optionElements = [
        createOptionElement(rightOptions[getRandom(rightOptions.length)], true, true)
    ];
    while(optionElements.length < MAX_OPTIONS && wrongOptions.length > 0){
        optionElements.push(
            createOptionElement(wrongOptions.splice(getRandom(wrongOptions.length), 1), false, true)
        )
    }

    for(let optionElement of shuffle(optionElements)){
        questionForm.appendChild(optionElement);
    }
    questionForm.classList.add("options");
    
    return true;
}

/**
 * Generates a question with atleast one right anwsers
 * @param {HTMLFormElement} questionForm 
 * @param {Array<string>} rightOptions 
 * @param {Array<string>|undefined} wrongOptions 
 * @returns successful
 */
function generateMultipleChoiceQuestion(questionForm, rightOptions, wrongOptions){
    let optionElements = [
        createOptionElement(rightOptions.splice(getRandom(rightOptions.length), 1), true, false)
    ];
    while(optionElements.length < MAX_OPTIONS && rightOptions.length + wrongOptions.length > 0){
        if(Math.random() < 0.5){
            if(rightOptions.length > 0){
                optionElements.push(
                    createOptionElement(rightOptions.splice(getRandom(rightOptions.length), 1), true, false)
                )
            }
        }else{
            if(wrongOptions.length > 0){
                optionElements.push(
                    createOptionElement(wrongOptions.splice(getRandom(wrongOptions.length), 1), false, false)
                )
            }
        }
    }

    for(let optionElement of shuffle(optionElements)){
        questionForm.appendChild(optionElement);
    }
    questionForm.classList.add("options");

    return true;
}

/**
 * Generates a question with a single text input inside of the question
 * @param {HTMLFormElement} questionForm 
 * @param {Array<string>} rightOptions 
 * @param {Array<string>|undefined} wrongOptions 
 * @returns successful
 */
function generateGapTextQuestion(questionForm, rightOptions, wrongOptions){
    let anwser = rightOptions[getRandom(rightOptions.length)];

    let gapIndices = Array.from(anwser.matchAll(/(?=([A-Za-zÄÜÖäöü0-9]{4,}))/g)).map(x => x.index);
    if(gapIndices.length === 0){
        return false;
    }
    let gapIndex = gapIndices[getRandom(gapIndices.length)];

    let container = document.createElement("div");
    let preText = document.createElement("span");
    let textInput = document.createElement("input");
    let postText = document.createElement("span");

    preText.innerText = anwser.slice(0, gapIndex);
    textInput.spellcheck = false;
    textInput.placeholder = "....";
    textInput.style.width = "calc(4 * var(--font-size))";
    postText.innerText = anwser.slice(gapIndex + 4, anwser.length);

    container.appendChild(preText);
    container.appendChild(textInput);
    container.appendChild(postText);
    questionForm.appendChild(container);
    questionForm.classList.add("text");

    return true;
}

/**
 * Generates a question with a single text input
 * @param {HTMLFormElement} questionForm 
 * @param {Array<string>} rightOptions 
 * @param {Array<string>|undefined} wrongOptions 
 * @returns successful
 */
function generateTextQuestion(questionForm, rightOptions, wrongOptions){
    let isTypable = false;
    for(let rightOption of rightOptions){
        if(/^[A-Za-zÄÜÖäöü0-9 \-]+/.test(rightOption) && rightOption.length < 10){
            isTypable = true;
            break;
        }
    }
    if(!isTypable){
        return false;
    }
    let container = document.createElement("div");
    let textInput = document.createElement("input");
    textInput.spellcheck = false;
    textInput.placeholder = "Antwort";
    container.appendChild(textInput)
    questionForm.appendChild(container);
    questionForm.classList.add("text");

    return true;
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

    let questionElement = document.getElementById("question");
    let questionForm = document.getElementById("questionForm");
    let questionLabel = document.getElementById("questionLabel");
    let questionAnswerSubmit = document.getElementById("questionAnwserSubmit");
    let questionCountdown = document.getElementById("questionCountdown");
    let countDownEnabled = false;

    if(questionGenerationOptions.availableSeconds === Infinity){
        questionCountdown.parentElement.style.display = "none";
    }else{
        countDownEnabled = true;
        questionCountdown.parentElement.style.display = "";
        let startTime = Date.now();
        let questionScreen = document.getElementById("questionScreen");
        
        questionCountDownLoop = () => {
            let remainingSeconds = questionGenerationOptions.availableSeconds - (Date.now() - startTime) / 1000;
            
            questionCountdown.style.width = `${(Math.max(remainingSeconds / questionGenerationOptions.availableSeconds, 0)) * 100}%`;

            if(countDownEnabled && questionScreen.checked){
                if(remainingSeconds > 0){
                    setTimeout(questionCountDownLoop, 30);
                }else{
                    evaluateQuestion(onQuestionCompleted, onQuestionCompletedParams, true);
                }
            }
        }
        
        setTimeout(questionCountDownLoop, 100);
    }

    questionElement.innerText = question;
    questionLabel.innerText = label;
    if(onQuestionCompleted !== null && onQuestionCompletedParams !== null){
        questionAnswerSubmit.innerText = "Prüfen";
        questionAnswerSubmit.onclick = () => {
            if(evaluateQuestion(onQuestionCompleted, onQuestionCompletedParams, false)){
                countDownEnabled = false;
            }
        }
    }
    questionForm.innerHTML = "";
    questionForm.className = "";

    generationOptions = [];
    if(questionGenerationOptions["multipleChoiceQuestionEnabled"]){
        generationOptions.push(generateMultipleChoiceQuestion);
    }else{
        generationOptions.push(generateSingleCoiceQuestion);
    }
    if(questionGenerationOptions["gapTextQuestionEnabled"]){ generationOptions.push(generateGapTextQuestion); }
    if(questionGenerationOptions["textQuestionEnabled"]){ generationOptions.push(generateTextQuestion); }

    let i = getRandom(generationOptions.length);
    while(!generationOptions[i](questionForm, rightOptions, wrongOptions)){
        i = getRandom(generationOptions.length);
    }
}

function evaluateQuestion(onQuestionCompleted, onQuestionCompletedParams, forceEvaluate){
    let question = `${document.getElementById("question").innerText}#`;
    let index;
    for(let i=0;i<quiz.length;i++){
        if(quiz[i].startsWith(question)){
            index = i;
            break;
        }
    }

    let validAnwser = false;
    let isCorrect = true;

    let questionForm = document.getElementById("questionForm");
    if(questionForm.classList.contains("options")){
        for(let child of questionForm.children){
            if(child.classList.contains("chosenOption")){
                validAnwser = true;
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
    }else if(questionForm.classList.contains("text")){
        let anwser = "";
        validAnwser = true;
        for(let child of questionForm.children[0].children){
            if(child.tagName === "INPUT"){
                if(child.value.trim().length === 0){
                    validAnwser = false;
                    break;
                }

                anwser += child.value.trim();
            }else{
                anwser += child.innerText;
            }
        }
        if(validAnwser){
            let options = quiz[index].split(">")[1].split("|");
            let sepIndex = options.indexOf("");
            let rightOptions = options.slice(0, sepIndex).map(s => s.toLowerCase());
            if(rightOptions.includes(anwser.toLowerCase())){
                isCorrect = true;
                for(let child of questionForm.children[0].children){
                    if(child.tagName === "INPUT"){
                        child.classList.add("correctText");
                        child.disabled = true;
                    }
                }
            }else{
                for(let child of questionForm.children[0].children){
                    if(child.tagName === "INPUT"){
                        child.classList.add("wrongText");
                        child.disabled = true;
                    }
                }
            }
        }else{
            isCorrect = false;
        }
    }

    if(validAnwser || forceEvaluate){
        questionForm.classList.add("questionEvaluated");

        let audio;
        if(isCorrect){
            audio = new Audio('sounds/Success.mp3');
        }else{
            audio = new Audio('sounds/Fail.mp3');
        }
        audio.volume = parseFloat(document.getElementById("soundEffectGainSetting").value);
        audio.play();
        
        updateStatistic(index, isCorrect);

        let questionAnwserSubmit = document.getElementById("questionAnwserSubmit");
        questionAnwserSubmit.innerText = "Nächste Frage";
        questionAnwserSubmit.onclick = () => {
            onQuestionCompleted(onQuestionCompletedParams)
        }

        if(questionForm.classList.contains("options")){
            for(let child of questionForm.children){
                child.disabled = true;  
            }
        }

        return true;
    }else{
        fadeInfo("keine Antwort angeben");
        return false;
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
    loadQuestion(index, null, null)
}
