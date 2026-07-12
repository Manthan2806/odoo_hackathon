from pathlib import Path

from langchain_community.document_loaders import PyPDFLoader


class DocumentLoader:
    def __init__(self):
        # Project Root
        self.project_root = Path(__file__).resolve().parents[2]

        # app/uploads
        self.upload_dir = self.project_root / "app" / "uploads"

    def load_documents(self):
        documents = []

        if not self.upload_dir.exists():
            raise FileNotFoundError(
                f"Uploads directory not found:\n{self.upload_dir}"
            )

        pdf_files = list(self.upload_dir.glob("*.pdf"))

        print(f"Found {len(pdf_files)} PDF(s).\n")

        for pdf in pdf_files:
            print(f"Loading: {pdf.name}")

            loader = PyPDFLoader(str(pdf))
            documents.extend(loader.load())

        return documents


if __name__ == "__main__":
    loader = DocumentLoader()

    docs = loader.load_documents()

    print(f"\nLoaded {len(docs)} pages.")

    if docs:
        print("\nFirst Page:\n")
        print(docs[0].page_content[:500])

        print("\nMetadata:")
        print(docs[0].metadata)

import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)