import React from 'react'

const App = () => {

  const [choice, setChoice] = useState('')
  return (
    <div>
      <h1>How you would like to continue? </h1>
      <h2>Enter you api key here</h2>

      <button onClick={setChoice("withKey")}>With Personal ApiKey</button>
      <button onClick={setChoice("withoutKey")}>With default ApiKey (limited) </button>

      {
        choice === "WithKey" ? (
          <div> 
            <label htmlFor="key"></label>
            <input type="text" name='key'/>
            <button onClick={handleSubmit}></button>
          </div>
        ):
        (
          <main></main> // Main logic goes here
        )
      }
      <label htmlFor="key"> Api Key: </label>
      <input type="text" name='key' placeholder=''/>
    </div>
  )
}

export default App
