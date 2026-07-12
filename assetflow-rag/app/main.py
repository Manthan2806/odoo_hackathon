from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.chat import router as chat_router


app = FastAPI(
    title="AssetFlow RAG API",
    description="AI Assistant backend for AssetFlow ERP",
    version="1.0.0"
)


# ----------------------------
# CORS Configuration
# ----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js
        "http://127.0.0.1:3000",
        "http://localhost:5173",  # Vite (optional)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----------------------------
# Include Routers
# ----------------------------
app.include_router(chat_router)


# ----------------------------
# Health Check
# ----------------------------
@app.get("/", tags=["Health"])
def root():
    return {
        "status": "running",
        "service": "AssetFlow RAG API",
        "version": "1.0.0"
    }


@app.get("/health", tags=["Health"])
def health():
    return {
        "status": "healthy"
    }
