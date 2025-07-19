import React, { useEffect, useState } from 'react'

const App = () => {

  //**************************** For managing states and variables ****************************//

  const [choice, setChoice] = useState(false);
  const [key, setKey] = useState("");
  const [response, setResponse] = useState("");
  const [window, setWindow] = useState("options");
  const [selected, setSelected] = useState(false);
  const [problem, setProblem] = useState("");

  console.log(problem);

  useEffect(() => {

    const handleMessage = (request, sender, sendResponse) => {
      if (request.action === "sendProblem") {
        setProblem(request.data);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    chrome.storage.local.get(['apiKey'], (result) => {
    if(result.key) {
      setKey(result.key);
      setResponse("Key Fetched...!, Ready to go");
    } else {
      // ***************************************** This is else condition for the default api key (limited Version)
      // Strore the Default Api Key in the local chrome browser also   *****************************************//
      setKey('AIzaSyABuSoxV6fcVxug-yqMt5ZrBk-5lbwOz7M');
      setResponse("You are continuing with DEFAULT API KEY !");
    }
  })

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [])

  const handleSubmit = () => {
    if (key === "") {
      setResponse("Enter a Key first");
      return;
    } else {
      // ******************* stores the api key in the local chrome browser ***************************//
      chrome.storage.local.set({ apiKey: key }, function() {
      console.log('API key is saved.');
      });
      setResponse("Api Key Saved ...!")
    }
  }

  const handleKey = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  }

  const handleTask = async (prompt) => {
  setWindow("answer");
  const updatedPrompt = prompt + problem;
  // *************************************** Call the LLM here **********************************//

  const body = {
    "contents": [
      {
        "parts": [
          {
            "text": "You are an DSA Instructure you have to ansewer every question in the least words possible and straight to ther points like if someone ask time or space complexity tell them directly the same and if someone asks for hints give then hints barely revealing the data structures and method to solve that question on give an approach hint without reavealing the actual answer."
          },
          {
            "text": updatedPrompt,
          }
        ]
      }
    ]
  }

  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
    method: "post",
    headers: {
      'Content-Type': 'application/json',
      'X-goog-api-key': 'GEMINI_API_KEY'
    },
    body: JSON.stringify(body),
  }
  ).then(res => res.json())
    .then(data => {
      const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      setResponse(answer)
    })
    .catch(error => {
      console.error("Error:", error);
    });
}

return (
  <div className=''>
    {
      selected == false && (
        <div>
          <h1 className='font-bold text-center text-sm '>How you would like to continue? </h1>
          <div className='flex flex-col gap-2 m-2 p-2'>
            <button className='px-2 py-1 text-sm hover:scale-110 transition-transform bg-zinc-200 rounded-lg'
              onClick={() => { setChoice(true), setSelected(true) }}>With Personal ApiKey</button>
            <button className='px-2 py-1 text-sm hover:scale-110 transition-transform bg-zinc-200 rounded-lg'
              onClick={() => { setChoice(false), setSelected(true) }}>With default ApiKey (limited) </button>
          </div>
        </div>
      )
    }

    {
      selected == true && (
        <div>
          {choice == true && (
            <div className='p-4 flex'>
              <label htmlFor="key"></label>
              <input type="text"
                className='bg-zinc-200 px-2 text-sm py-1 rounded-xl outline-none focus:bg-zinc-300' name='key' placeholder='Place your key here :'
                value={key}
                onKeyDown={(e) => handleKey(e)}
                onChange={(e) => { setKey(e.target.value) }} />
              <button className='text-sm'
                onClick={() => handleSubmit()}>➡️</button>
            </div>
          )}

          {
            window === 'options' && (
              <div className='flex flex-col p-2 '>
                <button className='bg-zinc-200 px-3 m-1 rounded-lg hover:scale-110 transition-transform py-1' onClick={() => handleTask("Find Time complexity of this code")}>Time</button>
                <button className='bg-zinc-200 px-3 m-1 rounded-lg hover:scale-110 transition-transform py-1' onClick={() => handleTask("Find Space complexity of this code ")}>Space</button>
                <button className='bg-zinc-200 px-3 m-1 rounded-lg hover:scale-110 transition-transform py-1' onClick={() => handleTask("Give me a hint")}>Hints</button>
              </div>
            )
          }

          {
            window === 'answer' && (
              <div> {response} </div>
            )
          }
        </div>
      )
    }
  </div>
)
}

export default App;