# AI Tools Recommender (FastAPI + Supabase)

## 1) Setup
```bash
cd backend
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your Supabase URL+KEY and optional origins/table
```

## 2) Run
```bash
uvicorn main:app --reload --port 8000
```

Visit: http://localhost:8000/health

## 3) API
- `POST /api/recommend`
```json
{ "query": "ai video editor", "limit": 5 }
```

Response:
```json
{
  "recommendations": [
    { "name": "Runway ML", "description": "...", "category": "Video", "tags": ["video","editor"], "url": "https://..." }
  ]
}
```

## 4) Frontend usage (fetch)
```js
const res = await fetch("http://localhost:8000/api/recommend", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query: searchQuery, limit: 8 }),
});
const data = await res.json();
// data.recommendations -> render cards
```

## Notes
- Ensure your Supabase table is named `ai_tools` (or set SUPABASE_TABLE in .env).
- Required columns: (name text, description text, category text, tags text[] or text, url text).
- Tags can be stored as text[] or comma-separated text; backend normalizes either.
