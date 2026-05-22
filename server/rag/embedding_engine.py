from typing import List


class CyberEmbeddingEngine:
    def __init__(self, model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
        self.model_name = model_name
        self.model = None
        self._load_model()

    def _load_model(self):
        try:
            from sentence_transformers import SentenceTransformer
            self.model = SentenceTransformer(self.model_name)
        except ImportError:
            self.model = None

    def embed_texts(self, texts: List[str]):
        if self.model is None:
            raise RuntimeError(
                "Missing sentence-transformers dependency. Install the server requirements to enable RAG embeddings."
            )
        return self.model.encode(texts, convert_to_numpy=True, show_progress_bar=False)
