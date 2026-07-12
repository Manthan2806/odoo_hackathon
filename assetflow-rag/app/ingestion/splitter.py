from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.core.config import settings


class DocumentSplitter:
    def __init__(self):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.chunk_size,
            chunk_overlap=settings.chunk_overlap,
            separators=[
                "\n\n",
                "\n",
                ". ",
                " ",
                ""
            ]
        )

    def split_documents(self, documents):
        return self.text_splitter.split_documents(documents)