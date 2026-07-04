# Architecture — Forge Expense Tracker

## ER Diagram

```
┌─────────────────────┐
│ Budget              │
├─────────────────────┤
│ id         Integer ││
│ user_id    Integer ││
│ category_id Integer ││
│ amount     Float   ││
│ month      Integer ││
│ year       Integer ││
└─────────────────────┘

┌─────────────────────┐
│ Category            │
├─────────────────────┤
│ id         Integer ││
│ user_id    Integer ││
│ name       String(255│
│ created_at DateTime││
│ updated_at DateTime││
└─────────────────────┘

┌─────────────────────┐
│ Expense             │
├─────────────────────┤
│ id         Integer ││
│ user_id    Integer ││
│ category_id Integer ││
│ amount     REAL    ││
│ description Text    ││
│ date       Date    ││
│ expense_date DateTime│
└─────────────────────┘

┌─────────────────────┐
│ User                │
├─────────────────────┤
│ id         Integer ││
│ email      String(255│
│ password_hash String(│
│ created_at DateTime││
│ updated_at DateTime││
│ display_name String  │
│ hashed_password Strin│
└─────────────────────┘

```

## Backend Architecture

```
FastAPI Application
├── Routing Layer (app/routes/)     → HTTP request handling
├── Service Layer (app/services/)   → Business logic
├── Model Layer (app/models/)       → Database ORM (SQLAlchemy)
├── Schema Layer (app/schemas/)     → Validation (Pydantic v2)
└── Database (app/database.py)      → Session management (SQLite)
```

## Design Patterns

- **Repository pattern**: services own DB queries, routes own HTTP logic
- **Dependency injection**: `get_db` session injected via FastAPI `Depends()`
- **Schema separation**: ORM models never exposed directly; Pydantic schemas serialize responses
- **JWT auth**: Bearer tokens validated via `oauth2_scheme` dependency
