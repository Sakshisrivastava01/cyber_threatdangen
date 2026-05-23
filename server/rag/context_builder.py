from typing import Dict, List, Any

from .attack_knowledge_base import AttackKnowledgeBase
from .mitre_mapper import MitreMapper
from .memory_manager import ConversationMemory


class ContextBuilder:
    def __init__(self, attack_kb: AttackKnowledgeBase, mitre_mapper: MitreMapper, memory: ConversationMemory):
        self.attack_kb = attack_kb
        self.mitre_mapper = mitre_mapper
        self.memory = memory

    def build(self, query: str, retrieved: List[Dict[str, Any]]) -> Dict[str, Any]:
        attack_context = self.attack_kb.retrieve(query, top_k=3)
        mitre_context = self.mitre_mapper.map_query(query)
        memory_context = self.memory.get_memory()

        return {
            "retrieved": retrieved,
            "attack_intelligence": attack_context,
            "mitre_mapping": mitre_context,
            "conversation_memory": memory_context,
        }
