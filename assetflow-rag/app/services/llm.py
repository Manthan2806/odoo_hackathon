from langchain_google_genai import ChatGoogleGenerativeAI

from app.core.config import settings


llm = ChatGoogleGenerativeAI(
    model=settings.llm_model,
    google_api_key=settings.google_api_key,
    temperature=0,
)