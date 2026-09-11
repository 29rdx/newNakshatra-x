from pydantic import BaseModel, Field
from typing import Optional

class MineCreate(BaseModel):
    mine_code: str = Field(min_length=3, max_length=40)
    name: str = Field(min_length=3, max_length=120)
    state: str = Field(min_length=2, max_length=80)
    latitude: float = Field(ge=6, le=38)
    longitude: float = Field(ge=68, le=98)
    zone: Optional[str] = "Central India"
    target_tonnes: Optional[float] = 12000.0

class MineResponse(MineCreate):
    id: int

    class Config:
        from_attributes = True
