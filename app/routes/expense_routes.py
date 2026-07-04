from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, Field
from typing import Optional, Any
from datetime import date
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.expenses import Expense
from app.models.users import User
from app.utils.auth import get_current_user, oauth2_scheme
from app.schemas.expense import ExpenseBase, ExpenseCreate, ExpenseUpdate

expense_router = APIRouter()

@expense_router.get("/expenses")
def get_expenses(limit: int = Query(50, ge=1, le=500), offset: int = Query(0, ge=0), db: Session = Depends(get_db), current_user: Any = Depends(get_current_user)):
    expenses = db.query(Expense).filter(Expense.user_id == current_user.id).offset(offset).limit(limit).all()
    return expenses

@expense_router.get("/expenses/{expense_id}")
def get_expense(expense_id: int, db: Session = Depends(get_db), current_user: Any = Depends(get_current_user)):
    expense = db.query(Expense).filter(Expense.id == expense_id).filter(Expense.user_id == current_user.id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Not found")
    return expense

@expense_router.post("/expenses")
def create_expense(expense_in: ExpenseCreate, db: Session = Depends(get_db), current_user: Any = Depends(get_current_user)):
    # Ensure 'date' is explicitly set, as it's a NOT NULL column without a server_default in the model
    # If expense_in.date is None, use a default value, e.g., today's date
    expense_data = expense_in.model_dump()
    if expense_data.get('date') is None:
        expense_data['date'] = date.today()

    db_expense = Expense(**{k: v for k, v in expense_data.items() if k in Expense.__table__.columns.keys()})
    db_expense.user_id = current_user.id
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

@expense_router.put("/expenses/{expense_id}")
def update_expense(expense_id: int, expense_in: ExpenseUpdate, db: Session = Depends(get_db), current_user: Any = Depends(get_current_user)):
    expense = db.query(Expense).filter(Expense.id == expense_id).filter(Expense.user_id == current_user.id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Not found")
    for key, value in expense_in.model_dump(exclude_unset=True).items():
        setattr(expense, key, value)
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense

@expense_router.delete("/expenses/{expense_id}")
def delete_expense(expense_id: int, db: Session = Depends(get_db), current_user: Any = Depends(get_current_user)):
    expense = db.query(Expense).filter(Expense.id == expense_id).filter(Expense.user_id == current_user.id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(expense)
    db.commit()
    return {"message": "Expense deleted"}
