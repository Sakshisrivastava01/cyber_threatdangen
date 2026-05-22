import os
from typing import Any, Dict, List, Optional

from .retrieval_engine import CyberRetrievalEngine


class LangChainAgent:
    def __init__(self):
        self.model_name = os.environ.get("HF_MODEL_ID", "gpt-4")
        self.hf_token = os.environ.get("HF_TOKEN") or os.environ.get("HUGGINGFACE_API_KEY")
        self.llm = self._load_llm()
        self.engine = CyberRetrievalEngine()

    def _load_llm(self) -> Optional[Any]:
        if not self.hf_token:
            return None
        try:
            from langchain.llms import HuggingFaceHub

            return HuggingFaceHub(
                repo_id=os.environ.get("HF_MODEL_ID", "mistralai/Mistral-7B-Instruct-v0.2"),
                huggingfacehub_api_token=self.hf_token,
                temperature=0.2,
                model_kwargs={"max_new_tokens": 512},
            )
        except Exception:
            return None

    def has_llm(self) -> bool:
        return self.llm is not None

    def build_retriever(self, k: int = 4) -> Optional[Any]:
        if not self.has_llm():
            return None

        try:
            from langchain.schema import Document

            class CyberLangchainRetriever:
                def __init__(self, engine: CyberRetrievalEngine, k: int = 4):
                    self.engine = engine
                    self.k = k

                def get_relevant_documents(self, query: str) -> List[Document]:
                    results = self.engine.retrieve(query, k=self.k)
                    documents: List[Document] = []
                    for item in results:
                        metadata = item.get("metadata", {})
                        metadata.update({"title": item.get("title"), "source": item.get("source")})
                        documents.append(Document(page_content=item.get("content", ""), metadata=metadata))
                    return documents

            return CyberLangchainRetriever(self.engine, k=k)
        except Exception:
            return None

    def build_chain(self, retriever: Any, memory: Optional[Any] = None) -> Optional[Any]:
        if not self.has_llm() or retriever is None:
            return None
        try:
            from langchain.chains import ConversationalRetrievalChain
            from langchain.memory import ConversationBufferMemory

            memory_obj = memory if memory is not None else ConversationBufferMemory(memory_key="chat_history", return_messages=True)
            return ConversationalRetrievalChain.from_llm(self.llm, retriever=retriever, memory=memory_obj, return_source_documents=True)
        except Exception:
            return None
