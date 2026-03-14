# predictor.py
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from predict_utils import load_model, make_prediction
from pydantic import BaseModel
from typing import Type

class DiseasePredictor:
    def __init__(self, disease_name: str, input_model: Type[BaseModel]):
        self.disease_name = disease_name
        self.input_model = input_model
        try:
            self.model = load_model(disease_name)
        except FileNotFoundError as e:
            raise HTTPException(status_code=404, detail=str(e))

    def predict(self, input_data: BaseModel):
        try:
            features = list(input_data.dict().values())
            prediction = make_prediction(self.model, features)
            return JSONResponse(content={
                "disease": self.disease_name,
                "prediction": int(prediction),
                "risk_status": "High Risk" if prediction == 1 else "Low Risk"
            })
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
