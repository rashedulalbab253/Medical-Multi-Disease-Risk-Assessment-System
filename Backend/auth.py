# auth.py - Simplified version without JWT tokens
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import SessionLocal

def get_db():
    """Database dependency."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()