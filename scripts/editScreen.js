let Octokit;
let octokit;

const Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

/**
 * loads edit screen for the question currently loaded
 */
function loadEditQuestion(){
    setupOktokit();

    let label = document.getElementById("questionLabel").innerText;
    let question = document.getElementById("question").innerText;

    let [quizString, index] = quiz.map((x, i) => [x, i]).filter(([x, i]) => x.includes(`${question}#`))[0];

    let [_, anwsers] = quizString.split(">");
    let [correct, wrong] = anwsers.split("||");
    
    document.getElementById("editQuestionLabel").value = label;
    document.getElementById("editQuestion").value = question;
    document.getElementById("editCorrectAnwsers").value = correct.split("|").join("\n");
    document.getElementById("editWrongAnwsers").value = wrong.split("|").join("\n");

    document.getElementById("editSubmit").onclick = () => {
        try{
            quiz[index] = getSaveString(index);
            uploadQuiz(`update question ${index}`);
            
            updateLoadedQuestion(index);

            document.getElementById("questionScreen").checked = true;
        }catch{

        }
    }

    document.getElementById("editCancel").onclick = () => {
        document.getElementById("questionScreen").checked = true;
    }

    document.getElementById("deleteQuestion").onclick = () => {
        if(octokit !== undefined){
            if(window.confirm("Frage unwiderruflich löschen?")){
                quiz.splice([index]);
                uploadQuiz(`remove question ${index}`);
            }
        }
    }
}

/**
 * opens the edit screen with empty fields
 */
function loadAddQuestion(){
    setupOktokit();

    document.getElementById("editQuestionLabel").value = "";
    document.getElementById("editQuestion").value = "";
    document.getElementById("editCorrectAnwsers").value = "";
    document.getElementById("editWrongAnwsers").value = "";

    document.getElementById("editSubmit").onclick = () => {
        try{
            quiz.push(getSaveString(null));
            uploadQuiz("add new question");
            document.getElementById("listScreen").checked = true;
        }catch{

        }
    }

    document.getElementById("editCancel").onclick = () => {
        document.getElementById("listScreen").checked = true;
    }

    document.getElementById("deleteQuestion").onclick = () => {
        document.getElementById("editCancel").click();
    }
}

/**
 * Returns the quiz string to be saved
 * Throws an error if the question is invalid or exists already
 * A index can be provided to skip the question which is currently being edited
 * @param {int|null} index 
 * @returns quiz string
 */
function getSaveString(index){
    let label = document.getElementById("editQuestionLabel").value.toLowerCase().trim().replaceAll(/\||\#|\>/g, "?");
    let question = document.getElementById("editQuestion").value.replaceAll(/\s+/g, " ").trim();
    let correctAnwsers = document.getElementById("editCorrectAnwsers").value.split("\n").map(x => x.trim());
    let wrongAnwsers = document.getElementById("editWrongAnwsers").value.split("\n").map(x => x.trim());
    
    correctAnwsers = [...new Set(correctAnwsers)].join("|");
    wrongAnwsers = [...new Set(wrongAnwsers)].join("|");

    if(question.length === 0){
        fadeInfo("keine Frage angegeben");
        throw Error("no question specified");
    }
    for(let i=0;i<quiz.length;i++){
        if(i === index){ continue; }
        if(question === quiz[i]){
            fadeInfo("Frage existiert bereits");
            throw Error("question exists");
        }
    }

    if(correctAnwsers.length === 0){
        fadeInfo("keine korrekten Antworten angegeben");
        throw Error("no correct anwsers specified");
    }
    if(wrongAnwsers.length === 0){
        fadeInfo("keine falschen Antworten angegeben");
        throw Error("no wrong anwsers specified");
    }
    if((new Set([...correctAnwsers, ...wrongAnwsers])).size !== correctAnwsers.length + wrongAnwsers.length){
        fadeInfo("Antwort ist korrekt und falsch");
        throw Error("answer is right and wrong");
    }
    
    return `${question}#${label}>${correctAnwsers}||${wrongAnwsers}`;
}

/**
 * imports Oktokit
 */
async function setupOktokit(){
    if(Octokit === undefined){
        Octokit = (await import("https://cdn.skypack.dev/@octokit/rest")).Octokit;
        
        document.getElementById("promptAccessTokenSubmit").disabled = false;
    }
}

/**
 * starts oktokit and checks if a request is possible
 */
async function initialiseOctokit(){
    try{
        octokit = new Octokit({
            auth: document.getElementById("accessToken").value.trim()
        });
    
        await octokit.repos.get({
            "owner": "AntVil",
            "repo": "quiz"
        })
    
        document.getElementById("promptAccessToken").checked = false;
    }catch{
        
    }
}

/**
 * commits the quiz using oktokit
 * @param {string} commitMessage 
 */
async function uploadQuiz(commitMessage){
    let content = quiz.join("\n").replaceAll("\r", "").replaceAll("\n", "\r\n").replaceAll(" ", " ");

    let {data: {sha}} = await octokit.request("GET /repos/AntVil/quiz/contents/quiz.txt");

    await octokit.repos.createOrUpdateFileContents({
        "owner": "AntVil",
        "repo": "quiz",
        "path": "quiz.txt",
        "sha": sha,
        "message": commitMessage,
        "content": Base64.encode(content)
    });

    loadQuestionList();
}
