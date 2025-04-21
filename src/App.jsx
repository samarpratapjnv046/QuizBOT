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

function App() {
  return (
    <div className="App">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="upperSide">
          <div className="upperSideTop">
            <img src={gptLOGO} alt="ChatGPT Logo" className="logo" />
            <span className="brand">ChatBOT</span>
          </div>

          <button className="midBtn">
            <img src={addBtn} alt="New Chat" className="addBtn" />
            New Chat
          </button>

          <div className="upperSideBottom">
            <button className="query">
              <img src={msgIcon} alt="Query" />
              What is Programming?
            </button>
            <button className="query">
              <img src={msgIcon} alt="Query" />
              What is React Js?
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

      {/* Main Chat Area */}
      <div className="main">
        <h1>Welcome to ChatBOT</h1>

        <div className="chats">
          <div className="chat">
              <img className='chatImg'  src={userIcon} alt=""  /><p className="txt">Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt corrupti suscipit maiores, praesentium sint eaque rem repudiandae reiciendis neque dolore fugit dicta maxime delectus. Nam ipsam repellendus voluptatibus praesentium eaque!</p>
          </div>
          <div className="chat bot">
              <img className='chatImg' src={gptImgLogo} alt=""  /><p className="txt">Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus culpa accusantium distinctio velit perferendis dolorum repellat ad nobis odit nostrum, at commodi numquam dolore. Consectetur deleniti nesciunt tenetur totam, excepturi, deserunt eveniet modi placeat a, iure omnis? Cumque a tempore possimus, consequuntur eveniet sed iste, ea aperiam nostrum dignissimos culpa itaque nisi nemo dolorem ullam provident corporis quis repellendus soluta inventore rerum! Eos tempore molestias pariatur exercitationem et cum dignissimos cupiditate. Maiores expedita sapiente porro totam sed voluptatem corporis quasi magni quae iusto suscipit ex modi, pariatur veniam? Culpa, cum est voluptatum dolore voluptates eveniet dolorum aliquid accusamus autem aut!</p>
          </div>
        </div>

        <div className="chatFooter">
          <div className="inp">
            <input type="text" placeholder="Send a message..." />
            <button className="sendBtn">
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
