from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime

from app.database import get_db
from app.models.expenses import Expense
from app.models.budgets import Budget
from app.models.categories import Category
from app.schemas.stats import StatsSummary
from app.utils.auth import get_current_user

stats_router = APIRouter()

@stats_router.get("/stats/summary", response_model=StatsSummary)
def get_summary_stats(
    db: Session = Depends(get_db),
    current_user: "User" = Depends(get_current_user)
):
    current_month = datetime.now().month
    current_year = datetime.now().year

    # Total spending for the current month
    total_spending = (
        db.query(func.sum(Expense.amount))
        .filter(
            Expense.user_id == current_user.id,
            extract('month', Expense.expense_date) == current_month,
            extract('year', Expense.expense_date) == current_year
        )
        .scalar() or 0.0
    )

    # Total budget for the current month
    total_budget = (
        db.query(func.sum(Budget.amount))
        .filter(
            Budget.user_id == current_user.id,
            Budget.month == current_month,
            Budget.year == current_year
        )
        .scalar() or 0.0
    )

    # Number of expenses this month
    num_expenses = (
        db.query(Expense)
        .filter(
            Expense.user_id == current_user.id,
            extract('month', Expense.expense_date) == current_month,
            extract('year', Expense.expense_date) == current_year
        )
        .count()
    )

    # Number of categories with expenses this month
    num_categories_with_expenses = (
        db.query(Category.id)
        .join(Expense, Category.id == Expense.category_id)
        .filter(
            Expense.user_id == current_user.id,
            extract('month', Expense.expense_date) == current_month,
            extract('year', Expense.expense_date) == current_year
        )
        .distinct()
        .count()
    )

    return {
        "total_spending_this_month": total_spending,
        "total_budget_this_month": total_budget,
        "num_expenses_this_month": num_expenses,
        "num_categories_with_expenses_this_month": num_categories_with_expenses,
    }

