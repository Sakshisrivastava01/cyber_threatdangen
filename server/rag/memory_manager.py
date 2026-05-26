from typing import Dict, List


class ConversationMemory:
    def __init__(self, max_turns: int = 6):
        self.max_turns = max_turns
        self.history: List[Dict[str, str]] = []

    def add_turn(self, user: str, analyst: str) -> None:
        self.history.append({"user": user, "analyst": analyst})
        self.history = self.history[-self.max_turns :]

    def get_memory(self) -> List[Dict[str, str]]:
        return list(self.history)

    def reset(self) -> None:
        self.history = []
