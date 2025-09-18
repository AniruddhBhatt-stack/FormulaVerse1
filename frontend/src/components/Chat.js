import React, { useEffect, useState, useRef } from 'react';
import { useMemo } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [chatHistory, setChatHistory] = useState([
    { id: 1, title: "Linear Algebra Basics", timestamp: "2 hours ago" },
    { id: 2, title: "Calculus Integration", timestamp: "1 day ago" },
    { id: 3, title: "Statistics Problems", timestamp: "3 days ago" },
  ]);
  const scrollRef = useRef();

  useEffect(() => {
  const token = localStorage.getItem('mathnarrator_token');
  if (!token) {
    // Guest mode
    setUser({
      name: "Guest User",
      email: null,
      avatar: "https://ui-avatars.com/api/?name=Guest&background=random"
    });
  } else {
    // Fetch user info from backend
    fetch("http://localhost:5000/api/me", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setUser({
          name: data.name,
          email: data.email,
          avatar: data.picture || "https://lh3.googleusercontent.com/a/default-user=s96-c"
        });
      })
      .catch(() => {
        // If token invalid, fallback to guest
        setUser({
          name: "Guest User",
          email: null,
          avatar: "https://ui-avatars.com/api/?name=Guest&background=random"
        });
      });
  }
}, []);


  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    
    const newMsg = { from: 'user', text: trimmed, timestamp: new Date() };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setLoading(true);

    const token = localStorage.getItem('mathnarrator_token');
    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ query: trimmed })
      });
      const data = await resp.json();
      const botMsg = { 
        from: 'bot', 
        text: data.reply || 'I can help you with mathematical expressions and problems. Try asking me about calculus, algebra, or statistics!',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        from: 'bot', 
        text: 'Network error. Please try again.', 
        timestamp: new Date() 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('mathnarrator_token');
    // In a real app, would navigate to login page
    window.location.href = '/';
  };

  const startNewChat = () => {
    setMessages([]);
  };

  return (
    <div className="chat-page">
     
      <div className="math-background">
        {Array.from({ length: 50 }).map((_, i) => (
          <span
            key={i}
            className="math-symbol"
            style={{
              "--x": Math.random(),
              "--y": Math.random(),
              animationDuration: `${10 + Math.random() * 20}s`,
              fontSize: `${1 + Math.random() * 2}rem`,
            }}
          >
            {["∑", "√", "π", "∞", "∫", "∆", "≈", "∇"][i % 8]}
          </span>
        ))}
      </div>

      {/* Left Sidebar */}
      <div className="sidebar">
        {/* User Profile */}
        {user && (
          <div className="user-profile">
            <img src={user.avatar} alt={user.name} className="user-avatar" />
            <div className="user-info">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
          </div>
        )}

        {/* New Chat Button */}
        <button className="new-chat-btn" onClick={startNewChat}>
          <span className="plus-icon">+</span>
          New Chat
        </button>

        {/* Chat History */}
        <div className="chat-history">
          <h4>Recent Chats</h4>
          {chatHistory.map(chat => (
            <div key={chat.id} className="history-item">
              <div className="history-title">{chat.title}</div>
              <div className="history-timestamp">{chat.timestamp}</div>
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      {/* Main Chat Area */}
      <div className="main-chat">
        {/* Top Navigation */}
        <nav className="top-nav">
  <div className="logo-container">
    <img src="/logo.png" alt="logo" className="logo" />
  </div>

  <div className="nav-content">
    <h1>
      Formula<span className="highlight">Verse</span>
    </h1>
    <p>AI-Powered Mathematical Assistant</p>
  </div>
</nav>



        {/* Chat Messages */}
        <div className="chat-messages" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="welcome-message">
              <h2>Welcome to Formula<span className="highlight">Verse!</span></h2>
              <p>Ask me anything about mathematics - from basic algebra to advanced calculus.</p>
              <div className="example-questions">
                <div className="example">Try: "Solve x² + 5x + 6 = 0"</div>
                <div className="example">Try: "Explain derivatives"</div>
                <div className="example">Try: "What is the integral of sin(x)?"</div>
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`message ${msg.from}`}>
                <div className="message-content">
                  {msg.text}
                </div>
                <div className="message-timestamp">
                  {msg.timestamp?.toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="message bot loading">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="chat-input">
          <div className="input-container">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Type a math expression or question..."
              className="message-input"
            />
            <button 
              className="send-btn" 
              onClick={sendMessage} 
              disabled={loading || !input.trim()}
            >
              <span className="send-icon">→</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        @import url('https://fonts.googleapis.com/css2?family=Kode+Mono:wght@400;500;600;700;800&display=swap');

        .chat-page {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          font-family: "Kode Mono", monospace;
          background: #0c0a18;
          color: #e2e8f0;
          overflow: hidden;
          display: flex;
          margin: 0;
          padding: 0;
        }

        /* Math Background */
        .math-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
        }
        .math-symbol {
          position: absolute;
          opacity: 0.08;
          color: #fff;
          animation: float 20s linear infinite;
          left: calc(100% * var(--x, 0));
          top: calc(100% * var(--y, 0));
        }
        @keyframes float {
          from {
            transform: translateY(100vh) rotate(0deg);
          }
          to {
            transform: translateY(-100vh) rotate(360deg);
          }
        }

        /* Sidebar */
        .sidebar {
          width: 320px;
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(10px);
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          z-index: 10;
          position: relative;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .user-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 2px solid rgba(161, 188, 232, 0.3);
        }

        .user-info h3 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
        }

        .user-info p {
          margin: 0;
          font-size: 0.85rem;
          color: #a0aec0;
        }

        .new-chat-btn {
          width: 100%;
          padding: 12px 16px;
          background: linear-gradient(45deg, #4285f4 15%, #ea4335 25%, #fbbc05 50%, #0004fdff 60%);
          background-size: 300% 300%;
          color: white;
          border: none;
          border-radius: 12px;
          font-family: inherit;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          transition: all 0.2s ease;
        }

        .new-chat-btn:hover {
          transform: translateY(-2px);
          background-position: 100% 0;
        }

        .plus-icon {
          font-size: 1.2rem;
          font-weight: bold;
        }

        .chat-history {
          flex: 1;
          overflow-y: auto;
        }

        .chat-history h4 {
          color: #a0aec0;
          font-size: 0.9rem;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .history-item {
          padding: 12px 16px;
          margin-bottom: 8px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s ease;
          border: 1px solid transparent;
        }

        .history-item:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(161, 188, 232, 0.2);
        }

        .history-title {
          font-size: 0.9rem;
          margin-bottom: 4px;
        }

        .history-timestamp {
          font-size: 0.8rem;
          color: #718096;
        }

        .logout-btn {
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.05);
          color: #e2e8f0;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 1rem;
        }

        .logout-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }

        /* Main Chat Area */
        .main-chat {
          flex: 1;
          display: flex;
          flex-direction: column;
          z-index: 10;
          position: relative;
        }

        /* Top Navigation */
        .top-nav {
  display: flex;
  flex-direction: row-reverse; 
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;
  background: transparent;
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;   
  flex: 0 0 auto;       
}

.logo {
  max-width: 80px;  
  height: auto;
  display: block;  
}

.nav-content {
  flex: 1; 
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
}

.nav-content h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
}

.nav-content .highlight {
  color: #0004fdff;
  text-shadow: 0 0 8px #00012fff;
}

.nav-content p {
  margin: 0;
  font-size: 1rem;
  color: #bbb;
}

        /* Chat Messages */
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .welcome-message {
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
          padding: 2rem;
        }

        .welcome-message h2 {
          color: #ffffff;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .welcome-message p {
          color: #a0aec0;
          margin-bottom: 2rem;
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .example-questions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: center;
        }

        .example {
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          font-size: 0.9rem;
          color: #a0aec0;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.2s ease;
        }

        .example:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(161, 188, 232, 0.2);
          transform: translateY(-1px);
        }

        .message {
          max-width: 70%;
          margin-bottom: 1rem;
        }

        .message.user {
          align-self: flex-end;
        }

        .message.bot {
          align-self: flex-start;
        }

        .message-content {
          padding: 16px 20px;
          border-radius: 20px;
          font-size: 0.95rem;
          line-height: 1.5;
          word-wrap: break-word;
        }

        .message.user .message-content {
          background: #0004fdff;
          color: white;
          border-bottom-right-radius: 8px;
        }

        .message.bot .message-content {
          background: rgba(255, 255, 255, 0.08);
          color: #e2e8f0;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-bottom-left-radius: 8px;
        }

        .message-timestamp {
          font-size: 0.75rem;
          color: #718096;
          margin-top: 4px;
          text-align: right;
        }

        .message.bot .message-timestamp {
          text-align: left;
        }

        /* Typing Indicator */
        .typing-indicator {
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #a0aec0;
          animation: typing 1.4s infinite;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }

        /* Chat Input */
        .chat-input {
          padding: 1.5rem 2rem;
          
        }

        .input-container {
          display: flex;
          gap: 1rem;
          align-items: center;
          max-width: 800px;
          margin: 0 auto;
        }

        .message-input {
          flex: 1;
          padding: 16px 20px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 25px;
          color: #e2e8f0;
          font-family: inherit;
          font-size: 1rem;
          outline: none;
          transition: all 0.2s ease;
        }

        .message-input:focus {
          border-color: rgba(161, 188, 232, 0.4);
          background: rgba(255, 255, 255, 0.12);
          box-shadow: 0 0 0 3px rgba(161, 188, 232, 0.1);
        }

        .message-input::placeholder {
          color: #718096;
        }

        .send-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(45deg, #4285f4 15%, #ea4335 25%, #fbbc05 50%, #34a853 60%);
          background-size: 300% 300%;
          border: none;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .send-btn:hover:not(:disabled) {
          transform: scale(1.05);
          background-position: 100% 0;
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .send-icon {
          font-weight: bold;
        }

        /* Scrollbar Styling */
        .chat-messages::-webkit-scrollbar,
        .chat-history::-webkit-scrollbar {
          width: 6px;
        }

        .chat-messages::-webkit-scrollbar-track,
        .chat-history::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }

        .chat-messages::-webkit-scrollbar-thumb,
        .chat-history::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }

        .chat-messages::-webkit-scrollbar-thumb:hover,
        .chat-history::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .sidebar {
            width: 280px;
          }
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 260px;
            padding: 1rem;
          }
          
          .chat-messages {
            padding: 1rem;
          }
          
          .top-nav {
            padding: 1rem;
          }
          
          .chat-input {
            padding: 1rem;
          }
          
          .message {
            max-width: 85%;
          }
          
          .nav-content h1 {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 640px) {
          .chat-page {
            flex-direction: column;
          }
          
          .sidebar {
            width: 100%;
            height: auto;
            max-height: 200px;
            flex-direction: row;
            overflow-x: auto;
            padding: 1rem;
          }
          
          .user-profile {
            min-width: 200px;
            margin-right: 1rem;
          }
          
          .chat-history {
            display: none;
          }
          
          .main-chat {
            flex: 1;
            min-height: 0;
          }
        }

        /* Animation for smooth entrance */
        .chat-page {
          opacity: 0;
          animation: fadeIn 0.5s ease forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        /* Pulse animation for new chat button */
        .new-chat-btn {
          position: relative;
        }

        .new-chat-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 12px;
          padding: 1px;
          background: linear-gradient(45deg, #4285f4, #ea4335, #fbbc05, #34a853);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          opacity: 0;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
}