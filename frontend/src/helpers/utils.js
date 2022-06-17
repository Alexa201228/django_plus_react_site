export function getRandomQuestion(allQuestions, chosenQuestions) {
    let allQ = new Set(allQuestions);
    let chosenQ = new Set(chosenQuestions.filter(x => x != undefined));
    let difference = new Set([...allQ].filter(x => !chosenQ.has(x)))
    let questionId = [...difference][Math.floor(Math.random() * difference.size)];
    let temp = [...difference].filter(x => x != undefined)
    return questionId
}