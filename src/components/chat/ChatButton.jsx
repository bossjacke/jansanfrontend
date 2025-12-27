import React, { useState } from 'react';
import ChatBot from './ChatBot.jsx';

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 group"
        aria-label="Chat with AI"
      >
        <svg 
          className="w-6 h-6 group-hover:animate-pulse" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
          />
        </svg>
        
        {/* Notification Dot */}
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <ChatBot 
          onClose={() => setIsOpen(false)} 
        />
      )}
    </>
  );
};

export default ChatButton;
