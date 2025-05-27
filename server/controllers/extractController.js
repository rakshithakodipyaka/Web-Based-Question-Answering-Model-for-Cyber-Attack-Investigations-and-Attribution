const express = require('express');
const router = express.Router();
const axios = require('axios');
const { JSDOM } = require('jsdom');
const path = require('path');
const ExtractedContent = require('../models/ExtractedContent');

// Function to clean extracted text
const cleanText = (text) => {
  return text
    .replace(/[^\w\s.,]/g, '')  // Remove special characters except punctuation
    .replace(/\s+/g, ' ')        // Normalize whitespace
    .trim();
};

// Function to extract content from a URL
const extractWebsiteContent = async (url) => {
  try {
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const paragraphs = dom.window.document.querySelectorAll('p');
    const text = Array.from(paragraphs).map(p => p.textContent).join(' ');

    // Clean the extracted text before returning
    return cleanText(text);
  } catch (error) {
    throw new Error('Error extracting content: ' + error.message);
  }
};

// POST route to extract content and save it to the database and file
router.post('/extract', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ success: false, message: 'URL is required' });
  }

  try {
    // Check if the URL already exists in the database
    const existingContent = await ExtractedContent.findOne({ url });
    if (existingContent) {
      // If it exists, return the existing content
      return res.json({
        success: true,
        content: existingContent.content,
        filename: existingContent.filename,
      });
    }

    // Extract content from the URL
    const content = await extractWebsiteContent(url);

    // Clean and create a valid filename from the URL
    const baseFilename = url.replace("https://", "").replace("http://", "").replace(/[^\w\s.-]/g, '_');
    const filename = `${baseFilename}.txt`;

    // Save the content to MongoDB
    const newExtractedContent = new ExtractedContent({
      url,
      content,
      filename,
    });
    await newExtractedContent.save();

    // Respond with success, the content, and the filename
    res.json({ success: true, content, filename });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
