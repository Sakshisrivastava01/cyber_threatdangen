# AI Copilot

The DANGEN AI Copilot is a retrieval-driven threat intelligence assistant designed to augment decision-making with security best practices.

## Implementation

- Located in `server/rag/rag_pipeline.py`.
- Uses a document library of cybersecurity knowledge, MITRE ATT&CK references, OWASP guidance, CVE summaries, and incident response playbooks.
- Attempts to initialize a semantic search stack using optional ML dependencies:
  - `langchain_community`
  - `HuggingFaceEmbeddings`
  - `FAISS`
  - `torch`

## Fallback strategy

- If the semantic stack fails to initialize, the pipeline automatically falls back to a pure Python keyword vector store.
- The fallback store still provides retrieval quality by leveraging tokenized document vectors, cosine similarity, and title matching boosts.

## Copilot behavior

- The retrieval engine returns a list of relevant documents with:
  - `title`
  - `content`
  - `source`
  - `category`
  - `score`
- This design enables future user-facing AI prompt layers to produce actionable security guidance without requiring external model inference.

## Future integration

- Add managed vector stores such as Pinecone, Weaviate, or self-hosted FAISS.
- Integrate with production-scale LLM providers for secure analysis and compliance-aware intelligence.
- Add query telemetry and query caching for enterprise auditability.
