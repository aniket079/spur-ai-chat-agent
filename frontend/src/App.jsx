import { useState, useEffect, useRef } from 'react'
import Sidebar from './components/Sidebar'
import ChatArea from './components/ChatArea'
import './App.css'

function App() {
  const [sessionId, setSessionId] = useState(null)
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)

  const API_URL = '/api'

  // Load conversations from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('conversations')
    if (saved) {
      try {
        setConversations(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse conversations from localStorage:', e)
      }
    }
    const activeSession = localStorage.getItem('activeSessionId')
    if (activeSession) {
      setSessionId(activeSession)
      loadMessages(activeSession)
    }
  }, [])

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations))
  }, [conversations])

  // Save active session ID to localStorage
  useEffect(() => {
    if (sessionId) {
      localStorage.setItem('activeSessionId', sessionId)
    } else {
      localStorage.removeItem('activeSessionId')
    }
  }, [sessionId])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const createNewConversation = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_URL}/conversations`, {
        method: 'POST',
      })
      const data = await response.json()
      const newSessionId = data.id
      setSessionId(newSessionId)
      setMessages([])

      // Add to conversation history
      const newConversation = {
        id: newSessionId,
        title: 'New conversation',
        lastMessage: null,
        timestamp: new Date().toISOString(),
      }
      setConversations([newConversation, ...conversations])
    } catch (err) {
      setError('Failed to create new conversation')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (id) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_URL}/conversations/${id}/messages`)
      if (!response.ok) {
        throw new Error('Failed to load messages')
      }
      const data = await response.json()
      setMessages(data.messages || [])
      setSessionId(id)
    } catch (err) {
      setError('Failed to load conversation')
      console.error(err)
      setMessages([])
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (text) => {
    if (!text.trim()) return

    try {
      setError(null)
      setLoading(true)

      // Add user message optimistically
      const userMessage = {
        id: Date.now().toString(),
        content: text,
        sender: 'USER',
        timestamp: new Date().toISOString(),
      }
      setMessages([...messages, userMessage])

      const response = await fetch(`${API_URL}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          sessionId: sessionId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()
      
      if (!sessionId) {
        setSessionId(data.sessionId)
        const newConversation = {
          id: data.sessionId,
          title: text.substring(0, 50),
          lastMessage: text,
          timestamp: new Date().toISOString(),
        }
        setConversations([newConversation, ...conversations])
      } else {
        // Update the conversation in history with the latest message
        setConversations(
          conversations.map(conv =>
            conv.id === data.sessionId
              ? { ...conv, lastMessage: text, timestamp: new Date().toISOString() }
              : conv
          )
        )
      }

      // Reload messages to get the AI response
      await loadMessages(data.sessionId)
    } catch (err) {
      setError('Failed to send message. Please try again.')
      console.error(err)
      // Remove the optimistic user message on error
      setMessages(messages.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  const handleNewChat = () => {
    setSessionId(null)
    setMessages([])
    createNewConversation()
  }

  const handleSelectConversation = (id) => {
    loadMessages(id)
  }

  return (
    <div className="app-container">
      <Sidebar
        conversations={conversations}
        activeSessionId={sessionId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
      />
      <ChatArea
        sessionId={sessionId}
        messages={messages}
        loading={loading}
        error={error}
        onSendMessage={sendMessage}
        messagesEndRef={messagesEndRef}
      />
    </div>
  )
}

export default App
