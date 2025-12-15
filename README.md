# Bengaluru Real Estate Price Predictor 🏠

A full-stack machine learning web application that predicts property prices in Bengaluru based on location, total square feet, BHK, and number of bathrooms. It combines a trained ML model with a modern, glassmorphism-based UI to give users instant and intuitive price insights.

---

## 🚀 Features

- 🔮 **Price Prediction** using a trained ML regression model (`banglore_home_prices_model.pkl`)
- 🗺️ **Location-aware** – supports many Bengaluru localities via one-hot encoding (`columns.json`)
- 🌐 **REST API** built with Flask
- 🎨 **Modern Frontend** using HTML, CSS, and JavaScript
- ⚡ **Instant Results** with smooth UI animations and notifications
- 📊 **Data-driven** – trained on real Bengaluru housing data

---

## 🧠 Tech Stack

**Backend**
- Python
- Flask
- NumPy, Pandas, Scikit-learn
- Pickle (for model serialization)

**Frontend**
- HTML5
- CSS3 (Glassmorphism, animations, responsive design)
- Vanilla JavaScript (Fetch API, dynamic DOM updates)

---

## 📂 Project Structure

```bash
Bengaluru_Real_Estate_Prediction/
├── app.py                        # Flask backend (API, model loading, prediction logic)
├── Bengaluru_House_Data.csv      # Raw/processed dataset used for model
├── d8_dataset.csv                # Additional/processed training dataset
├── banglore_home_prices_model.pkl# Trained ML model
├── columns.json                  # Feature columns (includes encoded locations)
├── location_encoder.pkl          # Encoder object (if used in training)
├── RealEstatePridiction.ipynb    # Jupyter notebook for EDA/model training
├── requirements.txt              # Python dependencies
└── Interface/
    ├── index.html                # Landing page (hero, features, gallery, about)
    ├── predict.html              # Prediction UI form
    ├── script.js                 # Frontend logic (API calls, effects, notifications)
    ├── styles.css                # Styling and animations
    └── images/
        ├── placeholder_apartment.jpg
        ├── placeholder_bengaluru.jpg
        └── ulsoor-lake-bangalore-karnataka-attr-about.jpeg
```

---

## 🎯 How to Run the Project

### **Option 1: Run Locally (Without Docker)**

#### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)
- Git

#### Step 1: Clone the Repository
```bash
git clone https://github.com/VenenAlex/Bengaluru_Real_Estate_Prediction.git
cd Bengaluru_Real_Estate_Prediction
```

#### Step 2: Create a Virtual Environment (Optional but Recommended)
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

#### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

#### Step 4: Run the Flask Application
```bash
python app.py
```

**Output:**
```
✓ Model loaded successfully
✓ Loaded 240 locations from columns.json
✓ Training data loaded successfully

==================================================
Bengaluru Real Estate Price Predictor
==================================================
Available locations: 240
Starting Flask server on http://0.0.0.0:5000
==================================================

 * Serving Flask app 'app'
 * Debug mode: off
 * Running on http://127.0.0.1:5000
```

#### Step 5: Open in Browser
Open your browser and navigate to:
```
http://localhost:5000
```

---

### **Option 2: Run with Docker** 🐳

#### Prerequisites
- Docker Desktop installed
- Git

#### Step 1: Clone the Repository
```bash
git clone https://github.com/VenenAlex/Bengaluru_Real_Estate_Prediction.git
cd Bengaluru_Real_Estate_Prediction
```

#### Step 2: Build the Docker Image
```bash
docker build -t venenale/real_estate_predictor .
```

**Note:** The tag `venenale/real_estate_predictor` should be lowercase (Docker Hub requirement).

#### Step 3: Run the Docker Container
```bash
docker run -d -p 8888:5000 venenale/real_estate_predictor
```

**Explanation:**
- `-d`: Run in detached mode (background)
- `-p 8888:5000`: Map port 8888 on your host to port 5000 in the container
- Container will start Flask app automatically

#### Step 4: Verify Container is Running
```bash
docker ps
```

You should see your container listed with status "Up".

#### Step 5: Open in Browser
Navigate to:
```
http://localhost:8888
```

#### Step 6: Stop the Container (When Done)
```bash
docker stop <container_id>
```

---

### **Option 3: Pull from Docker Hub** 

If the image is published to Docker Hub:

```bash
# Pull the image
docker pull venenalex/real_estate_predictor:latest

# Run the container
docker run -d -p 8888:5000 venenalex/real_estate_predictor:latest

# Access at http://localhost:8888
```

---

## 📡 API Endpoints

### 1. **Home Page**
```
GET http://localhost:5000/
```
Returns the interactive web interface for price prediction.

### 2. **Get All Available Locations**
```
GET http://localhost:5000/api/locations
```

**Response:**
```json
{
  "locations": ["1st Phase JP Nagar", "1st Phase JP Nagar", "10th Phase JP Nagar", ...],
  "count": 240
}
```

### 3. **Predict Property Price**
```
POST http://localhost:5000/api/predict
```

**Request Body:**
```json
{
  "location": "1st Phase JP Nagar",
  "total_sqft": 1000,
  "bath": 2,
  "bhk": 2
}
```

**Response:**
```json
{
  "success": true,
  "predicted_price": 45.5,
  "location": "1st phase jp nagar",
  "total_sqft": 1000,
  "bath": 2,
  "bhk": 2,
  "formatted_price": "₹ 45.50 Lakhs"
}
```

### 4. **Health Check**
```
GET http://localhost:5000/health
```

**Response:**
```json
{
  "status": "OK",
  "message": "Flask server is running",
  "model_loaded": true,
  "locations_loaded": true
}
```

---

## 🧪 Testing the API with cURL

### Example 1: Get Locations
```bash
curl http://localhost:5000/api/locations
```

### Example 2: Predict Price
```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"location":"1st phase jp nagar","total_sqft":1000,"bath":2,"bhk":2}'
```

### Example 3: Health Check
```bash
curl http://localhost:5000/health
```

---

## 📊 Using the Web Interface

1. **Open the Application**
   - Local: http://localhost:5000
   - Docker: http://localhost:8888

2. **Fill in Property Details**
   - Select a location from the dropdown (240 Bengaluru locations available)
   - Enter total square feet
   - Enter number of bathrooms
   - Enter number of BHK (bedrooms)

3. **Click "Predict Price"**
   - The app will send a request to the Flask API
   - Model processes the input and returns predicted price
   - Price is displayed with formatting (₹ in Lakhs)

4. **View Results**
   - Predicted price in Indian Rupees (Lakhs)
   - Visual feedback with success/error notifications

---

## 🔍 Troubleshooting

### Issue: "Port 5000 is already in use"
**Solution:** Use a different port
```bash
# Modify app.py line: app.run(host="0.0.0.0", port=8000)
# Or use Docker with different port mapping:
docker run -d -p 9000:5000 venenale/real_estate_predictor
```

### Issue: "Location dropdown is empty"
**Solution:** Verify the API is running
```bash
curl http://localhost:5000/api/locations
```

### Issue: "Module not found" error
**Solution:** Install missing dependencies
```bash
pip install -r requirements.txt
```

### Issue: Docker image not found
**Solution:** Build the image first
```bash
docker build -t venenale/real_estate_predictor .
```

### Issue: Cannot connect to Flask server
**Solution:** Check if the container is running
```bash
docker ps -a  # Shows all containers
docker logs <container_id>  # Check error logs
```

---

## 📈 Model Performance

- **Algorithm:** Multiple Linear Regression
- **R² Score:** 85.5% on test data
- **Cross-Validation Score:** 84-86% consistency (5-fold ShuffleSplit)
- **Training Data:** 13,320 properties across 240 Bengaluru locations
- **Features:** Location (one-hot encoded), Total SQFT, Bathrooms, BHK

---

## 📝 Dataset Information

- **Source:** `Bengaluru_House_Data.csv`
- **Records:** 13,320 properties
- **Features:** location, size (BHK), total_sqft, bath, price
- **Cleaned Data:** `d8_dataset.csv` (after data preprocessing and outlier removal)

---

## 🛠️ Development Notes

### Running the Jupyter Notebook
To explore the data processing and model training:

```bash
# Install Jupyter if not already installed
pip install jupyter

# Start Jupyter Notebook
jupyter notebook RealEstatePridiction.ipynb
```

### Model Files
- **`banglore_home_prices_model.pkl`** - Trained Linear Regression model
- **`columns.json`** - Feature column metadata (locations and feature order)
- **`d8_dataset.csv`** - Cleaned dataset used for training

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Venen Alex**
- GitHub: [@VenenAlex](https://github.com/VenenAlex)
- Repository: [Bengaluru Real Estate Prediction](https://github.com/VenenAlex/Bengaluru_Real_Estate_Prediction)

---

## 📞 Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

---

**Happy Predicting! 🎉**
