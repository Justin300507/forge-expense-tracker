from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class CategoryBase(BaseModel):
    model_config = {"from_attributes": True}
    name: str = Field(min_length=1)
    description: Optional[str] = None


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(CategoryBase):
    name: Optional[str] = Field(None, min_length=1)


class CategoryResponse(CategoryBase):
    id: int
    user_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)


class Category(CategoryResponse):
    # This class is added to resolve the 'Missing symbol Category' error.
    # It's often used as a general representation of a category with its ID.
    pass