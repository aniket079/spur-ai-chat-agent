import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chat.css';

interface Message {
  id: string;
  sender: 'USER' | 'AI';
  text: string;
  createdAt: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
const SESSION_ID_KEY = 'swiftcart_session_id';

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize sessionId from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(SESSION_ID_KEY);
    if (saved) {
      setSessionId(saved);
    }
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setError(null);
    setLoading(true);

    // Add user message to UI immediately
    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      sender: 'USER',
      text: userMessage,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      const payload = sessionId
        ? { message: userMessage, sessionId }
        : { message: userMessage };

      const response = await axios.post(
        `${API_BASE_URL}/chat/message`,
        payload,
        { timeout: 30000 }
      );

      const { sessionId: newSessionId, reply } = response.data;

      // Save sessionId if it's the first message
      if (!sessionId && newSessionId) {
        setSessionId(newSessionId);
        localStorage.setItem(SESSION_ID_KEY, newSessionId);
      }

      // Add AI reply to UI
      if (reply) {
        const aiMessage: Message = {
          id: reply.id,
          sender: 'AI',
          text: reply.text,
          createdAt: reply.createdAt,
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('API Error:', err);

      // Remove the temporary user message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== tempUserMessage.id));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !loading) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>SwiftCart Support</h1>
        <p>How can we help you today?</p>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="empty-state">
            <p>Start a conversation with our AI support agent</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.sender === 'USER' ? 'user-message' : 'ai-message'}`}
          >
            <div className="message-content">
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="message ai-message">
            <div className="message-content typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="chat-input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={loading}
          className="chat-input"
        />
        <button
          onClick={handleSendMessage}
          disabled={loading || !input.trim()}
          className="send-button"
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
