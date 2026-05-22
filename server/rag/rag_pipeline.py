from .retrieval_engine import CyberRetrievalEngine
from .attack_knowledge_base import AttackKnowledgeBase
from .context_builder import ContextBuilder
from .memory_manager import ConversationMemory
from .mitre_mapper import MitreMapper


class CyberCopilotRAG:
    """Modular RAG pipeline for DANGEN AI with memory, MITRE, and attack context."""

    def __init__(self):
        self.engine = CyberRetrievalEngine()
        self.memory = ConversationMemory()
        self.attack_kb = AttackKnowledgeBase()
        self.mitre_mapper = MitreMapper()
        self.context_builder = ContextBuilder(self.attack_kb, self.mitre_mapper, self.memory)
        self.engine.initialize()

    def retrieve(self, query: str, top_k: int = 3):
        return self.engine.retrieve(query, k=top_k)

    def retrieve_with_context(self, query: str, top_k: int = 3):
        retrieved = self.retrieve(query, top_k)
        return self.context_builder.build(query, retrieved)

rag_pipeline = CyberCopilotRAG()
