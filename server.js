// server.js
const express = require('express');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const pdf = require('pdf-parse');
const cors = require('cors');
require('dotenv').config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Store PDF content in memory (in production, use a proper database)
let pdfContent = '';

app.post('/upload', upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No PDF file uploaded' });
        }

        // Parse PDF content
        const data = await pdf(req.file.buffer);
        pdfContent = data.text;
        
        res.json({ message: 'PDF uploaded and processed successfully' });
    } catch (error) {
        console.error('Error processing PDF:', error);
        res.status(500).json({ error: 'Error processing PDF' });
    }
});

app.post('/ask', async (req, res) => {
    try {
        const { question } = req.body;
        
        if (!pdfContent) {
            return res.status(400).json({ error: 'No PDF content available' });
        }

        // Initialize Gemini model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Create prompt combining PDF content and question
        const prompt = `Based on the following content: "${pdfContent.substring(0, 30000)}"
                       Please answer this question: ${question}`;

        // Generate response
        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        res.json({ answer: response.text() });
    } catch (error) {
        console.error('Error generating response:', error);
        res.status(500).json({ error: 'Error generating response' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});