import React from 'react';
import { motion } from 'framer-motion';

const FormattedResponse = ({ text, theme }) => {
  if (!text) return null;

  const formatText = () => {
    const parts = text.split('\n').map((part, i) => {
      const isHeader = part.trim().match(/^\*\*(.*?)\*\*$/);
      if (isHeader) {
        return (
          <motion.h3 
            key={i} 
            className="text-lg font-bold mt-3 mb-2"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            {isHeader[1]}
          </motion.h3>
        );
      }

      const boldPattern = /\*\*(.*?)\*\*/g;
      const withBoldTags = part.replace(boldPattern, '<strong class="font-bold">$1</strong>');

      const isListItem = part.trim().match(/^[*\-]\s+(.+)$/);
      
      if (isListItem) {
        return (
          <motion.li 
            key={i} 
            className="ml-5 list-disc my-1"
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <span dangerouslySetInnerHTML={{ __html: formatInlineContent(isListItem[1]) }} />
          </motion.li>
        );
      }
      
      const isCategory = part.trim().match(/^([A-Z][A-Z\s]+):(.*)$/);
      if (isCategory) {
        return (
          <motion.div 
            key={i} 
            className="mt-2 mb-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.04 }}
          >
            <span className="font-semibold text-blue-400">{isCategory[1]}:</span>
            <span dangerouslySetInnerHTML={{ __html: formatInlineContent(isCategory[2]) }} />
          </motion.div>
        );
      }

      return part ? (
        <motion.p 
          key={i} 
          className="mb-2" 
          dangerouslySetInnerHTML={{ __html: withBoldTags }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.02 }}
        />
      ) : (
        <br key={i} />
      );
    });

    return parts;
  };
  
  const formatInlineContent = (text) => {
    if (!text) return '';
    
    const boldPattern = /\*\*(.*?)\*\*/g;
    return text.replace(boldPattern, '<strong class="font-bold">$1</strong>');
  };

  return (
    <div className={`formatted-response ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
      {formatText()}
    </div>
  );
};

export default FormattedResponse;
