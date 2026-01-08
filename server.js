const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

if (!process.env.GEMINI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY is not set in your .env file');
  process.exit(1);
}

console.log('API Key exists and starts with:', process.env.GEMINI_API_KEY.substring(0, 4) + '...');

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

let pdfContent = '';

app.post('/upload', upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No PDF file uploaded' });
        }

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

        console.log('Sending prompt to Gemini API...');
        
        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Based on the following content: "${pdfContent.substring(0, 30000)}"
                      Please answer this question: ${question}`,
            config: {
                temperature: 0.4,
                maxOutputTokens: 2048,
            }
        });
        
        console.log('Received response from Gemini API');
        
        res.json({ answer: response.text });
    } catch (error) {
        console.error('Error generating response:', error);
        
        const errorDetails = {
            message: error.message,
            name: error.name,
            stack: error.stack?.split('\n').slice(0, 3).join('\n'),
            code: error.code
        };
        
        console.error('Detailed error:', JSON.stringify(errorDetails, null, 2));
        
        res.status(500).json({ 
            error: 'Error generating response', 
            details: error.message,
            suggestion: 'Please verify your GEMINI_API_KEY is valid and the model "gemini-2.0-flash" is available for your account.'
        });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});