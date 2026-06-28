# Second Brain

Second Brain is an AI-powered note-taking application that allows users to save notes, perform semantic searches, and chat with their knowledge using Retrieval-Augmented Generation (RAG).

## Features

* User Authentication (JWT)
* Create, Update and Delete Notes
* Semantic Search
* AI Chat with Your Notes
* Save Links Along with Notes
* Responsive UI

## Tech Stack

**Frontend**

* React
* TypeScript
* Tailwind CSS

**Backend**

* Node.js
* Express
* TypeScript

**Database & AI**

* PostgreSQL
* Pinecone
* Hugging Face Embeddings
* Groq LLM

## Getting Started

### Clone the repository

```bash
git clone <repository-url>
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend

```env
DATABASE_URL=
JWT_SECRET=
PINECONE_API_KEY=
PINECONE_INDEX_NAME=
HF_API_KEY=
HF_EMBEDDING_MODEL=
GROQ_API_KEY=
GROQ_MODEL=
```

## Future Improvements

* PDF Upload & Search
* YouTube Transcript Support
* AI Note Summarization
* Link Preview Support

---

Built to explore vector search, Retrieval-Augmented Generation (RAG), and LLM-powered applications.
