const express = require('express');
const axios = require('axios');  // Import axios for HTTP requests

const router = express.Router();  // Initialize the router

// Define the POST route for '/classify'
router.post('/classify', async (req, res) => {
  const { text } = req.body;  // Get the text from the request body

  try {
    // Make a request to the other service at localhost:5001
    const response = await axios.post('http://localhost:5001/api/classify', { text });
    
    // Return the response data to the client
    res.json(response.data);
  } catch (error) {
    // If an error occurs, respond with a 500 status and error message
    res.status(500).json({ error: 'Failed to classify text' });
  }
});

module.exports = router;  // Export the router for use in index.js
