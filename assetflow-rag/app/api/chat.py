from fastapi import APIRouter
from pydantic import BaseModel

from app.services.chat_service import ChatService

router = APIRouter()

chat_service = ChatService()


class ChatRequest(BaseModel):
    question: str


class ChatResponse(BaseModel):
    answer: str
    sources: list[str]


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):

    result = chat_service.ask(request.question)

    return ChatResponse(
        answer=result["answer"],
        sources=result["sources"]
    )