
from app.prompts.qa_prompt import qa_prompt
from app.retrievers.retriever import PolicyRetriever
from app.services.llm import llm
from pathlib import Path


class ChatService:

    def __init__(self):

        self.retriever = PolicyRetriever()

        self.llm = llm

    def ask(self, question: str):

        question = question.strip()

        if len(question) < 3:
            return {
                "answer": "Please enter a valid question.",
                "sources": []
            }

        documents = self.retriever.retrieve(question)

        context = ""

        for doc in documents:

            source = Path(doc.metadata["source"]).name

            context += f"""
        Source: {source}

        {doc.page_content}

        ------------------------------------
        """


        sources = []

        for doc in documents[:2]:      # Return only top 2
            source = Path(doc.metadata["source"]).name

            if source not in sources:
                sources.append(source)

        prompt = qa_prompt.invoke(
            {
                "context": context,
                "question": question,
            }
        )
        print("\n========== CONTEXT ==========\n")
        print(context)
        print("\n=============================\n")

        response = self.llm.invoke(prompt)

        if isinstance(response.content, list):
            answer = ""

            for block in response.content:
                if isinstance(block, dict):
                    if block.get("type") == "text":
                        answer += block.get("text", "")

        else:
            answer = response.content

        return {
            "answer": answer,
            "sources": sources
        }
    
import logging

logging.basicConfig(level=logging.INFO)

logger = logging.getLogger(__name__)