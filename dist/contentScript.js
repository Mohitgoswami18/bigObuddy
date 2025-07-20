function extractLeetCodeQuestion() {
    const problemContainer = document.querySelector('.elfjS');
    if(problemContainer) {
        const problemContainerChilds = document.querySelectorAll('p, pre');

        const problemDiscription = Array.from(problemContainerChilds)
    .map(elem => elem.innerText.trim())
    .filter(text => text.length > 0)
    .join('\n\n'); 

    
    chrome.runtime.sendMessage({
        action: "sendQuestionData",
        data: {
            description: problemDiscription,
        }
    });
} else {
    chrome.runtime.sendMessage({
        action: "sendQuestionData",
        data: {
            description: "There was an error while Fetching the problem Description",
        }
    });
}

    
}

setTimeout(extractLeetCodeQuestion, 2000);
