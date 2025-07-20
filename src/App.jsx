import React, { useEffect, useState } from 'react';

const App = () => {
  const [choice, setChoice] = useState(false);
  const [key, setKey] = useState('');
  const [response, setResponse] = useState('');
  const [currWindow, setCurrWindow] = useState('options');
  const [selected, setSelected] = useState(false);
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');

  useEffect(() => {
    const handleMessage = (request, sender, sendResponse) => {
      if (request.action === 'sendProblem') {
        setProblem(request.data.description);
        setSolution(request.data.solution);
      }
    };
    chrome.runtime.onMessage.addListener(handleMessage);

    chrome.storage.local.get(['apiKey'], (result) => {
      if (result.apiKey) {
        setKey(result.apiKey);
        setResponse('API Key fetched successfully!');
      } else {
        setKey('AIzaSyABuSoxV6fcVxug-yqMt5ZrBk-5lbwOz7M');
        setResponse('You are using the default limited API Key.');
      }
    });
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  const handleSubmit = () => {
    if (key === '') {
      setResponse('Please enter your API key first.');
      return;
    }
    chrome.storage.local.set({ apiKey: key }, function () {
      console.log('API key is saved.');
    });
    setResponse('API Key saved successfully!');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleHint = async (prompt) => {
    setCurrWindow('answer');
    const updatedPrompt = prompt + problem;

    const body = {
      contents: [
        {
          parts: [
            {
              text: 'You are a DSA instructor. Keep answers short and clear. For complexity, state it directly. For hints, give minimal guidance.',
            },
            {
              text: updatedPrompt,
            },
          ],
        },
      ],
    };

    await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': key,
        },
        body: JSON.stringify(body),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        setResponse(answer);
      })
      .catch((error) => {
        console.error('Error:', error);
        setResponse('Something went wrong. Please try again.');
      });
  };

  const handleComplexity = async (prompt) => {
    setCurrWindow('answer');
    const updatedPrompt = prompt + solution;

    const body = {
      contents: [
        {
          parts: [
            {
              text: 'You are a DSA instructor. Keep answers short and clear. For complexity, state it directly. For hints, give minimal guidance.',
            },
            {
              text: updatedPrompt,
            },
          ],
        },
      ],
    };

    await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': key,
        },
        body: JSON.stringify(body),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        setResponse(answer);
      })
      .catch((error) => {
        console.error('Error:', error);
        setResponse('Something went wrong. Please try again.');
      });
  };

  return (
    <div className="w-[300px] bg-gray-100 rounded-lg shadow-lg p-4 font-sans">
      {!selected && (
        <div className="text-center space-y-4">
          <h1 className="font-semibold text-base">How would you like to continue?</h1>
          <div className="flex flex-col gap-2">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              onClick={() => {
                setChoice(true);
                setSelected(true);
              }}
            >
              With Personal API Key
            </button>
            <button
              className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 transition"
              onClick={() => {
                setChoice(false);
                setSelected(true);
              }}
            >
              With Default API Key (Limited)
            </button>
          </div>
        </div>
      )}

      {selected && (
        <div className="mt-4 space-y-4">
          {choice && (
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="w-full bg-white border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Your API Key"
                value={key}
                onKeyDown={handleKey}
                onChange={(e) => setKey(e.target.value)}
              />
              <button
                className="text-blue-600 hover:scale-110 transition"
                onClick={handleSubmit}
              >
                ➡️
              </button>
            </div>
          )}

          {currWindow === 'options' && (
            <div className="flex flex-col space-y-2">
              <button
                className="bg-blue-100 hover:bg-blue-200 px-3 py-2 rounded-md transition"
                onClick={() => handleComplexity('hello')}
              >
                Complexities
              </button>
              <button
                className="bg-blue-100 hover:bg-blue-200 px-3 py-2 rounded-md transition"
                onClick={() => handleHint('Give some hints related to this problem')}
              >
                💡 Hint
              </button>
            </div>
          )}

          {currWindow === 'answer' && (
            <div className="p-2 bg-white border rounded-md text-sm leading-6 whitespace-pre-wrap">
              {response}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
