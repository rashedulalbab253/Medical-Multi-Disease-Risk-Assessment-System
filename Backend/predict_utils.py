import os
import joblib
import numpy as np

# Map API disease names to actual model folder names
DISEASE_FOLDER_MAP = {
    "diabetes": "diabetes",
    "stroke": "Stroke",
    "parkinsons": "Parkinsons",
    "thyroid": "Thyroid",
    "depression": "Depression",
    "hepatitis": "Hepatits",  # Note: original folder has typo
    "heart": "Heart",
    "kidney": "Kidney",
}

def load_model(disease_name):
    folder = DISEASE_FOLDER_MAP.get(disease_name, disease_name)
    model_path = f"models/{folder}/model.pkl"
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"No model found for {disease_name}")
    
    # Use joblib to load the model
    model = joblib.load(model_path)
    return model

def make_prediction(model, features):
    # Convert features to numpy array and reshape for prediction
    features_array = np.array(features).reshape(1, -1)
    
    # Make prediction using the model
    prediction = model.predict(features_array)[0]
    return prediction