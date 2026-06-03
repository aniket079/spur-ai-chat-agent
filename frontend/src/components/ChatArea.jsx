import { useState, useEffect } from 'react'
import MessageBubble from './MessageBubble'
import MessageInput from './MessageInput'
import './ChatArea.css'

const FAQ_SUGGESTIONS = [
  "How can I track my order?",
  "What is your return policy?",
  "How do I contact support?",
  "Can I change my delivery address?"
]

function ChatArea({ sessionId, messages, loading, error, onSendMessage, messagesEndRef }) {
  const [inputValue, setInputValue] = useState('')

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue)
      setInputValue('')
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const isEmpty = messages.length === 0

  return (
    <div className="chat-area">
      {/* Header */}
      <header className="chat-header">
        <div className="header-left">
          <h2>SwiftCart Support</h2>
          <span className="online-status">
            <span className="status-dot"></span>
            Online
          </span>
        </div>
        <div className="header-right">
          <button className="icon-btn" title="More options">
            ⋮
          </button>
        </div>
      </header>

      {/* Messages Container */}
      <div className="messages-container">
        {isEmpty ? (
          <div className="empty-state">
            <div className="welcome-icon">💬</div>
            <h3>Welcome to SwiftCart AI</h3>
            <p>How can we help you today?</p>
            <p className="empty-subtext">
              Our support team is here to assist you with any questions
            </p>
          </div>
        ) : null}

        {/* Messages */}
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id || index}
            message={message.content}
            sender={message.sender}
            timestamp={message.timestamp}
          />
        ))}

        {/* Loading indicator */}
        {loading && messages.length > 0 && (
          <div className="message-group ai-message-group">
            <div className="message-bubble ai-bubble typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error message */}
      {error && (
        <div className="error-banner">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
          </svg>
          {error}
        </div>
      )}

      {/* FAQ Suggestions - only show when empty */}
      {isEmpty && !loading && (
        <div className="suggestions-section">
          <p className="suggestions-title">Suggested questions:</p>
          <div className="suggestions-grid">
            {FAQ_SUGGESTIONS.map((suggestion, idx) => (
              <button
                key={idx}
                className="suggestion-btn"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <MessageInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSendMessage}
        onKeyPress={handleKeyPress}
        disabled={loading}
        placeholder="Type your message here..."
      />
    </div>
  )
}

export default ChatArea
