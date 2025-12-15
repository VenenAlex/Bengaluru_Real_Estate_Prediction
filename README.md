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
