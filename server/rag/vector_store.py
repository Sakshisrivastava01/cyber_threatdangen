import numpy as np
from typing import List, Dict, Any


class CyberVectorStore:
    def __init__(self, dimension: int):
        self.dimension = dimension
        self.index = self._create_index(dimension)
        self.texts: List[str] = []

    def _create_index(self, dimension: int):
        try:
            import faiss
            return faiss.IndexFlatIP(dimension)
        except ImportError:
            return None

    def add_texts(self, embeddings: np.ndarray, texts: List[str]) -> None:
        if self.index is None:
            raise RuntimeError("FAISS is unavailable. Install the server requirements to enable vector search.")

        if embeddings.ndim == 1:
            embeddings = embeddings.reshape(1, -1)

        embeddings = embeddings.astype("float32")
        import faiss
        faiss.normalize_L2(embeddings)
        self.index.add(embeddings)
        self.texts.extend(texts)

    def similarity_search(self, query_embedding: np.ndarray, k: int = 4) -> List[Dict[str, Any]]:
        if self.index is None:
            raise RuntimeError("FAISS is unavailable. Install the server requirements to enable similarity search.")

        query_vector = query_embedding.astype("float32").reshape(1, -1)
        import faiss
        faiss.normalize_L2(query_vector)
        scores, indices = self.index.search(query_vector, k)

        results: List[Dict[str, Any]] = []
        for score, idx in zip(scores[0], indices[0]):
            if idx < 0 or idx >= len(self.texts):
                continue
            results.append({"content": self.texts[idx], "score": float(score), "index": int(idx)})

        return results
