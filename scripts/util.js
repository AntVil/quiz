/**
 * Returns an integer in the range [0, max)
 * @param {int} max 
 * @returns {int} random integer
 */
function getRandom(max){
    return Math.floor(Math.random() * max);
}

/**
 * Shuffles an array inplace and returns it
 * @param {Array} arr 
 * @returns reference to array
 */
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
