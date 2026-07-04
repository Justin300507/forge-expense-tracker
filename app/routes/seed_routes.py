from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.database import get_db
from app.models.users import User
from app.models.categories import Category
from app.models.expenses import Expense
from app.models.budgets import Budget
from app.utils.auth import get_password_hash
from datetime import date

seed_router = APIRouter()

@seed_router.post("/seed", summary="Populates the database with realistic demo data")
def seed_data(db: Session = Depends(get_db)):
    seeded_count = {
        "users": 0,
        "categories": 0,
        "expenses": 0,
        "budgets": 0
    }

    # Seed Users
    users_to_seed = [
        {"email": "john.doe@example.com", "display_name": "John Doe", "password": "password123"},
        {"email": "jane.smith@example.com", "display_name": "Jane Smith", "password": "securepass"},
        {"email": "alex.williams@example.com", "display_name": "Alex Williams", "password": "mypassword"},
        {"email": "sarah.jones@example.com", "display_name": "Sarah Jones", "password": "test1234"},
        {"email": "michael.brown@example.com", "display_name": "Michael Brown", "password": "strongpass"},
    ]

    for user_data in users_to_seed:
        try:
            if not db.query(User).filter(User.email == user_data["email"]).first():
                hashed_password = get_password_hash(user_data["password"])
                user = User(email=user_data["email"], display_name=user_data["display_name"], hashed_password=hashed_password)
                db.add(user)
                db.commit()
                db.refresh(user)
                seeded_count["users"] += 1
        except IntegrityError:
            db.rollback()
            # User already exists, skip

    users = db.query(User).all()
    if not users: # If no users were seeded or found, we can't seed other data
        return {"message": "No users available to associate with other seeded data.", **seeded_count}

    # Seed Categories
    categories_to_seed = [
        {"name": "Food", "description": "Groceries, restaurants, coffee"},
        {"name": "Transportation", "description": "Fuel, public transport, car maintenance"},
        {"name": "Housing", "description": "Rent, mortgage, utilities"},
        {"name": "Entertainment", "description": "Movies, concerts, hobbies"},
        {"name": "Shopping", "description": "Clothes, electronics, personal care"},
        {"name": "Utilities", "description": "Electricity, water, internet"},
        {"name": "Health", "description": "Doctor visits, gym, medicine"},
    ]

    for category_data in categories_to_seed:
        try:
            if not db.query(Category).filter(Category.name == category_data["name"]).first():
                category = Category(name=category_data["name"])
                db.add(category)
                db.commit()
                db.refresh(category)
                seeded_count["categories"] += 1
        except IntegrityError:
            db.rollback()
            # Category already exists, skip

    categories = db.query(Category).all()
    if not categories: # If no categories were seeded or found, we can't seed expenses/budgets
        return {"message": "No categories available to associate with other seeded data.", **seeded_count}

    # Seed Expenses
    expenses_to_seed = [
        {"user_email": "john.doe@example.com", "category_name": "Food", "amount": 89.40, "description": "Whole Foods", "expense_date": date(2023, 10, 26)},
        {"user_email": "john.doe@example.com", "category_name": "Entertainment", "amount": 15.99, "description": "Netflix subscription", "expense_date": date(2023, 10, 20)},
        {"user_email": "john.doe@example.com", "category_name": "Housing", "amount": 1200.00, "description": "Monthly Rent", "expense_date": date(2023, 10, 1)},
        {"user_email": "jane.smith@example.com", "category_name": "Transportation", "amount": 45.50, "description": "Gas refill", "expense_date": date(2023, 10, 25)},
        {"user_email": "jane.smith@example.com", "category_name": "Shopping", "amount": 75.00, "description": "New shoes", "expense_date": date(2023, 10, 15)},
        {"user_email": "alex.williams@example.com", "category_name": "Food", "amount": 30.25, "description": "Dinner with friends", "expense_date": date(2023, 10, 27)},
        {"user_email": "alex.williams@example.com", "category_name": "Utilities", "amount": 60.00, "description": "Electricity bill", "expense_date": date(2023, 10, 10)},
        {"user_email": "sarah.jones@example.com", "category_name": "Health", "amount": 120.00, "description": "Gym membership", "expense_date": date(2023, 10, 5)},
        {"user_email": "michael.brown@example.com", "category_name": "Shopping", "amount": 200.00, "description": "New phone accessory", "expense_date": date(2023, 10, 22)},
        {"user_email": "john.doe@example.com", "category_name": "Food", "amount": 25.00, "description": "Lunch out", "expense_date": date(2023, 10, 28)},
    ]

    for expense_data in expenses_to_seed:
        user = db.query(User).filter(User.email == expense_data["user_email"]).first()
        category = db.query(Category).filter(Category.name == expense_data["category_name"]).first()

        if user and category:
            # Check if an identical expense already exists to prevent duplicates on repeat calls
            existing_expense = db.query(Expense).filter(
                Expense.user_id == user.id,
                Expense.category_id == category.id,
                Expense.amount == expense_data["amount"],
                Expense.description == expense_data["description"],
                Expense.expense_date == expense_data["expense_date"]
            ).first()

            if not existing_expense:
                expense = Expense(
                    user_id=user.id,
                    category_id=category.id,
                    amount=expense_data["amount"],
                    description=expense_data["description"],
                    expense_date=expense_data["expense_date"]
                )
                db.add(expense)
                db.commit()
                db.refresh(expense)
                seeded_count["expenses"] += 1

    # Seed Budgets
    budgets_to_seed = [
        {"user_email": "john.doe@example.com", "category_name": "Food", "amount": 500.00, "month": 10, "year": 2023},
        {"user_email": "john.doe@example.com", "category_name": "Entertainment", "amount": 100.00, "month": 10, "year": 2023},
        {"user_email": "jane.smith@example.com", "category_name": "Transportation", "amount": 200.00, "month": 10, "year": 2023},
        {"user_email": "alex.williams@example.com", "category_name": "Housing", "amount": 1500.00, "month": 10, "year": 2023},
        {"user_email": "sarah.jones@example.com", "category_name": "Health", "amount": 150.00, "month": 10, "year": 2023},
    ]

    for budget_data in budgets_to_seed:
        user = db.query(User).filter(User.email == budget_data["user_email"]).first()
        category = db.query(Category).filter(Category.name == budget_data["category_name"]).first()

        if user and category:
            # Check if an identical budget already exists
            existing_budget = db.query(Budget).filter(
                Budget.user_id == user.id,
                Budget.category_id == category.id,
                Budget.month == budget_data["month"],
                Budget.year == budget_data["year"]
            ).first()

            if not existing_budget:
                budget = Budget(
                    user_id=user.id,
                    category_id=category.id,
                    amount=budget_data["amount"],
                    month=budget_data["month"],
                    year=budget_data["year"]
                )
                db.add(budget)
                db.commit()
                db.refresh(budget)
                seeded_count["budgets"] += 1

    return {"message": "Database seeded successfully!", **seeded_count}
