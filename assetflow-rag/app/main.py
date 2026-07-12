from fastapi import FastAPI
from app.api.chat import router

app = FastAPI(
    title="AssetFlow RAG API",
    version="1.0.0"
)

app.include_router(router)