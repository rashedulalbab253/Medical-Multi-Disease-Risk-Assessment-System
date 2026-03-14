import pickle
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Initialize FastAPI app
app = FastAPI(title="Medical Disease Prediction API")

# Add CORS middleware to allow requests from the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the request model with Pydantic for validation
class PredictionRequest(BaseModel):
    age: int = Field(..., ge=0, le=120, description="Patient's age in years")
    blood_pressure: int = Field(..., ge=70, le=200, description="Systolic blood pressure")
    cholesterol: int = Field(..., ge=100, le=300, description="Total cholesterol level")
    glucose: int = Field(..., ge=50, le=200, description="Fasting blood glucose level")

# Define the response model
class PredictionResponse(BaseModel):
    disease: str
    confidence: float

# Create a dummy ML model (for demonstration purposes)
def create_dummy_model():
    """Create and save a dummy scikit-learn model for demonstration."""
    from sklearn.ensemble import RandomForestClassifier

    # Create a simple dummy model
    model = RandomForestClassifier(n_estimators=10, random_state=42)

    # Dummy training data
    X_train = np.random.rand(100, 4)
    y_train = np.random.choice(["Diabetes", "Heart Disease", "Healthy"], size=100)

    # Fit the model
    model.fit(X_train, y_train)

    # Save the model
    with open("dummy_model.pkl", "wb") as f:
        pickle.dump(model, f)

    return model

# Load the ML model
try:
    with open("dummy_model.pkl", "rb") as f:
        model = pickle.load(f)
    print("Model loaded successfully!")
except FileNotFoundError:
    print("Model not found, creating a dummy model...")
    model = create_dummy_model()
    print("Dummy model created and saved!")

@app.get("/")
def read_root():
    return {"message": "Medical Disease Prediction API is running"}

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    try:
        # Convert input data to the format expected by the model
        input_features = np.array([[
            request.age,
            request.blood_pressure,
            request.cholesterol,
            request.glucose
        ]])

        # Get prediction from model
        disease = model.predict(input_features)[0]

        # Get confidence scores (probabilities)
        probabilities = model.predict_proba(input_features)[0]
        confidence = float(max(probabilities))

        # Return prediction and confidence
        return PredictionResponse(
            disease=disease,
            confidence=round(confidence, 2)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)