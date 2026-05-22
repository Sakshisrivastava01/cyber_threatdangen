"""
DANGEN Enterprise Gateway Configuration Settings
"""
import os
from pydantic import Field
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Dangen AI Cyber Defense Gateway"
    version: str = "4.0"
    debug_mode: bool = Field(default=True, env="DEBUG_MODE")
    websocket_broadcast_interval: int = Field(default=2, env="WS_INTERVAL")
    max_cache_size: int = Field(default=100, env="MAX_CACHE_SIZE")

    class Config:
        env_file = ".env"

settings = Settings()
