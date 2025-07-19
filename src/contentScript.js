const problemContainer = document.querySelector(".elfjS");

const problemElements = document.querySelectorAll("p, pre")

if(problemElements) {
    const problemDescription = Array.from(problemElements)
                               .map(elem => elem.innerText.trim())
                               .filter(text => text.length > 0)
                               .join("\n\n");

    chrome.runtime.sendMessage({
        action: "sendProblem",
        data: problemDescription
    });
} else {
    chrome.runtime.sendMessage({
        action: "sendProblem",
        data: "There was an error while loading the problem",
    });
}

