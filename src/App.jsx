import { useState } from 'react'
import './App.css'
import './index.css'
import axios from 'axios'

function App() {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [chatHistory, setChatHistory] = useState([])

  const handleChange = (e) => {
    setMessage(e.target.value);
  }

  const handleSend = async () => {
    try {
      console.log("Message Sent:", message);
      const res = await axios.post('http://localhost:5000/chat', { message });
      setResponse(res.data.text);
      setChatHistory([...chatHistory, { message, response: res.data.response }]);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderResponse = (text) => {
    const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    const italicText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
    const withLineBreaks = italicText.replace(/\n/g, '<br />');
    if (formattedText.includes("```")) {
        return <pre className="code-block">{withLineBreaks}</pre>;
    }
    return <p dangerouslySetInnerHTML={{ __html: withLineBreaks }} />;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && message.trim() !== "") {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden max-w-full mx-auto">
      <header style={{ 
        backgroundColor: 'inherit', 
        color: 'white', 
        fontSize: '24px', 
        fontWeight: 'bold', 
        textAlign: 'center', 
        padding: '20px', 
        position: 'fixed', 
        top: 0, 
        width: '100%', 
        zIndex: 10 
      }}>Chatbot</header>
      <div className="p-4 rounded mt-4">
        <div>
          {chatHistory.map((chat, index) => (
            <div key={index}>
              <div style={{ textAlign: 'right' }}>  
              <div className='text-right break-words whitespace-pre-wrap  ' style={{ backgroundImage: 'linear-gradient(to right, #0ce8f0, #0cbbf0)', padding: '10px', borderRadius: '5px', display: 'inline-block' }}><strong>You: </strong> {chat.message}</div>
              </div>
              <div className='text-left break-words'><strong>֍</strong> {renderResponse(chat.response)}</div>
            </div>
          ))}
        </div>
      </div>
      <footer className="relative text-white p-4 mt-auto w-full flex justify-center" style={{ 
        backgroundColor: 'inherit', 
        color: 'white', 
        fontSize: '24px', 
        fontWeight: 'bold', 
        textAlign: 'center', 
        padding: '20px', 
        position: 'fixed', 
        bottom: 10, 
        width: '100%', 
        zIndex: 10 
      }}>
        <textarea
            type="text"
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="p-3 text-lg w-full sm:w-[60%] md:w-[60%] lg:w-[60%] mx-auto rounded-xl border border-gray-300"
            placeholder="Your Chatbox"
        />
        {message && (
            <button
              onClick={handleSend}
              className="absolute right-[calc(21%)] top-1/2 transform -translate-y-1/2 text-xl text-blue-500 p-2 rounded-full flex items-center justify-center border-2 border-gray-500 hover:bg-gray-500 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  d="M10 6l6 6-6 6"
                />
              </svg>
            </button>
          )}
      </footer>
      {response && (
        <div className="p-4 bg-gray-200 rounded mt-4">
          <strong>Response:</strong> {response}
        </div>
      )}
    </div>
  )
}

export default App
