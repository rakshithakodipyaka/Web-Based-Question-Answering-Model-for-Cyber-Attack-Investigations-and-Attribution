const express = require('express');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv').config()
const cors = require('cors');
const { mongoose } = require('mongoose')
const cookieParser = require('cookie-parser')
const axios = require('axios');
const { PythonShell } = require('python-shell');
const authRoutes = require('./routes/authRoutes');
const extractController = require('./controllers/extractController');

const app = express();

// Database connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Database connected'))
    .catch((err) => console.log('Database not connected', err));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Routes
app.use('/auth', authRoutes);
app.use('/api', extractController);

// Serve the JSON file directly
app.get('/api/dataset', (req, res) => {
    const filePath = path.join(__dirname, 'datasets', 'FinalMergedDatabase.json');

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
    }

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read the file' });
        }

        try {
            const jsonData = JSON.parse(data);
            res.json(jsonData);
        } catch (err) {
            return res.status(500).json({ error: 'Invalid JSON file' });
        }
    });
});

// ML model interaction
app.post('/api/ml/classify', async (req, res) => {
    const { text } = req.body;
    try {
        const response = await axios.post('http://localhost:5001/api/classify', { text });
        res.json(response.data);
    } catch (error) {
        console.error('Error in ML classification:', error);
        res.json({ error: 'Failed to classify text' });
    }
});

// DistilBERT QA model interaction
app.post('/api/qa', (req, res) => {
    const { question } = req.body;

    let options = {
        args: [question]
    };

    PythonShell.run('server/distilbert_qa.py', options, function (err, result) {
        if (err) {
            console.error('Error running DistilBERT QA model:', err);
            return res.json({ error: 'Failed to process question' });
        }
        res.json({ answer: result[0] });
    });
});

const port = 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
