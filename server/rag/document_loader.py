import os
from typing import List

PACKAGE_DIR = os.path.dirname(__file__)
CORPUS_DIR = os.path.join(PACKAGE_DIR, "cybersecurity_corpus")


def load_cybersecurity_texts(corpus_dir: str = CORPUS_DIR) -> List[str]:
    texts: List[str] = []
    if not os.path.isdir(corpus_dir):
        return texts

    for filename in sorted(os.listdir(corpus_dir)):
        if not filename.lower().endswith(".txt"):
            continue

        path = os.path.join(corpus_dir, filename)
        with open(path, "r", encoding="utf-8") as handle:
            content = handle.read().strip()

        if content:
            texts.append(content)

    return texts
