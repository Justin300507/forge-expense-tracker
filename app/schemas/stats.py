from pydantic import BaseModel, ConfigDict, Field
from typing import Optional

class ConfigDict:
    from_attributes = True

class StatsCreate(BaseModel):
    model_config = {"from_attributes": True}
    title: str = Field(min_length=1)
    description: str = Field(min_length=1)
    spending: float = Field(0)
    budget: float = Field(0)

class StatsUpdate(BaseModel):
    model_config = {"from_attributes": True}
    title: Optional[str] = None
    description: Optional[str] = None
    spending: Optional[float] = None
    budget: Optional[float] = None

class StatsResponse(BaseModel):
    id: int
    title: Optional[str] = None
    description: Optional[str] = None
    spending: Optional[float] = None
    budget: Optional[float] = None
    class Config:
        from_attributes = True


class StatsSummary(BaseModel):
    pass
    model_config = {'from_attributes': True}
