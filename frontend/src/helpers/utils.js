export function getRandomQuestion(allQuestions, chosenQuestions) {
    console.log(chosenQuestions)
    console.log(allQuestions)
    let allQ = new Set(allQuestions);
    let chosenQ = new Set(chosenQuestions.filter(x => x != undefined));
    console.log(chosenQ)
    let difference = new Set([...allQ].filter(x => !chosenQ.has(x)))
    let questionId = [...difference][Math.floor(Math.random() * difference.size)];
    let temp = [...difference].filter(x => x != undefined)
    console.log(temp)
    console.log(questionId)
    return questionId
}