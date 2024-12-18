from flask import Flask, request, jsonify
import pickle
import numpy as np

app = Flask(__name__)

# Load the trained model
model_path = "model/random_forest_model.pkl"
with open(model_path, "rb") as file:
    model = pickle.load(file)

# Define feature order
FEATURE_COLUMNS = [
    "anxiety_level", "depression", "headache", "future_career_concerns",
    "bullying", "self_esteem", "sleep_quality", "safety", "basic_needs", "academic_performance"
]

@app.route("/", methods=["GET"])
def index():
    return "Student Stress Level Prediction API is running."

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Extract input features from the request
        data = request.get_json()

        # Ensure all required features are present
        missing_features = [feature for feature in FEATURE_COLUMNS if feature not in data]
        if missing_features:
            return jsonify({"error": f"Missing features: {missing_features}"}), 400

        # Arrange input data in the correct order
        features = np.array([data[feature] for feature in FEATURE_COLUMNS]).reshape(1, -1)

        # Make prediction
        prediction = model.predict(features)
        prediction_class = prediction[0]  # Assuming single prediction

        # Send response
        return jsonify({"prediction": int(prediction_class)})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)
