import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chat.css';

interface Message {
  id: string;
  sender: 'USER' | 'AI';
  text: string;
  createdAt: string;
}

interface Conversation {
  sessionId: string;
  title: string;
  updatedAt: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
const ACTIVE_SESSION_ID_KEY = 'swiftcart_active_session_id';
const CONVERSATIONS_KEY = 'swiftcart_conversations';

const FAQ_SUGGESTIONS = [
  'How do I track my order?',
  'What is your return policy?',
  'How do I change my password?',
  'Contact customer support'
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize sessionId from localStorage and load messages if exists
  useEffect(() => {
    const saved = localStorage.getItem(ACTIVE_SESSION_ID_KEY);
    if (saved) {
      setSessionId(saved);
      loadConversation(saved);
    }
    loadConversations();
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = () => {
    const saved = localStorage.getItem(CONVERSATIONS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConversations(parsed);
      } catch (e) {
        console.error('Failed to parse conversations:', e);
      }
    }
  };

const saveConversation = (conversationId: string, title: string) => {
  const newConversation: Conversation = {
    sessionId: conversationId,
    title,
    updatedAt: new Date().toISOString(),
  };

  const updated = [
    newConversation,
    ...conversations.filter((c) => c.sessionId !== conversationId),
  ];

  setConversations(updated);
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(updated));
};

  const loadConversation = async (convSessionId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/conversations/${convSessionId}/messages`);
      const { messages: conversationMessages } = response.data;
      setMessages(conversationMessages);
      setSessionId(convSessionId);
      localStorage.setItem(ACTIVE_SESSION_ID_KEY, convSessionId);
      setError(null);
    } catch (err) {
      setError('Failed to load conversation. Please try again.');
      console.error('API Error:', err);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setSessionId(null);
    setError(null);
    localStorage.removeItem(ACTIVE_SESSION_ID_KEY);
  };

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
        localStorage.setItem(ACTIVE_SESSION_ID_KEY, newSessionId);
        // Save conversation with first message as title
saveConversation(
  newSessionId,
  userMessage.substring(0, 50) + (userMessage.length > 50 ? "..." : "")
);
      }

      // Add AI reply to UI
   if (reply) {
  const aiMessage: Message = {
    id: typeof reply === "object" && reply.id ? reply.id : `ai-${Date.now()}`,
    sender: "AI",
    text: typeof reply === "string" ? reply : String(reply.text ?? ""),
    createdAt:
      typeof reply === "object" && reply.createdAt
        ? reply.createdAt
        : new Date().toISOString(),
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

  const handleFAQClick = (faq: string) => {
    setInput(faq);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !loading) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">SwiftCart AI</h2>
          <button 
            className="new-chat-btn"
            onClick={handleNewChat}
          >
            <span className="plus-icon">+</span> New Chat
          </button>
        </div>
        
        <div className="conversations-list">
          <h3 className="conversations-title">Recent Conversations</h3>
          {conversations.length === 0 ? (
            <p className="no-conversations">No conversations yet</p>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.sessionId}
                className={`conversation-item ${sessionId === conv.sessionId ? 'active' : ''}`}
                onClick={() => loadConversation(conv.sessionId)}
              >
                <div className="conversation-title">{conv.title}</div>
                <div className="conversation-time">
                  {new Date(conv.updatedAt).toLocaleDateString()}
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="main-chat">
        {/* Header */}
        <header className="chat-header">
          <button 
            className="toggle-sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <div className="header-content">
            <h1>AI Support Agent</h1>
            <div className="online-status">
              <span className="status-dot"></span>
              <span className="status-text">Online</span>
            </div>
          </div>
        </header>

        {/* Messages Area */}
        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <h2>Welcome to SwiftCart Support</h2>
              <p>How can I help you today?</p>
              <div className="faq-suggestions">
                {FAQ_SUGGESTIONS.map((faq) => (
                  <button
                    key={faq}
                    className="faq-button"
                    onClick={() => handleFAQClick(faq)}
                  >
                    {faq}
                  </button>
                ))}
              </div>
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

        {/* Input Area */}
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
      </main>
    </div>
  );
}
