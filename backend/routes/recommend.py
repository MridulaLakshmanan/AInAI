from fastapi import APIRouter, HTTPException
from typing import List
from ..models.schemas import RecommendRequest, RecommendResponse, Tool
from ..utils.supabase_client import fetch_all_tools
from ..utils.ai_engine import recommend as recommend_engine

router = APIRouter(prefix="/api", tags=["recommend"])

@router.post("/recommend", response_model=RecommendResponse)
def recommend(req: RecommendRequest):
    try:
        tools = fetch_all_tools()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch tools: {e}")
    top = recommend_engine(req.query, tools, req.limit)
    # Normalize tags to list[str]
    norm = []
    for t in top:
        tags = t.get("tags") or []
        if isinstance(tags, str):
            # If stored as comma-separated text in DB
            tags = [s.strip() for s in tags.split(",") if s.strip()]
        norm.append(Tool(
            name=t.get("name",""),
            description=t.get("description",""),
            category=t.get("category",""),
            tags=tags,
            url=t.get("url")
        ))
    return RecommendResponse(recommendations=norm)
