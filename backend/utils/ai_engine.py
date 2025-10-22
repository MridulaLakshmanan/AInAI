import math
import re
from typing import List, Dict, Any

WORD_RE = re.compile(r"[A-Za-z0-9#\+\-]{2,}")

def tokenize(text: str) -> List[str]:
    if not text:
        return []
    return [t.lower() for t in WORD_RE.findall(text)]

def score_tool(query: str, tool: Dict[str, Any]) -> float:
    """Simple keyword scoring:
    - name match: 3x weight
    - tag match: 2x weight per match
    - description/category match: 1x weight
    - small boost if query tokens appear in URL
    """
    q_tokens = set(tokenize(query))
    if not q_tokens:
        return 0.0

    name_tokens = set(tokenize(tool.get("name", "")))
    desc_tokens = set(tokenize(tool.get("description", "")))
    cat_tokens  = set(tokenize(tool.get("category", "")))
    url_tokens  = set(tokenize(tool.get("url", "")))
    tags_list   = tool.get("tags") or []
    # Ensure tags are tokens
    tag_tokens = set(tokenize(" ".join(tags_list if isinstance(tags_list, list) else [])))

    score = 0.0

    # name has higher weight
    score += 3.0 * len(q_tokens & name_tokens)

    # tags medium weight
    score += 2.0 * len(q_tokens & tag_tokens)

    # description/category lower weight
    score += 1.0 * len(q_tokens & (desc_tokens | cat_tokens))

    # small url boost
    score += 0.5 * len(q_tokens & url_tokens)

    # Phrase bonus if the exact query (lowercased) appears in name or description
    q = " ".join(sorted(q_tokens))
    hay = f"{tool.get('name','')} {tool.get('description','')}".lower()
    if q and q in hay:
        score += 1.5

    return score

def recommend(query: str, tools: List[Dict[str, Any]], limit: int = 5) -> List[Dict[str, Any]]:
    """Return top-N tools sorted by score (desc), tie-broken by name."""
    scored = [(score_tool(query, t), t) for t in tools]
    # Filter zero scores
    scored = [pair for pair in scored if pair[0] > 0]
    scored.sort(key=lambda x: (-x[0], x[1].get("name", "")))
    return [t for _, t in scored[:limit]]
