from typing import Any, Optional

from .langchain_agent import LangChainAgent
from .memory_manager import ConversationMemory


class ChainBuilder:
    def __init__(self, llm_agent: LangChainAgent):
        self.llm_agent = llm_agent

    def build_security_chain(self, memory: Optional[ConversationMemory] = None) -> Optional[Any]:
        retriever = self.llm_agent.build_retriever()
        return self.llm_agent.build_chain(retriever, memory=memory)
