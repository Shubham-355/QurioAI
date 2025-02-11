import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon, FiUpload } from 'react-icons/fi';

function App() {
  const [file, setFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [theme, setTheme] = useState('light');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      
      const formData = new FormData();
      formData.append('pdf', selectedFile);

      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          setUploadStatus('success');
          setMessages(prev => [...prev, {
            type: 'system',
            content: `PDF "${selectedFile.name}" uploaded successfully! You can now ask questions about it.`
          }]);
        } else {
          setUploadStatus('error');
          setMessages(prev => [...prev, {
            type: 'system',
            content: 'Error uploading PDF. Please try again.'
          }]);
        }
      } catch (error) {
        console.error('Error:', error);
        setUploadStatus('error');
      } finally {
        setLoading(false);
      }
    } else {
      setUploadStatus('error');
      setMessages(prev => [...prev, {
        type: 'system',
        content: 'Please select a valid PDF file.'
      }]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || !file) return;

    const userQuestion = question;
    setQuestion('');
    setMessages(prev => [...prev, { type: 'user', content: userQuestion }]);
    
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userQuestion }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessages(prev => [...prev, { type: 'assistant', content: data.answer }]);
      } else {
        setMessages(prev => [...prev, { type: 'system', content: 'Error getting response. Please try again.' }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { type: 'system', content: 'Error getting response. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <nav className={`fixed w-full top-0 z-50 transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } shadow-lg`}>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex flex-wrap items-center justify-between h-auto py-2 sm:h-16">
            <div className="flex items-center flex-shrink-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center"
              >
                <h1 className={`text-lg sm:text-2xl font-bold ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`}>DocuMind</h1>
              </motion.div>
            </div>

            <div className={`flex-1 text-center mx-2 text-sm sm:text-base ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Crafted by Shubham with love ♡
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`p-1.5 sm:p-2 rounded-full ${
                  theme === 'dark' ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {theme === 'dark' ? <FiSun size={16} className="sm:w-5 sm:h-5" /> : <FiMoon size={16} className="sm:w-5 sm:h-5" />}
              </motion.button>

              <motion.label
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg cursor-pointer text-sm sm:text-base ${
                  theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
              >
                <FiUpload size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="whitespace-nowrap">Upload PDF</span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </motion.label>

              {file && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[200px] ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  {file.name}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-20 pb-24 px-4 max-w-4xl mx-auto overflow-y-auto h-[calc(100vh-8rem)]">
        <AnimatePresence mode="popLayout">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  duration: 0.3,
                  ease: "easeOut",
                  delay: index * 0.05 // Reduced delay for better performance
                }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-lg p-4 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : message.type === 'assistant'
                    ? theme === 'dark' 
                      ? 'bg-gray-800 text-gray-100 border border-gray-700' 
                      : 'bg-white text-gray-800 shadow-md'
                    : theme === 'dark'
                      ? 'bg-yellow-500/20 text-yellow-200'
                      : 'bg-yellow-500/20 text-yellow-800'
                }`}>
                  {message.content}
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </motion.div>
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center py-4"
          >
            <div className="flex space-x-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                  className={`w-3 h-3 rounded-full ${
                    theme === 'dark' ? 'bg-blue-400' : 'bg-blue-500'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <div className={`fixed bottom-0 left-0 right-0 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } shadow-lg`}>
        <div className="max-w-4xl mx-auto p-4">
          <form onSubmit={handleSubmit} className="flex space-x-4">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={file ? "Ask a question about your PDF..." : "Upload a PDF to start asking questions"}
              disabled={!file || loading}
              className={`flex-1 p-3 rounded-lg transition-colors duration-300 ${
                theme === 'dark'
                  ? 'bg-gray-700 text-gray-100 placeholder-gray-400'
                  : 'bg-gray-100 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!file || loading || !question.trim()}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                !file || loading || !question.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              Send
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;