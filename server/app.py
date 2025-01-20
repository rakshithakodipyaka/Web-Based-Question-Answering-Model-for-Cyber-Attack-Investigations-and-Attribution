import os
import requests
from bs4 import BeautifulSoup
from newspaper import Article, Config
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.preprocessing import MultiLabelBinarizer
from pymongo import MongoClient
from datetime import datetime, timezone

app = Flask(__name__)
CORS(app, supports_credentials=True)


# MongoDB setup
client = MongoClient("mongodb://localhost:27017/")
db = client['web_scraping_db']
collection = db['scraped_articles']


# Paths to the saved .pkl files
output_dir = r"C:\Users\iamve\OneDrive\Desktop\3.1project\mlmodel" # Update with your directory
model_path = os.path.join(output_dir, "xgboost_model.pkl")
vectorizer_path = os.path.join(output_dir, "vectorizer.pkl")
mlb_path = os.path.join(output_dir, "mlb.pkl")

# Load the pre-trained model, vectorizer, and MultiLabelBinarizer
model = joblib.load(model_path)
vectorizer = joblib.load(vectorizer_path)
mlb = joblib.load(mlb_path)

def predict_word_mapping_single_entity(input_text, model, vectorizer, mlb):
   
    # Split the input text into words
    words = input_text.split()

    # Initialize the word-to-entity map
    word_entity_map = {}

    for word in words:
        # Preprocess each word (convert to vector)
        input_vector = vectorizer.transform([word]).toarray()

        # Predict probabilities for the word
        pred_probs = model.predict_proba(input_vector)

        # Get the entity with the highest probability
        max_prob_index = pred_probs.argmax(axis=1)[0]
        predicted_entity = mlb.classes_[max_prob_index]

        # Map the word to the most relevant entity
        word_entity_map[word] = predicted_entity

    return word_entity_map

@app.route('/api/classify', methods=['POST'])
def classify_text():
    data = request.get_json()
    text = data.get('text')

    if not text:
        return jsonify({'error': 'No text provided'}), 400

    # Predict the word-to-entity mapping
    word_to_entity_map = predict_word_mapping_single_entity(text, model, vectorizer, mlb)

    return jsonify({'word_entity_mapping': word_to_entity_map})

if __name__ == '__main__':
    app.run(debug=True, port=5001)

