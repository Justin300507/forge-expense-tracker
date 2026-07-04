from datetime import datetime
from typing import Optional
from datetime import date
from pydantic import BaseModel, Field, ConfigDict


class BudgetBase(BaseModel):
    model_config = {"from_attributes": True}
    category_id: int
    amount: float = Field(ge=0)
    month: int = Field(ge=1, le=12)
    year: int = Field(ge=2000)


class BudgetCreate(BudgetBase):
    pass


class BudgetUpdate(BaseModel):
    model_config = {"from_attributes": True}
    category_id: Optional[int] = None
    amount: Optional[float] = Field(None, ge=0)
    month: Optional[int] = Field(None, ge=1, le=12)
    year: Optional[int] = Field(None, ge=2000)


class BudgetResponse(BudgetBase):
    id: int
    user_id: Optional[int] = None
    category_name: Optional[str] = None
    created_at: Optional[date] = None
    updated_at: Optional[date] = None

    model_config = ConfigDict(from_attributes=True)


Budget = BudgetResponse
