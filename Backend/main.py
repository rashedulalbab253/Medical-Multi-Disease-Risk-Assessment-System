from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from database import SessionLocal, engine
from models import Base, User
from utils import hash_password, verify_password
from auth import get_db
from schemas import (
    DiabetesInput, StrokeInput, ParkinsonsInput, ThyroidInput,
    DepressionInput, HepatitisInput, HeartInput, KidneyInput
)
from predictor import DiseasePredictor

# External libs
import fitz
from groq import Groq

# Initialize tables
Base.metadata.create_all(bind=engine)

# Initialize app
app = FastAPI(title="FastAPI Application")

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for Vercel preview deployments
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Groq AI
import os
API_KEY = os.getenv("GROQ_API_KEY", "")
client = Groq(api_key=API_KEY)

# Pydantic models
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr

    class Config:
        from_attributes = True

# User signup
@app.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(User).filter(User.username == user_data.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")

    user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hash_password(user_data.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "User created successfully"}

# User login
@app.post("/login")
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    return {"username": user.username, "email": user.email, "id": user.id}

# Disease prediction routing
disease_models = {
    "diabetes": DiabetesInput,
    "stroke": StrokeInput,
    "parkinsons": ParkinsonsInput,
    "thyroid": ThyroidInput,
    "depression": DepressionInput,
    "hepatitis": HepatitisInput,
    "heart": HeartInput,
    "kidney": KidneyInput,
}

@app.post("/predict/{disease_name}")
async def predict_disease(disease_name: str, input_data: dict):
    if disease_name not in disease_models:
        raise HTTPException(status_code=404, detail="Disease model not found")
    try:
        model_instance = disease_models[disease_name](**input_data)
        predictor = DiseasePredictor(disease_name, type(model_instance))
        return predictor.predict(model_instance)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid input data: {e}")

# PDF AI analysis endpoint
@app.post("/analyze-pdf")
async def analyze_pdf(file: UploadFile = File(...)):
    try:
        pdf_bytes = await file.read()
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        text = "".join(page.get_text() for page in doc)

        prompt = (
            "You are a medical expert AI. Analyze the following medical document in depth. "
            "Extract diagnoses, medications, possible conditions, patient history, future risk factors, "
            "suggested tests, and anything useful from a doctor’s perspective.\n\n"
            f"Medical Document:\n{text}"
        )
        response = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.3-70b-versatile",
        )
        return {"analysis": response.choices[0].message.content}

    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": f"PDF analysis failed: {str(e)}"})

# Health check
@app.get("/")
def root():
    return {"message": "FastAPI is running"}

# Uvicorn entry
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
    uvicorn.run(app, host="0.0.0.0", port=8000)