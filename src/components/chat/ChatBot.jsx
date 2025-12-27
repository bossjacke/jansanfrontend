import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const ChatBot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI assistant for Jansan Eco Solutions. How can I help you today?",
      sender: 'bot'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Quick action buttons
  const quickActions = [
    { text: "Tell me about products", message: "Tell me about your products" },
    { text: "What are the prices?", message: "What are your product prices?" },
    { text: "How to order?", message: "How do I place an order?" }
  ];

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending message
  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInputMessage('');

    try {
      // Try real API call first
      const response = await axios.post('http://localhost:3003/api/chat', {
        message: messageText
      });

      // Add bot response
      const botMessage = {
        id: Date.now() + 1,
        text: response.data.reply,
        sender: 'bot'
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Chat Error:', error);
      
      // Fallback to mock response if API fails
      const mockResponse = getMockResponse(messageText);
      
      const botMessage = {
        id: Date.now() + 1,
        text: mockResponse,
        sender: 'bot'
      };

      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock response function
  const getMockResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('product') || lowerMessage.includes('what do you have')) {
      return "We offer various eco-friendly cleaning products for home and office use. Our products include surface cleaners, floor cleaners, and disinfectants that are safe for the environment!";
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
      return "Our products range from Rs.100 to Rs.1000 depending on the type and size. We have affordable options for every budget!";
    }
    
    if (lowerMessage.includes('order') || lowerMessage.includes('buy') || lowerMessage.includes('purchase')) {
      return "You can easily order through our website! Just browse our products, add items to cart, and proceed to checkout. We accept multiple payment methods.";
    }
    
    if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
      return "We deliver across India! Standard delivery takes 3-5 business days. Express delivery is available in major cities.";
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! Welcome to Jansan Eco Solutions! How can I help you today?";
    }
    
    return "Thank you for your question! For more specific information about our eco-friendly cleaning products, please check our products page or contact our customer support.";
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  return (
    <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col border border-gray-200">
      
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold">AI Assistant</h3>
            <p className="text-xs text-white/80">Jansan Eco Solutions</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Quick Actions */}
      <div className="p-3 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-3 gap-2">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => sendMessage(action.message)}
              className="text-xs bg-white border border-gray-300 rounded-lg px-2 py-2 hover:bg-purple-50 hover:border-purple-300 transition-colors text-gray-700 hover:text-purple-700"
            >
              {action.text}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-2xl">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-2 rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBot;
