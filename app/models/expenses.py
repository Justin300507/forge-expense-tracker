from app.database import Base
from sqlalchemy import Column, Integer, ForeignKey, REAL, Text, Date, DateTime, func
from sqlalchemy.sql import func
class Expense(Base):
    __tablename__ = 'expenses'
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    category_id = Column(Integer, ForeignKey('categories.id'))
    amount = Column(REAL, nullable=False)
    description = Column(Text)
    date = Column(Date, nullable=False)
    expense_date = Column(DateTime, server_default=func.now(), nullable=False)

    @property
    def category(self):
        return []

    @property
    def user(self):
        return []
