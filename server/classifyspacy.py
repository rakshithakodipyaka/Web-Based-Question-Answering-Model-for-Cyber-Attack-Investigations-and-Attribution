from flask import Flask, request, jsonify
from flask_cors import CORS
import spacy

app = Flask(__name__)

# Enable CORS with the required options (allowing credentials)
CORS(app, supports_credentials=True)

# Load the trained NER model
nlp = spacy.load(r"C:\Users\iamve\OneDrive\Desktop\3.1project\cyberdetection\ner_model")

@app.route("/predict-spacy", methods=["POST"])
def predict():
    try:
        data = request.json
        text = data.get("text", "")
        if not text:
            return jsonify({"error": "No text provided"}), 400

        doc = nlp(text)
        entities = []

        # Iterate through tokens and assign labels
        for token in doc:
            # Check if the token is part of an entity
            if token.ent_type_:
                entities.append({
                    "text": token.text,
                    "label": token.ent_type_  # Assign the entity label
                })
            else:
                entities.append({
                    "text": token.text,
                    "label": "O"  # Assign "O" for tokens that are not part of any entity
                })

        return jsonify({"entities": entities})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=4400, debug=True)
