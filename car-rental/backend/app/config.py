from typing import List

from pydantic import Field, AliasChoices
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    MONGO_URI: str = Field(
        default="mongodb+srv://username:password@cluster0.mongodb.net/car_rental?retryWrites=true&w=majority",
        validation_alias=AliasChoices("MONGODB_URL", "MONGO_URI"),
    )
    DB_NAME: str = "car_rental"
    JWT_SECRET: str = Field(
        default="super-secret-change-in-production",
        validation_alias=AliasChoices("SECRET_KEY", "JWT_SECRET"),
    )
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    REDIS_URL: str = Field(default="redis://your-redis-host:6379/0", validation_alias=AliasChoices("REDIS_URL"))
    FRONTEND_URL: str = Field(default="", validation_alias=AliasChoices("FRONTEND_URL"))
    CORS_ORIGINS: str = Field(default="https://your-vercel-app.vercel.app", validation_alias=AliasChoices("CORS_ORIGINS"))
    UPLOAD_DIR: str = "./uploads"
    MAX_IMAGE_SIZE_MB: int = 5
    HOLD_TTL_MINUTES: int = 10
    SENTRY_DSN: str = ""
    TAX_PERCENTAGE: float = 18.0

    SERVICE_FEE_PERCENTAGE: float = 5.0
    FIRST_TIME_DISCOUNT_PERCENT: float = 10.0
    REFERRAL_DISCOUNT_PERCENT: float = 5.0
    PLATFORM_COMMISSION_PERCENT: float = 15.0
    SURGE_MULTIPLIER: float = 1.5  # Surge pricing multiplier

    @property
    def cors_origins_list(self) -> List[str]:
        if self.FRONTEND_URL.strip():
            return [self.FRONTEND_URL.strip().rstrip("/")]
        return [o.strip() for o in self.CORS_ORIGINS.split(",")]


settings = Settings()

