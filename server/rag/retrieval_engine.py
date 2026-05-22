import os
from typing import Dict, List

from .document_loader import CORPUS_DIR
from .embedding_engine import CyberEmbeddingEngine
from .vector_store import CyberVectorStore


def _normalize_title(filename: str) -> str:
    title = os.path.splitext(filename)[0]
    title = title.replace("-", " ").replace("_", " ")
    return title.title()


def _chunk_text(text: str, chunk_size: int = 320, overlap: int = 60) -> List[str]:
    tokens = text.split()
    if len(tokens) <= chunk_size:
        return [text]

    chunks: List[str] = []
    start = 0
    while start < len(tokens):
        end = min(start + chunk_size, len(tokens))
        chunk = " ".join(tokens[start:end]).strip()
        if chunk:
            chunks.append(chunk)
        if end == len(tokens):
            break
        start = max(0, end - overlap)
    return chunks


class CyberRetrievalEngine:
    def __init__(self, corpus_dir: str = CORPUS_DIR):
        self.corpus_dir = corpus_dir
        self.documents: List[Dict[str, object]] = self._load_documents(corpus_dir)
        self.embedding_engine = None
        self.vector_store = None

        if self.documents:
            try:
                self.embedding_engine = CyberEmbeddingEngine()
                embeddings = self.embedding_engine.embed_texts([doc["content"] for doc in self.documents])
                self.vector_store = CyberVectorStore(embeddings.shape[1])
                self.vector_store.add_texts(embeddings, [doc["content"] for doc in self.documents])
            except Exception:
                self.embedding_engine = None
                self.vector_store = None

    def initialize(self) -> None:
        return

    def _load_documents(self, corpus_dir: str) -> List[Dict[str, object]]:
        documents: List[Dict[str, object]] = []
        if not os.path.isdir(corpus_dir):
            return documents

        for filename in sorted(os.listdir(corpus_dir)):
            if not filename.lower().endswith(".txt"):
                continue

            path = os.path.join(corpus_dir, filename)
            with open(path, "r", encoding="utf-8") as handle:
                content = handle.read().strip()

            if not content:
                continue

            chunks = _chunk_text(content)
            for index, chunk in enumerate(chunks):
                documents.append({
                    "title": _normalize_title(filename),
                    "source": filename,
                    "category": "Cybersecurity",
                    "content": chunk,
                    "chunk_id": index,
                    "metadata": {
                        "source": filename,
                        "category": "Cybersecurity",
                        "chunk_id": index,
                        "length": len(chunk),
                    },
                })

        return documents

    def retrieve(self, query: str, k: int = 4) -> List[Dict[str, object]]:
        if not self.vector_store or not self.embedding_engine or not query:
            return []

        query_embedding = self.embedding_engine.embed_texts([query])[0]
        hits = self.vector_store.similarity_search(query_embedding, k=k)
        results: List[Dict[str, object]] = []

        for hit in hits:
            idx = hit["index"]
            if idx < 0 or idx >= len(self.documents):
                continue
            doc = self.documents[idx]
            results.append({
                "title": doc["title"],
                "source": doc["source"],
                "category": doc["category"],
                "content": doc["content"],
                "score": hit["score"],
                "metadata": doc.get("metadata", {}),
            })

        return results
