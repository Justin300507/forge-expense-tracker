from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class UserResponse(BaseModel):
    id: Optional[int] = None
    email: Optional[str] = None
    password_hash: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    model_config = {'from_attributes': True}


class UserUpdate(BaseModel):
    id: Optional[int] = None
    email: Optional[str] = None
    password_hash: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    model_config = {'from_attributes': True}

