import './Sidebar.css'

function Sidebar({ conversations, activeSessionId, onNewChat, onSelectConversation }) {
  return (
    <aside className="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <div className="app-logo">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <h1>SwiftCart AI</h1>
        </div>
      </div>

      {/* New Chat Button */}
      <button className="new-chat-btn" onClick={onNewChat}>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        New Chat
      </button>

      {/* Conversations List */}
      <div className="conversations-list">
        <div className="conversations-header">Conversation History</div>
        {conversations.length === 0 ? (
          <div className="empty-history">
            <p>No conversations yet</p>
            <span>Start a new chat to begin</span>
          </div>
        ) : (
          <ul className="history-items">
            {conversations.map(conversation => (
              <li
                key={conversation.id}
                className={`history-item ${
                  activeSessionId === conversation.id ? 'active' : ''
                }`}
                onClick={() => onSelectConversation(conversation.id)}
                title={conversation.lastMessage || conversation.title}
              >
                <span className="history-item-text">
                  {conversation.lastMessage
                    ? conversation.lastMessage.substring(0, 40)
                    : conversation.title}
                </span>
                <span className="history-item-time">
                  {new Date(conversation.timestamp).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="footer-item">
          <span className="icon">⚙️</span>
          <span>Settings</span>
        </div>
        <div className="footer-item">
          <span className="icon">❓</span>
          <span>Help</span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
