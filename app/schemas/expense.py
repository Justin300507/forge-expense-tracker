from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import date

class ExpenseBase(BaseModel):
    model_config = {"from_attributes": True}
    amount: float = Field(..., gt=0)
    category: str = Field(min_length=1)
    description: Optional[str] = None
    expense_date: date

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseUpdate(ExpenseBase):
    amount: Optional[float] = Field(None, gt=0)
    category: Optional[str] = Field(None, min_length=1)
    expense_date: Optional[date] = None

class ExpenseResponse(ExpenseBase):
    id: int
    user_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)
