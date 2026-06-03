import './MessageBubble.css'

function MessageBubble({ message, sender, timestamp }) {
  const isUser = sender === 'USER'

  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  return (
    <div className={`message-group ${isUser ? 'user-message-group' : 'ai-message-group'}`}>
      <div className={`message-bubble ${isUser ? 'user-bubble' : 'ai-bubble'}`}>
        {message}
      </div>
      {timestamp && <div className="message-timestamp">{formatTime(timestamp)}</div>}
    </div>
  )
}

export default MessageBubble
