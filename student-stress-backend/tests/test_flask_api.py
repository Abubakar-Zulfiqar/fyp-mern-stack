import unittest
import requests

BASE_URL = "http://127.0.0.1:5000/predict"

def test_prediction():
    payload = {
        "anxiety_level": 5.0,
        "depression": 3.2,
        "headache": 1.0,
        "future_career_concerns": 4.5,
        "bullying": 2.1,
        "self_esteem": 3.8,
        "sleep_quality": 4.0,
        "safety": 3.0,
        "basic_needs": 2.5,
        "academic_performance": 4.7
    }

    response = requests.post(BASE_URL, json=payload)
    print(f"Response JSON: {response.json()}")  # Print the JSON response

    assert response.status_code == 200
    assert "prediction" in response.json()

if __name__ == "__main__":
    test_prediction()
