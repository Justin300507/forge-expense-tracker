from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.categories import Category
from app.schemas.category import CategoryCreate, CategoryUpdate, Category as CategorySchema
from app.utils.auth import get_current_user

category_router = APIRouter()


@category_router.get("/categories", response_model=List[CategorySchema])
def get_categories(
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    current_user: "User" = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves a paginated list of categories for the authenticated user."""
    from app.models.users import User # Lazy import
    categories = db.query(Category).filter(Category.user_id == current_user.id).offset(offset).limit(limit).all()
    return categories


@category_router.get("/categories/{category_id}", response_model=CategorySchema)
def get_category(
    category_id: int,
    current_user: "User" = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves a specific category by ID for the authenticated user."""
    from app.models.users import User # Lazy import
    category = db.query(Category).filter(Category.id == category_id, Category.user_id == current_user.id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@category_router.post("/categories", response_model=CategorySchema, status_code=201)
def create_category(
    category_in: CategoryCreate,
    current_user: "User" = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Creates a new category for the authenticated user."""
    from app.models.users import User # Lazy import
    db_category = Category(**{k: v for k, v in category_in.dict().items() if k in Category.__table__.columns.keys()}, user_id=current_user.id)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


@category_router.put("/categories/{category_id}", response_model=CategorySchema)
def update_category(
    category_id: int,
    category_in: CategoryUpdate,
    current_user: "User" = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Updates an existing category by ID for the authenticated user."""
    from app.models.users import User # Lazy import
    category = db.query(Category).filter(Category.id == category_id, Category.user_id == current_user.id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    update_data = category_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(category, key, value)

    db.add(category)
    db.commit()
    db.refresh(category)
    return category


@category_router.delete("/categories/{category_id}", status_code=204)
def delete_category(
    category_id: int,
    current_user: "User" = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Deletes a category by ID for the authenticated user."""
    from app.models.users import User # Lazy import
    category = db.query(Category).filter(Category.id == category_id, Category.user_id == current_user.id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    db.delete(category)
    db.commit()
    return