import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "MOIL Space Intelligence API"
    environment: str = "development"
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./moil.db")
    jwt_secret: str = "replace_with_a_long_random_secret"
    jwt_algorithm: str = "HS256"
    access_token_minutes: int = 30
    nasa_power_base_url: str = "https://power.larc.nasa.gov/api"
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    from pydantic import model_validator
    @model_validator(mode="after")
    def validate_production_secrets(self) -> 'Settings':
        if self.environment == "production":
            if self.jwt_secret in ("replace_with_a_long_random_secret", "replace_with_a_long_random_secret_moil_defense_grade_2026", ""):
                raise ValueError("JWT_SECRET must be set to a secure custom value in production environment.")
        return self

settings = Settings()
