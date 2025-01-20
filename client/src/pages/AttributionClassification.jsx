import React, { useState } from 'react';
import axios from 'axios';
import './AttributionClassification.css';

function AttributionClassification() {
  const [sentence, setSentence] = useState('');
  
  // Separate states for the classification results
  const [classificationResult, setClassificationResult] = useState(null);
  const [spacyResult, setSpacyResult] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setSentence(e.target.value);
    setError('');
  };

  const handleClassify = async () => {
    if (!sentence.trim()) {
      setError("Please enter a sentence to classify.");
      return;
    }

    setIsLoading(true);
    setError('');
    setClassificationResult(null);  // Clear previous result
    setSpacyResult(null);  // Clear spaCy result as we are classifying with the other method

    try {
      const response = await axios.post('http://localhost:5001/api/classify', { text: sentence });
      console.log("Classification response:", response.data);
      const result = response.data.word_entity_mapping;
      setClassificationResult(result);  // Set result for 'Classify' button
    } catch (err) {
      setError("Error while classifying. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClassifyWithSpacy = async () => {
    if (!sentence.trim()) {
      setError("Please enter a sentence to classify.");
      return;
    }

    setIsLoading(true);
    setError('');
    setClassificationResult(null);  // Clear previous result
    setSpacyResult(null);  // Clear classification result

    try {
      const response = await axios.post('http://localhost:4400/predict-spacy', { text: sentence });
      console.log("spaCy response:", response.data);
      
      const result = response.data.entities;  // Assuming response contains an array of entities
      setSpacyResult(result);  // Set result for 'Classify with spaCy' button
    } catch (err) {
      setError("Error while classifying with spaCy. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="attribution-classification-container">
      <div className="attribution-classification">
        <h2>Attribution Annotation/Classification</h2>

        <div>
          <textarea
            rows="4"
            value={sentence}
            onChange={handleInputChange}
            placeholder="Enter sentence here"
            disabled={isLoading}
          />
        </div>

        <button onClick={handleClassify} disabled={isLoading}>
          {isLoading ? 'Classifying...' : 'Classify with xgboost'}
        </button>

        <button onClick={handleClassifyWithSpacy} disabled={isLoading}>
          {isLoading ? 'Classifying with spaCy...' : 'Classify with spaCy'}
        </button>

        {error && <p className="error">{error}</p>}

        {/* Rendering 'Classify' result */}
        {classificationResult && (
          <div className="classification-result">
            <h3>Classification Result (from xgboost):</h3>
            <ul>
              {Object.entries(classificationResult).map(([word, label], index) => (
                <li key={index}>
                  <strong>{word}:</strong> {label}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Rendering 'Classify with spaCy' result */}
        {spacyResult && spacyResult.length > 0 && (
          <div className="classification-result">
            <h3>Classification Result (from spaCy):</h3>
            <ul>
              {spacyResult.map((entity, index) => (
                <li key={index}>
                  <strong>{entity.text}:</strong> {entity.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default AttributionClassification;
