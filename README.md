# SwiftCart AI Support Agent

A production-inspired AI customer support chatbot built as part of the Spur Founding Full-Stack Engineer take-home assignment.

The application simulates a real customer support experience where users can chat with an AI support agent, maintain conversation history, and receive contextual responses powered by a Large Language Model.

---

<img width="1664" height="966" alt="image" src="https://github.com/user-attachments/assets/4a0d4d73-f525-4453-a1c3-a0d54315c3b1" />



## Features

### AI Support Chat

* Real-time chat interface
* Context-aware responses using conversation history
* Powered by Groq LLM (Llama 3.3 70B)

### Conversation Persistence

* Conversations stored in PostgreSQL
* Messages persisted across refreshes
* Sidebar conversation history
* Session-based chat experience

### Robust Backend

* TypeScript + Express
* Prisma ORM
* PostgreSQL database
* Input validation
* Error handling
* Clean service/repository architecture

### User Experience

* Modern chat interface
* Conversation sidebar
* Auto-scroll to latest message
* Loading states
* Suggested FAQ prompts
* Responsive layout

---

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Axios

### Backend

* Node.js
* Express
* TypeScript

### Database

* PostgreSQL
* Prisma ORM

### AI

* Groq API
* Llama 3.3 70B Versatile

---

## Architecture

```text
React Frontend
      │
      ▼
Express API
      │
      ▼
Chat Service
      │
      ▼
LLM Service
      │
      ▼
Groq API

      │

      ▼

Repositories
      │
      ▼
Prisma ORM
      │
      ▼
PostgreSQL
```

### Backend Structure

```text
src
├── controllers
├── routes
├── services
├── repositories
├── db
├── config
└── server.ts
```

### Design Decisions

* Repository pattern used to isolate database access.
* Business logic kept inside services.
* LLM integration abstracted behind a dedicated service.
* Session-based conversations without requiring authentication.
* PostgreSQL selected for persistence and future scalability.
* Prisma used for type-safe database operations.

---

## Database Schema

### Conversation

| Field     | Type     |
| --------- | -------- |
| id        | UUID     |
| createdAt | DateTime |
| updatedAt | DateTime |

### Message

| Field          | Type      |
| -------------- | --------- |
| id             | UUID      |
| conversationId | UUID      |
| sender         | USER / AI |
| text           | String    |
| createdAt      | DateTime  |

Relationship:

```text
Conversation
    │
    └── Messages (1:N)
```

---

## Running Locally

### 1. Clone Repository

```bash
git clone <repo-url>
cd swiftcart-ai-support-agent
```

### 2. Start PostgreSQL

```bash
docker compose up -d
```

### 3. Backend Setup

```bash
cd backend

npm install
```

Create `.env`

```env
PORT=4000

DATABASE_URL="postgresql://spur:spur123@localhost:5432/spur_ai_chat?schema=public"

GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
```

Run migrations:

```bash
npx prisma migrate dev
```

Start backend:

```bash
npm run dev
```

---

### 4. Frontend Setup

```bash
cd frontend

npm install
```

Create `.env`

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

Start frontend:

```bash
npm run dev
```

---

## API Endpoints

### Create / Continue Chat

```http
POST /api/chat/message
```

Request:

```json
{
  "message": "What is your return policy?",
  "sessionId": "optional"
}
```

Response:

```json
{
  "sessionId": "conversation-id",
  "reply": "Returns are accepted within 7 days of delivery."
}
```

---

### Get Conversation Messages

```http
GET /api/conversations/:id/messages
```

Response:

```json
{
  "sessionId": "conversation-id",
  "messages": [...]
}
```

---

## Store Knowledge

The AI assistant is configured with predefined support information including:

* Shipping Policy
* Return Policy
* Refund Policy
* Order Cancellation Policy
* Support Hours

Conversation history is included in prompts to provide contextual responses.

---

## Error Handling

The application gracefully handles:

* Empty messages
* Invalid conversation IDs
* LLM provider failures
* Network errors
* Database failures
* Missing environment variables

---

## Deployment

Frontend can be deployed to Vercel.

Backend can be deployed to Render.

Database can be hosted on Neon or Supabase PostgreSQL.

---

## Trade-offs & Future Improvements

### Trade-offs

* I used a prompt-based knowledge approach for the support assistant instead of implementing a full Retrieval-Augmented Generation (RAG) pipeline. This kept the solution focused and allowed me to deliver the core requirements within the assignment timeline.
* Conversation history is persisted in PostgreSQL, while conversation metadata for the sidebar is stored in browser local storage to keep the implementation simple and avoid introducing user authentication.
* I chose Groq as the LLM provider due to its fast response times and straightforward integration while still satisfying the requirement of using a production-grade LLM API.

### If I Had More Time

* Implement streaming AI responses for a more responsive chat experience.
* Add authentication and user-specific conversation management.
* Introduce Redis caching and rate limiting for improved scalability.
* Replace prompt-based store knowledge with a RAG-based knowledge retrieval system.
* Add conversation search, rename, and delete capabilities.
* Improve observability with structured logging, metrics, and monitoring.
* Add automated tests (unit, integration, and end-to-end) and CI/CD pipelines.
* Enhance the UI with richer conversation management and accessibility improvements.

## Author

Aniket Tiwari

Built as part of the Spur Founding Full-Stack Engineer Take-Home Assignment.
