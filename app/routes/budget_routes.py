from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional

from app.database import get_db
from app.models.budgets import Budget
from app.models.categories import Category
from app.schemas.budget import BudgetCreate, BudgetUpdate, Budget as BudgetSchema
from app.utils.auth import get_current_user

budget_router = APIRouter()


@budget_router.get("/budgets", response_model=List[BudgetSchema])
def get_budgets(
    month: Optional[int] = Query(None, ge=1, le=12),
    year: Optional[int] = Query(None, ge=2000),
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    current_user: "User" = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Budget).filter(Budget.user_id == current_user.id)

    if month is not None:
        query = query.filter(Budget.month == month)
    if year is not None:
        query = query.filter(Budget.year == year)

    budgets = query.offset(offset).limit(limit).all()
    return budgets


@budget_router.get("/budgets/{budget_id}", response_model=BudgetSchema)
def get_budget_by_id(
    budget_id: int,
    current_user: "User" = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    budget = (
        db.query(Budget)
        .filter(Budget.id == budget_id, Budget.user_id == current_user.id)
        .first()
    )
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    return budget


@budget_router.post("/budgets", response_model=BudgetSchema, status_code=201)
def create_budget(
    budget_in: BudgetCreate,
    current_user: "User" = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    category = (
        db.query(Category)
        .filter(Category.id == budget_in.category_id, Category.user_id == current_user.id)
        .first()
    )
    if not category:
        raise HTTPException(status_code=404, detail="Category not found for the current user")

    db_budget = Budget(
        user_id=current_user.id,
        category_id=budget_in.category_id,
        amount=budget_in.amount,
        month=budget_in.month,
        year=budget_in.year,
    )
    db.add(db_budget)
    db.commit()
    db.refresh(db_budget)
    return db_budget


@budget_router.put("/budgets/{budget_id}", response_model=BudgetSchema)
def update_budget(
    budget_id: int,
    budget_in: BudgetUpdate,
    current_user: "User" = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    budget = (
        db.query(Budget)
        .filter(Budget.id == budget_id, Budget.user_id == current_user.id)
        .first()
    )
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")

    if budget_in.category_id is not None:
        category = (
            db.query(Category)
            .filter(Category.id == budget_in.category_id, Category.user_id == current_user.id)
            .first()
        )
        if not category:
            raise HTTPException(status_code=404, detail="Category not found for the current user")

    update_data = budget_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(budget, key, value)

    db.commit()
    db.refresh(budget)
    return budget


@budget_router.delete("/budgets/{budget_id}", status_code=204)
def delete_budget(
    budget_id: int,
    current_user: "User" = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    budget = (
        db.query(Budget)
        .filter(Budget.id == budget_id, Budget.user_id == current_user.id)
        .first()
    )
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")

    db.delete(budget)
    db.commit()
    return