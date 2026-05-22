from typing import List, Dict, Any


def build_rag_prompt(
    query: str,
    retrieved: List[Dict[str, Any]],
    history: List[Dict[str, str]] = None,
    mitre_context: List[Dict[str, str]] = None,
    attack_intel: List[Dict[str, Any]] = None,
) -> str:
    history = history or []
    mitre_context = mitre_context or []
    attack_intel = attack_intel or []

    context_sections = []
    for item in retrieved:
        context_sections.append(
            f"Title: {item['title']}\nSource: {item['source']}\nCategory: {item['category']}\n{item['content']}"
        )

    history_lines = []
    for turn in history:
        history_lines.append(f"User: {turn.get('user', '')}\nAssistant: {turn.get('assistant', '')}")

    mitre_lines = []
    for item in mitre_context:
        mitre_lines.append(f"MITRE {item.get('mitre_id')}: {item.get('description')}")

    attack_lines = []
    for item in attack_intel:
        attack_lines.append(f"{item.get('title')}: {item.get('summary')}")

    prompt = (
        "You are a cybersecurity analyst assistant. Use retrieved context to produce a precise incident response answer, include mitigation guidance, and cite relevant sources.\n\n"
        f"Retrieved Context:\n{chr(10).join(context_sections)}\n\n"
        f"MITRE Mapping:\n{chr(10).join(mitre_lines)}\n\n"
        f"Attack Intelligence:\n{chr(10).join(attack_lines)}\n\n"
        f"Conversation Query:\n{query}\n\n"
        f"{chr(10).join(history_lines)}\n"
    )

    return prompt


def build_security_prompt(query: str, context: Dict[str, Any]) -> str:
    retrieved = context.get("retrieved", [])
    mitre_context = context.get("mitre_mapping", [])
    attack_intel = context.get("attack_intelligence", [])
    history = context.get("conversation_memory", [])
    return build_rag_prompt(query, retrieved, history, mitre_context, attack_intel)
