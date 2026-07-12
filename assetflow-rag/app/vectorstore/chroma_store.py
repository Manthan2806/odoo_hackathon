from pathlib import Path

from langchain_chroma import Chroma

from app.embeddings.embedding_model import embedding_model


class VectorStore:

    def __init__(self):

        project_root = Path(__file__).resolve().parents[2]

        persist_directory = project_root / "app" / "chroma_db"

        self.vector_store = Chroma(
            collection_name="company_policies",
            embedding_function=embedding_model,
            persist_directory=str(persist_directory),
        )

    def add_documents(self, documents):
        self.vector_store.add_documents(documents)

    def get_retriever(self, k: int = 4):
        return self.vector_store.as_retriever(
            search_kwargs={"k": k}
        )

    def similarity_search(self, query: str, k: int = 4):
        return self.vector_store.similarity_search(
            query=query,
            k=k
        )

    def get_vector_store(self):
        return self.vector_store