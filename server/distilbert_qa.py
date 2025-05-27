from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from sentence_transformers import SentenceTransformer
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load the pre-trained SentenceTransformer model
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')  # You can use other models like 'all-MiniLM-L6-v2' for better accuracy

# Load dataset for mapping labels to answers
qa_data = pd.read_csv(r"C:\Users\iamve\OneDrive\Desktop\3.1project\CleanedQuestionsAnswersCSV.csv", encoding='ISO-8859-1')
answers = list(qa_data['Ground Truth'].unique())
answer_to_label = {answer: idx for idx, answer in enumerate(answers)}
label_to_answer = {idx: answer for answer, idx in answer_to_label.items()}

# Precompute embeddings for the questions in the dataset
def compute_embeddings(questions):
    return model.encode(questions)  # Use SentenceTransformer to encode the questions

# Store embeddings for the questions in the dataset
question_embeddings = compute_embeddings(qa_data['Question'].tolist())
questions_list = qa_data['Question'].tolist()  # Store the original questions for exact matching

# Function to check if the question is sufficiently long and meaningful
def is_valid_question(question):
    # Ignore questions that are too short or consist of only irrelevant words
    if len(question.split()) < 3:  # Minimum of 3 words
        return False
    # Additional checks can be added for irrelevant words (e.g., "who", "what", etc.)
    if question.lower() in ['who', 'what', 'why', 'how']:  # Example of irrelevant questions
        return False
    return True

# Prediction function with semantic matching
def answer_question(question):
    # Check if the question is empty, too short, or consists only of special characters
    if not question or question.strip() == "" or all(char in "?!" for char in question):
        return "Please ask questions related to CyberDetection only."

    # Validate question length and content
    if not is_valid_question(question):
        return "Please ask a more specific and meaningful question."

    # Compute the embedding for the user-provided question
    question_embedding = model.encode([question])

    # Calculate cosine similarity between the user question and all dataset questions
    similarities = cosine_similarity(question_embedding, question_embeddings)

    # Debugging: Print the similarities to see the match quality
    print("Cosine Similarities:", similarities)

    # Find the index of the most similar question in the dataset
    most_similar_idx = np.argmax(similarities)

    # Check the similarity value to ensure it's above the threshold
    similarity_score = similarities[0][most_similar_idx]
    print(f"Similarity score for the most similar question: {similarity_score}")

    # Set a higher similarity threshold (e.g., 0.7) to avoid irrelevant matches
    if similarity_score > 0.7:  # Adjust the threshold as needed
        return label_to_answer[most_similar_idx]

    # If no sufficiently similar match, return a warning message
    return "Please ask questions related to CyberDetection only."

@app.route('/api/qa', methods=['POST'])
def qa():
    data = request.get_json()
    question = data.get('question')

    if not question:
        return jsonify({'error': 'No question provided'}), 400

    # Get the answer from the model
    answer = answer_question(question)
    return jsonify({'answer': answer})

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, port=4000)
