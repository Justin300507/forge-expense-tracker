from sqlalchemy import Column, Integer, Float, ForeignKey
from app.database import Base


class Budget(Base):
    __tablename__ = "budgets"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    amount = Column(Float, nullable=False)
    month = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)

    @property
    def category(self):
        from sqlalchemy import inspect as _sa_inspect
        _sess = _sa_inspect(self).session
        if _sess is None or self.category_id is None:
            return None
        from app.models.categories import Category
        return _sess.query(Category).get(self.category_id)

    @property
    def category_name(self):
        cat = self.category
        return cat.name if cat is not None else None

    @property
    def user(self):
        from sqlalchemy import inspect as _sa_inspect
        _sess = _sa_inspect(self).session
        if _sess is None or self.user_id is None:
            return None
        from app.models.users import User
        return _sess.query(User).get(self.user_id)

