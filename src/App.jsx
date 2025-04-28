import './App.css';
import gptLOGO from './assets/chatgpt.svg';
import addBtn from './assets/add-30.png';
import msgIcon from './assets/message.svg';
import home from './assets/home.svg';
import saved from './assets/bookmark.svg';
import rocket from './assets/rocket.svg';
import sendBtn from './assets/send.svg';
import userIcon from './assets/user-icon.png'
import gptImgLogo from './assets/chatgptLogo.svg'
import { sendMsgToOpenAi } from './openai';
import { useEffect, useRef, useState } from 'react';

function App() {
  const msgEnd = useRef(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      text: "Hi I am ChatBOT .. ",
      isBot: true
    }
  ]);

  useEffect(() => {
    msgEnd.current.scrollIntoView();
  }, [messages]);

  const handelSend = async () => {
    const text = input;
    setInput('');
    setMessages([
      ...messages,
      { text, isBot: false }
    ]);
    const res = await sendMsgToOpenAi(input);
    setMessages([...messages,
      { text, isBot: false },
      { text: res, isBot: true }
    ]);
  };

  const handelEnter = async (e) => {
    if (e.key === 'Enter') {
      await handelSend();
    }
  };

  const handelQuery = async (query) => {
    const text = query;
    setInput(query); 
    setMessages([
      ...messages,
      { text, isBot: false }
    ]);
    const res = await sendMsgToOpenAi(query);
    setMessages([...messages,
      { text, isBot: false },
      { text: res, isBot: true }
    ]);
  };

  return (
    <div className="App">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="upperSide">
          <div className="upperSideTop">
            <img src={gptLOGO} alt="ChatGPT Logo" className="logo" />
            <span className="brand">ChatBOT</span>
          </div>

          <button className="midBtn" onClick={() => { window.location.reload() }}>
            <img src={addBtn} alt="New Chat" className="addBtn" />
            New Chat
          </button>

          <div className="upperSideBottom">
            {/* Query buttons */}
            <button onClick={() => handelQuery("What is Programming?")} className="query">
              <img src={msgIcon} alt="Query" /> What is Programming?
            </button>
            <button onClick={() => handelQuery("What is React Js?")} className="query">
              <img src={msgIcon} alt="Query" /> What is React Js?
            </button>
          </div>
        </div>

        <div className="lowerSide">
          <div className="listItems">
            <img src={home} alt="Home" className="listItemsImg" />
            Home
          </div>
          <div className="listItems">
            <img src={saved} alt="Saved" className="listItemsImg" />
            Saved
          </div>
          <div className="listItems">
            <img src={rocket} alt="Upgrade" className="listItemsImg" />
            Upgrade To Pro
          </div>
        </div>
      </div>

      <div className="main">
        <h1>Welcome to ChatBOT</h1>

        <div className="chats">
          {messages.map((message, i) => (
            <div key={i} className={message.isBot ? "chat bot" : "chat"}>
              <img className="chatImg" src={message.isBot ? gptImgLogo : userIcon} alt="" />
              <p className="txt">{message.text}</p>
            </div>
          ))}
        </div>
        <div ref={msgEnd} />

        <div className="chatFooter">
          <div className="inp">
            <input
              type="text"
              placeholder="Send a message..."
              value={input}
              onKeyDown={handelEnter}
              onChange={(e) => { setInput(e.target.value) }}
            />
            <button className="sendBtn" onClick={handelSend}>
              <img src={sendBtn} alt="Send" />
            </button>
          </div>
        </div>
        <p className='restriction'>ChatBOT can make mistakes. Check important info</p>
      </div>
    </div>
  );
}

export default App;
