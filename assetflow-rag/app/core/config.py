from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[2]

print(BASE_DIR)
print(BASE_DIR / ".env")
print((BASE_DIR / ".env").exists())


class Settings(BaseSettings):
    google_api_key: str
    # database_url: str

    embedding_model: str
    llm_model: str

    chunk_size: int
    chunk_overlap: int

    upload_dir: str

    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        extra="ignore",
    )


settings = Settings()