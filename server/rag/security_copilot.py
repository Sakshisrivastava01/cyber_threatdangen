import asyncio
import json
from typing import Any, AsyncGenerator, Dict, List

from .chain_builder import ChainBuilder
from .langchain_agent import LangChainAgent
from .prompt_templates import build_security_prompt
from .rag_pipeline import rag_pipeline
from .memory_manager import ConversationMemory


class SecurityCopilot:
    def __init__(self):
        self.memory = rag_pipeline.memory if hasattr(rag_pipeline, "memory") else ConversationMemory()
        self.llm_agent = LangChainAgent()
        self.chain_builder = ChainBuilder(self.llm_agent)
        self.chain = self.chain_builder.build_security_chain(memory=self.memory)

    async def get_response(self, query: str, history: List[Dict[str, str]] = None) -> Dict[str, Any]:
        history = history or []
        context = rag_pipeline.retrieve_with_context(query, top_k=3)
        prompt_context = build_security_prompt(query, context)

        if self.chain:
            try:
                result = self.chain({"question": query})
                answer = result.get("answer") or str(result)
                source_docs = [doc.metadata for doc in result.get("source_documents", [])] if result.get("source_documents") else []
                self.memory.add_turn(query, answer)
                return {
                    "response": answer,
                    "confidence": 0.95,
                    "sources": source_docs,
                    "retrieved_context": context,
                }
            except Exception:
                pass

        # Fallback path: return a prompt-driven summary using the existing RAG prompt logic
        response = self._fallback_response(prompt_context, context)
        self.memory.add_turn(query, response["response"])
        return response

    async def get_response_stream(self, query: str, history: List[Dict[str, str]] = None) -> AsyncGenerator[str, None]:
        payload = await self.get_response(query, history)
        response_text = payload["response"]
        confidence = payload["confidence"]
        sources = payload["sources"]

        chunk_size = 20
        idx = 0
        total_len = len(response_text)

        while idx < total_len:
            chunk = response_text[idx : idx + chunk_size]
            idx += chunk_size
            yield json.dumps({
                "token": chunk,
                "done": False,
                "confidence": confidence,
                "sources": sources,
            }) + "\n"
            await asyncio.sleep(0.02)

        yield json.dumps({
            "token": "",
            "done": True,
            "confidence": confidence,
            "sources": sources,
        }) + "\n"

    def _fallback_response(self, prompt: str, context: Dict[str, Any]) -> Dict[str, Any]:
        answer = (
            "DANGEN AI Security Copilot could not invoke the LangChain backend. "
            "Review the environment or use the legacy retrieval path for incident context."
        )
        return {
            "response": answer,
            "confidence": 0.7,
            "sources": context.get("retrieved", []),
            "retrieved_context": context,
        }
