// models/ExtractedContent.js
const mongoose = require('mongoose');

const extractedContentSchema = new mongoose.Schema({
    url: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    filename: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const ExtractedContent = mongoose.model('ExtractedContent', extractedContentSchema);

module.exports = ExtractedContent;
