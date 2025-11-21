import pickle
import json
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load model
try:
    with open("banglore_home_prices_model.pkl", "rb") as f:
        model = pickle.load(f)
    print("✓ Model loaded successfully")
except Exception as e:
    print(f"✗ Error loading model: {e}")
    raise

# Load columns data
try:
    with open("columns.json", "r") as f:
        data_columns = json.load(f)
    
    # Extract locations (all columns except the first 3: total_sqft, bath, bhk)
    locations = sorted(data_columns['data_columns'][3:])
    print(f"✓ Loaded {len(locations)} locations from columns.json")
except Exception as e:
    print(f"✗ Error loading columns.json: {e}")
    locations = []

# Load training data for column transformer if needed
try:
    d8_data = pd.read_csv('d8_dataset.csv')
    print("✓ Training data loaded successfully")
except Exception as e:
    print(f"⚠ Warning: Could not load training data: {e}")
    d8_data = None


@app.route('/api/predict', methods=['POST'])
def predict_price():
    """
    API endpoint to predict house price
    Expected JSON format:
    {
        "location": "Whitefield",
        "total_sqft": 1750,
        "bath": 3,
        "bhk": 3
    }
    """
    try:
        data = request.get_json()
        
        # Validate input
        required_fields = ['location', 'total_sqft', 'bath', 'bhk']
        if not all(field in data for field in required_fields):
            return jsonify({
                'error': 'Missing required fields',
                'required': required_fields
            }), 400
        
        location = data['location'].lower().strip()
        total_sqft = float(data['total_sqft'])
        bath = int(data['bath'])
        bhk = int(data['bhk'])
        
        # Validate inputs
        if total_sqft <= 0 or bath <= 0 or bhk <= 0:
            return jsonify({'error': 'total_sqft, bath, and bhk must be positive numbers'}), 400
        
        # Validate location
        if location not in locations:
            return jsonify({
                'error': f'Location "{location}" not found.',
                'available_count': len(locations)
            }), 400
        
        # Create prediction input array
        x = np.zeros(len(data_columns['data_columns']))
        x[0] = total_sqft
        x[1] = bath
        x[2] = bhk
        
        # Find location index and set it to 1 (one-hot encoding)
        try:
            loc_index = data_columns['data_columns'].index(location)
            x[loc_index] = 1
        except ValueError:
            return jsonify({'error': f'Location "{location}" not found in data columns'}), 400
        
        # Make prediction
        predicted_price = model.predict([x])[0]
        
        return jsonify({
            'success': True,
            'predicted_price': float(predicted_price),
            'location': location,
            'total_sqft': total_sqft,
            'bath': bath,
            'bhk': bhk,
            'formatted_price': f"₹ {predicted_price:.2f} Lakhs" if predicted_price < 10000 else f"₹ {predicted_price/100:.2f} Crore"
        }), 200
        
    except ValueError as e:
        return jsonify({'error': f'Invalid input format: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': f'Prediction error: {str(e)}'}), 500


@app.route('/api/locations', methods=['GET'])
def get_locations():
    """
    API endpoint to get all available locations
    """
    return jsonify({
        'locations': locations,
        'count': len(locations)
    }), 200


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'OK',
        'message': 'Flask server is running',
        'model_loaded': True,
        'locations_loaded': len(locations) > 0
    }), 200


if __name__ == '__main__':
    print("\n" + "="*50)
    print("Bengaluru Real Estate Price Predictor")
    print("="*50)
    print(f"Available locations: {len(locations)}")
    print(f"Starting Flask server on http://localhost:5000")
    print("="*50 + "\n")
    
    # Run Flask app in debug mode on port 5000
    app.run(debug=True, port=5000, use_reloader=False)
