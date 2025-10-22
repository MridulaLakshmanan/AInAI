from pydantic import BaseModel, Field
from typing import List, Optional

class RecommendRequest(BaseModel):
    query: str = Field(..., description="Free-form user query text")
    limit: int = Field(5, ge=1, le=50, description="Max number of results to return")

class Tool(BaseModel):
    name: str
    description: Optional[str] = ""
    category: Optional[str] = ""
    tags: Optional[List[str]] = None
    url: Optional[str] = None

class RecommendResponse(BaseModel):
    recommendations: List[Tool]
