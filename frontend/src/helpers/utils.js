export function getRandomQuestion(allQuestions, chosenQuestions) {
    let allQ = new Set(...allQuestions);
    let chosenQ = new Set(...chosenQuestions);
    let difference = new Set([...allQ].filter(x => !chosenQuestions.has(x)))
    return difference[Math.floor(Math.random() * array.length)];
}