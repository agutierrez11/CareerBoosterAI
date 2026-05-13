from pathlib import Path
from typing import List
from pydantic import Field
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "CareerBoosterAI"
    host: str = "127.0.0.1"
    port: int = 8000
    
    cv_folder: Path = Path(__file__).parent / "uploads"
    
    scrape_do_token: str | None = Field(None, env="SCRAPE_DO_TOKEN")
    deepseek_api_key: str | None = Field(None, env="DEEPSEEK_API_KEY")
    
    # Telegram Config
    telegram_bot_token: str | None = Field(None, env="TELEGRAM_BOT_TOKEN")
    telegram_chat_id: str | None = Field(None, env="TELEGRAM_CHAT_ID")
    
    allow_origins: List[str] = ["http://localhost:5173", "http://localhost:3000", "*"]
    env: str = "development"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
