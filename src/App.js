import { useState } from 'react';

const App = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  console.log(chatHistory, "CHAT HISTORY");

  const surpriseOptions = [
    'Who won the latest Nobel Peace Prize?',
    'Where does pizza come from?',
    'How do you make a BLT sandwich?',
    'Who won the first FIFA World Cup?',
  ];

  const surprise = () => {
    const random = Math.floor(Math.random() * surpriseOptions.length);
    setValue(surpriseOptions[random]);
  };

  const getResponse = async () => {
    if (!value) {
      setError("Error!!! Please ask a question!");
      return;
    }
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          history: chatHistory,
          message: value,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const response = await fetch('http://localhost:8000/gemini2', options);
      const data = await response.text();
      console.log(data);
      setChatHistory((oldChatHistory) => [
        ...oldChatHistory,
        {
          role: "user",
          part: value,
        },
        {
          role: "model",
          part: data,
        },
      ]);

      setValue("");
    } catch (error) {
      console.error(error);
      setError("Something went wrong! Please try again later.");
    }
  };

  const clear = () => {
    setValue("");
    setError("");
    setChatHistory([]);
  };

  const removeAsterisks = (text) => text.replace(/\*/g, '');

  return (
    <div className="app">
      <p className='quntion'>What do you want to know?
        <button className="surprise" onClick={surprise}>Surprise Me!!!</button>
      </p>
      <div className="input-container">
        <input
          value={value}
          placeholder="When is Diwali?"
          onChange={(e) => setValue(e.target.value)}
        />
        {!error && <button onClick={getResponse} disabled={!chatHistory}>Ask Me</button>}
        {error && <button onClick={clear}>Clear</button>}
      </div>
      {error && <p>{error}</p>}



      <div className="search-result">
        {chatHistory.map((chatItem, _index) => (
          <div key={_index}>
            <p className="answer">{chatItem.role} : {removeAsterisks(chatItem.part)}</p>
          </div>
        ))}
      </div>



    </div>
  );
};

export default App;
