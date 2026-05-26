# RAG Architecture

DANGEN includes a threat intelligence retrieval system built for enterprise-grade intelligence augmentation.

## Key features

- `server/rag/rag_pipeline.py` contains the RAG implementation.
- The pipeline attempts to initialize ML-backed retrieval using LangChain, Hugging Face embeddings, and FAISS.
- If ML dependencies are unavailable, a pure Python fallback vector store is used.
- The fallback engine uses tokenized term vectors, cosine similarity, and title matching boosts.

## RAG retrieval flow

1. Query text is passed to `CyberCopilotRAG.retrieve()`.
2. If optional ML dependencies load successfully, the system performs semantic similarity search against a FAISS index.
3. Otherwise, the fallback vector store computes keyword overlap and similarity scores.
4. Top matches are returned with titles, sources, categories, and confidence scores.

## Production readiness

- The pipeline was built to degrade gracefully with a fallback engine to avoid service interruption.
- Optional packages can be added later for full NLP capability without changing the API contract.
- The RAG system is a strong candidate for integration with Hugging Face, OpenAI, or managed vector database services.
