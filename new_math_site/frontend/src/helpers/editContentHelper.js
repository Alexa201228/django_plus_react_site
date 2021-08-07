//remove html tags from course description
export const removeHTMLTags = (text) => {
    const regex = /(<([^>]+)>)/ig;
    return text.replace(regex, '')
}
