import os
import joblib
import numpy as np

def load_model(disease_name):
    model_path = f"models/{disease_name}/model.pkl"
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