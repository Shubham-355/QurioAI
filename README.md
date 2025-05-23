﻿# QurioAI

A modern web application that allows users to chat with their PDF documents using AI technology.

## Features

- 🎯 Interactive chat interface for PDF documents
- 🌓 Dark/Light theme support
- 📱 Responsive design
- ⚡ Real-time AI-powered responses
- 📤 Easy PDF upload functionality
- 🔄 Smooth animations and transitions

## Live Demo

Visit the live application: [QurioaiAI](http://qurioai.netlify.app/)

## Tech Stack

- Frontend:
  - React
  - Tailwind CSS
  - Framer Motion
  - React Icons
- Backend:
  - Node.js
  - Express
  - PDF processing libraries

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/Shubham-355/QurioAI.git
cd DocuMind
```

2. Install dependencies
```bash
cd PdfChatBot
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

## Usage

1. Click the "Upload PDF" button to select a PDF file
2. Wait for the upload confirmation
3. Type your question in the input field
4. Press "Send" or hit Enter to get AI-powered responses about your document

## Environment Setup

1. Backend Setup
   Copy `.env.example` to `.env` in the root directory:
```bash
cp .env.example .env
```
Then update with your actual Gemini API key:
```env
GEMINI_API_KEY=your_actual_api_key_here
PORT=3001
```

2. Frontend Setup
   Copy `.env.example` to `.env` in the PdfChatBot directory:
```bash
cd PdfChatBot
cp .env.example .env
```
For development:
```env
VITE_API_URL=http://localhost:3001
```
For production:
```env
VITE_API_URL=your_production_backend_url
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## Acknowledgments

- Built with ❤️ using React and AI technology
