export const getElementValue = (element) => document.getElementById(element).value
export const hideElement = (elements) => elements.forEach(element => element.classList.add('hide'))
export const showElement = (elements) => elements.forEach(element => element.classList.remove('hide'))
export const insertText = (element, text) => element.innerHTML = text

