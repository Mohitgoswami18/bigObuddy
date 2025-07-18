import React, { useState } from 'react'

const App = () => {

  //**************************** This is for managing states and variables ****************************//

  const [choice, setChoice] = useState(false);
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [window, setWindow] = useState("options");
  const [selected, setSelected] = useState(false);

  const handleSubmit = ()=> {
    if(key === "") {
      setError("Enter a Key first");
      return;
    } else {
      // ******************* store the api key in the local chrome browser ***************************//
      chrome.storage.local.set({ apiKey: key }, function() {
      console.log('API key is saved.');
      });
      setError("Api Key Saved ...!")
    }
  }

  const handleKey = (e)=> {
    if(e.key === "Enter") {
      handleSubmit();
    }
  }

  const handleTask = ()=> {
    chrome.storage.local.get(['apiKey'], function(result) {
    console.log('Stored API key:', result.apiKey);

    
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
           onClick={()=>{setChoice(true),setSelected(true)}}>With Personal ApiKey</button>
          <button className='px-2 py-1 text-sm hover:scale-110 transition-transform bg-zinc-200 rounded-lg' 
          onClick={()=>{setChoice(false),setSelected(true)}}>With default ApiKey (limited) </button>
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
                  onKeyDown={(e)=>handleKey(e)}
                  onChange={(e)=>{setKey(e.target.value)}}/>
                  <button className='text-sm'
                   onClick={()=>handleSubmit()}>➡️</button>
                </div>
              )}

              {
                window === 'options' && (
                  <div className='flex flex-col p-2 '>
                    <button className='bg-zinc-200 px-3 m-1 rounded-lg hover:scale-110 transition-transform py-1' onClick={handleTask}>Time</button>
                    <button className='bg-zinc-200 px-3 m-1 rounded-lg hover:scale-110 transition-transform py-1' onClick={handleTask}>Space</button>
                    <button className='bg-zinc-200 px-3 m-1 rounded-lg hover:scale-110 transition-transform py-1' onClick={handleTask}>Hints</button>
                 </div>
                )
              }

              {
                window === 'answer' && (
                  <div> {error} </div>
                )
              }
            </div>
        )
      }
    </div>
  )
}

export default App
