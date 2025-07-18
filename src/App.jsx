import React, { useState } from 'react'

const App = () => {

  //**************************** This is for managing states and variables ****************************//

  const [choice, setChoice] = useState(false);
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(false);

  const handleSubmit = ()=> {
    if(key === "") {
      setError("Enter a Key first");
      return;
    } else {
      // ******************* store the api key in the local chrome browser ***************************//

    }
  }

  const handleKey = (e)=> {
    if(e.key === "Enter") {
      handleSubmit();
    }
  }

  return (
    <div className=''>
      {
        selected == false && (
          <div>
          <h1 className='font-bold text-sm '>How you would like to continue? </h1>
          <button className='' onClick={()=>{setChoice(true),setSelected(true)}}>With Personal ApiKey</button>
          <button onClick={()=>{setChoice(false),setSelected(true)}}>With default ApiKey (limited) </button>
          </div>
        )
      }

      {
        selected == true && (
            <div>
              {choice && (
                <div> 
                  <label htmlFor="key"></label>
                  <input type="text"
                  className='bg-black px-3 py-1' name='key' placeholder='enter your key'
                  value={key}
                  onKeyDown={(e)=>handleKey(e)}
                  onChange={(e)=>{setKey(e.target.value)}}/>
                  <button onClick={()=>handleSubmit()}></button>
                </div>
              )}

              <button onClick={handleTask}>FindTimeConplexity</button>
              <button onClick={handleTask}>FindSpaceConplexity</button>
              <button onClick={handleTask}>GiveMeSomeHints</button>
            </div>
        )
      }
    </div>
  )
}

export default App
