from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.database import Base


class User(Base):
    __tablename__ = "users"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    display_name = Column(String, server_default='', nullable=False)
    hashed_password = Column(String, server_default='', nullable=False)

    @property
    def budgets(self):
        from sqlalchemy import inspect as _sa_inspect
        _sess = _sa_inspect(self).session
        if _sess is None:
            return []
        from app.models.budgets import Budget
        return _sess.query(Budget).filter(Budget.user_id == self.id).all()

    @property
    def expenses(self):
        from sqlalchemy import inspect as _sa_inspect
        _sess = _sa_inspect(self).session
        if _sess is None:
            return []
        from app.models.expenses import Expense
        return _sess.query(Expense).filter(Expense.user_id == self.id).all()

    @property
    def categories(self):
        from sqlalchemy import inspect as _sa_inspect
        _sess = _sa_inspect(self).session
        if _sess is None:
            return []
        from app.models.categories import Category
        return _sess.query(Category).filter(Category.user_id == self.id).all()

    # Relationships

    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}')>"
