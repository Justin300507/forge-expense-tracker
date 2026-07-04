from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base

# Import all models to ensure they are registered with SQLAlchemy Base.metadata
from app.models.categories import *  # noqa: F401
from app.models.budgets import *  # noqa: F401
from app.models.expenses import *  # noqa: F401
from app.models.users import *  # noqa: F401

# Import routers
from app.routes.user_routes import user_router
from app.routes.expense_routes import expense_router
from app.routes.stats_routes import stats_router
from app.routes.auth_routes import auth_router
from app.routes.category_routes import category_router
from app.routes.budget_routes import budget_router
from app.routes.seed_routes import seed_router

app = FastAPI()

# Create database tables
Base.metadata.create_all(bind=engine)

# CORS (required for frontend access)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health endpoint (required for deployment health checks)
@app.get("/health")
def health():
    return {"status": "ok"}

# Include routers
app.include_router(user_router)
app.include_router(expense_router)
app.include_router(stats_router)
app.include_router(auth_router)
app.include_router(category_router)
app.include_router(budget_router)
app.include_router(seed_router)
