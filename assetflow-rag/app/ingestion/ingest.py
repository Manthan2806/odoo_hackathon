from app.ingestion.loader import DocumentLoader
from app.ingestion.splitter import DocumentSplitter
from app.vectorstore.chroma_store import VectorStore


def ingest():

    loader = DocumentLoader()

    documents = loader.load_documents()

    splitter = DocumentSplitter()

    chunks = splitter.split_documents(documents)

    print(f"Loaded {len(documents)} pages")
    print(f"Generated {len(chunks)} chunks")

    vector_store = VectorStore()
    vector_store.get_vector_store().reset_collection()

    vector_store.add_documents(chunks)

    print("Documents stored successfully!")


if __name__ == "__main__":
    ingest()

import logging

logging.basicConfig(level=logging.INFO)

logger = logging.getLogger(__name__)