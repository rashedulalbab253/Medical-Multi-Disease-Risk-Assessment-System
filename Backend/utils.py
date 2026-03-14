# utils.py
from passlib.context import CryptContext
import hashlib
import base64

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def _pre_hash(password: str) -> str:
    """Hash password with SHA-256 before bcrypt to bypass 72 character limit"""
    return base64.b64encode(hashlib.sha256(password.encode('utf-8')).digest()).decode('utf-8')

def hash_password(password: str) -> str:
    """Hash a password for storing."""
    return pwd_context.hash(_pre_hash(password))

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a stored password against a provided password."""
    return pwd_context.verify(_pre_hash(plain_password), hashed_password)