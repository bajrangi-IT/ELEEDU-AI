import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Volume2, User, Bot, AlertTriangle, MicOff } from 'lucide-react';
import axios from 'axios';
import { useVoice } from '../hooks/useVoice';

const Assistant = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Hello! I am your AI Election Assistant. How can I help you today?', timestamp: new Date() }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { isListening, speak, listen } = useVoice();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), type: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    // Call Backend API with Gemini Integration
    try {
      const history = messages.slice(-3).map(m => ({ role: m.type === 'user' ? 'user' : 'model', parts: [{ text: m.text }] }));
      
      const response = await axios.post('/api/chat', { 
        query: input,
        history: history 
      });
      
      const botResponse = { 
        id: Date.now() + 1, 
        type: 'bot', 
        text: response.data.response, 
        timestamp: new Date(),
        isMisinformation: response.data.response.toLowerCase().includes('misinformation') || response.data.response.toLowerCase().includes('fact-check')
      };
      setMessages(prev => [...prev, botResponse]);
      speak(botResponse.text);
    } catch (error) {
      console.error('Chat Error:', error);
      const serverError = error.response?.data?.error || error.response?.data?.details || error.message;
      const errorMsg = { 
        id: Date.now() + 1, 
        type: 'bot', 
        text: `I'm having trouble connecting to my AI brain. Detail: ${serverError}`, 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const startListening = () => {
    listen((transcript) => {
      setInput(transcript);
    });
  };

  // Removed getMockResponse as we are using the API now

  const formatMessage = (text) => {
    // Basic markdown-like formatting for Bold and Newlines
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line.split('**').map((part, j) => (
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
        ))}
        <br />
      </span>
    ));
  };

  return (
    <div className="assistant-container animate-fade-in">
      <div className="chat-window glass-morphism">
        <div className="chat-header">
          <div className="bot-info">
            <Bot className="bot-avatar-icon" />
            <div>
              <h3>Election Assistant</h3>
              <p>Online | Secure & Private</p>
            </div>
          </div>
          <div className="chat-actions">
            <button 
              className="icon-btn" 
              onClick={() => speak(messages[messages.length-1]?.text)}
              aria-label="Read last message aloud"
            >
              <Volume2 size={18} />
            </button>
          </div>
        </div>

        <div 
          className="messages-area" 
          role="log" 
          aria-live="polite" 
          aria-relevant="additions"
          aria-label="Chat history"
        >
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id} 
                className={`message-wrapper ${msg.type}`}
                role="article"
                aria-label={`${msg.type === 'user' ? 'Your message' : 'AI Assistant message'} sent at ${msg.timestamp.toLocaleTimeString()}`}
                initial={{ opacity: 0, x: msg.type === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className={`message-bubble ${msg.isMisinformation ? 'misinfo' : ''}`}>
                  {msg.isMisinformation && (
                    <div className="misinfo-alert" role="alert">
                      <AlertTriangle size={14} aria-hidden="true" /> Fact-check needed
                    </div>
                  )}
                  {formatMessage(msg.text)}
                </div>
                <span className="timestamp">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <div className="typing-indicator" aria-label="AI is typing">
              <span></span><span></span><span></span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="input-area" onSubmit={handleSend}>
          <button 
            type="button" 
            className={`voice-btn ${isListening ? 'active' : ''}`}
            onClick={startListening}
            title="Voice Input"
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          <input 
            type="text" 
            placeholder="Ask about voting, registration, or candidates..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Chat input field"
          />
          <button 
            type="submit" 
            className="send-btn" 
            disabled={!input.trim()}
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        </form>
      </div>

      <style jsx>{`
        .assistant-container {
          flex: 1;
          display: flex;
          justify-content: center;
          padding: 20px 0;
          height: calc(100vh - 200px);
        }

        .chat-window {
          width: 100%;
          max-width: 900px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .chat-header {
          padding: 20px;
          border-bottom: 1px solid var(--glass-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.02);
        }

        .bot-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .bot-avatar-icon {
          color: var(--primary);
        }

        .chat-header h3 { font-size: 1.1rem; }
        .chat-header p { font-size: 0.8rem; color: #10b981; }

        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .message-wrapper {
          max-width: 80%;
          display: flex;
          flex-direction: column;
        }

        .message-wrapper.user { align-self: flex-end; }
        .message-wrapper.bot { align-self: flex-start; }

        .message-bubble {
          padding: 12px 18px;
          border-radius: 18px;
          font-size: 0.95rem;
          position: relative;
        }

        .user .message-bubble {
          background: var(--primary);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .bot .message-bubble {
          background: var(--glass);
          border: 1px solid var(--glass-border);
          border-bottom-left-radius: 4px;
        }

        .message-bubble.misinfo {
          border: 1px solid #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }

        .misinfo-alert {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.75rem;
          color: #ef4444;
          margin-bottom: 5px;
          font-weight: 700;
        }

        .timestamp {
          font-size: 0.7rem;
          color: var(--text-muted);
          margin-top: 5px;
          padding: 0 5px;
        }

        .user .timestamp { text-align: right; }

        .input-area {
          padding: 20px;
          display: flex;
          gap: 15px;
          background: rgba(255, 255, 255, 0.02);
          border-top: 1px solid var(--glass-border);
        }

        .input-area input {
          flex: 1;
          background: var(--glass);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 0 20px;
          color: white;
          outline: none;
          transition: var(--transition);
        }

        .input-area input:focus {
          border-color: var(--primary);
        }

        .voice-btn, .send-btn {
          background: var(--glass);
          color: var(--text-main);
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .send-btn { background: var(--primary); }
        .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .typing-indicator {
          display: flex;
          gap: 5px;
          padding: 10px;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          background: var(--text-muted);
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }

        .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }
        .voice-btn.active {
          background: #ef4444;
          color: white;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}</style>
    </div>
  );
};

export default Assistant;
