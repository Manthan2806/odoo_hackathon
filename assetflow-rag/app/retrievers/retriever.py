from app.vectorstore.chroma_store import VectorStore


class PolicyRetriever:

    def __init__(self):
        self.vector_store = VectorStore()

    def get_retriever(self, k: int = 4):
        return self.vector_store.get_vector_store().as_retriever(
            search_type="similarity",
            search_kwargs={
                "k": k
            }
        )

    def retrieve(self, query: str, k: int = 3):
        retriever = self.get_retriever(k)
        return retriever.invoke(query)