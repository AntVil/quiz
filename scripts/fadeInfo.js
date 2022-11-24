let fadeTime = 750;

/**
 * Fades an info box above all elements
 * @param {string} s 
 */
function fadeInfo(s){
    let fadeInfoElement = document.getElementById("fadeInfo");
    fadeInfoElement.innerText = s;
    fadeInfoElement.classList.add("fadeInfoVisable");
    setTimeout(
        () => {
            fadeInfoElement.classList.remove("fadeInfoVisable");
        },
        fadeTime
    );
}
