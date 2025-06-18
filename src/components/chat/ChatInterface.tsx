import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Paperclip } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { useChat } from '../../hooks/useChat';
import { Message } from '../../types';

export const ChatInterface: React.FC = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [newMessageId, setNewMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const { currentChat, isLoading, sendMessage, createNewChat } = useChat();

  // Initialize with demo conversation if no current chat
  useEffect(() => {
    if (!currentChat) {
      const demoChat = createNewChat();
      // Add some demo messages to showcase the interface
      const demoMessages: Message[] = [
        {
          id: '1',
          content: 'Hello! I\'m your AI assistant. How can I help you today?',
          sender: 'bot',
          timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        },
        {
          id: '2',
          content: 'Hi there! I\'m working on a React project and need some help with state management. Can you explain the difference between useState and useReducer?',
          sender: 'user',
          timestamp: new Date(Date.now() - 240000), // 4 minutes ago
        },
        {
          id: '3',
          content: 'Great question! useState is perfect for simple state values, while useReducer is better for complex state logic. useState is ideal when you have independent state variables, but useReducer shines when you have multiple state values that depend on each other or when state transitions are complex.\n\nFor example, useState is great for a simple counter, but useReducer is better for managing a shopping cart with items, quantities, and totals.',
          sender: 'bot',
          timestamp: new Date(Date.now() - 180000), // 3 minutes ago
        },
        {
          id: '4',
          content: 'That makes sense! Can you show me a practical example of when I should choose useReducer over useState?',
          sender: 'user',
          timestamp: new Date(Date.now() - 120000), // 2 minutes ago
        },
        {
          id: '5',
          content: 'Absolutely! Here\'s a perfect scenario: imagine you\'re building a form with validation. With useState, you\'d need multiple state variables:\n\n```javascript\nconst [name, setName] = useState(\'\');\nconst [email, setEmail] = useState(\'\');\nconst [errors, setErrors] = useState({});\nconst [isSubmitting, setIsSubmitting] = useState(false);\n```\n\nWith useReducer, you can manage all related state in one place:\n\n```javascript\nconst [state, dispatch] = useReducer(formReducer, {\n  name: \'\',\n  email: \'\',\n  errors: {},\n  isSubmitting: false\n});\n```\n\nThis makes state updates more predictable and easier to debug!',
          sender: 'bot',
          timestamp: new Date(Date.now() - 60000), // 1 minute ago
        },
        {
          id: '6',
          content: 'Perfect! This really helps clarify when to use each approach. Thank you for the detailed explanation and code examples.',
          sender: 'user',
          timestamp: new Date(Date.now() - 30000), // 30 seconds ago
        },
      ];

      // Update the chat with demo messages
      const updatedChat = {
        ...demoChat,
        messages: demoMessages,
        title: 'React State Management Help',
        updatedAt: new Date(),
      };
      
      // We'll need to update the useChat hook to handle this
    }
  }, [currentChat, createNewChat]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat?.messages]);

  // Clear animation after a delay
  useEffect(() => {
    if (newMessageId) {
      const timer = setTimeout(() => setNewMessageId(null), 500);
      return () => clearTimeout(timer);
    }
  }, [newMessageId]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const messageContent = inputMessage.trim();
    setInputMessage('');
    
    // Set animation for new messages
    setNewMessageId(Date.now().toString());
    
    if (currentChat) {
      await sendMessage(messageContent);
    } else {
      createNewChat();
      await sendMessage(messageContent);
    }
    
    // Focus back to input
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      // Stop speech recognition logic would go here
    } else {
      setIsListening(true);
      // Start speech recognition logic would go here
      // For now, we'll just simulate it
      setTimeout(() => {
        setIsListening(false);
        setInputMessage('This is a voice message example');
      }, 3000);
    }
  };

  // Demo messages for initial display
  const demoMessages: Message[] = [
    {
      id: '1',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(Date.now() - 300000),
    },
    {
      id: '2',
      content: 'Hi there! I\'m working on a React project and need some help with state management. Can you explain the difference between useState and useReducer?',
      sender: 'user',
      timestamp: new Date(Date.now() - 240000),
    },
    {
      id: '3',
      content: 'Great question! useState is perfect for simple state values, while useReducer is better for complex state logic. useState is ideal when you have independent state variables, but useReducer shines when you have multiple state values that depend on each other or when state transitions are complex.\n\nFor example, useState is great for a simple counter, but useReducer is better for managing a shopping cart with items, quantities, and totals.',
      sender: 'bot',
      timestamp: new Date(Date.now() - 180000),
    },
    {
      id: '4',
      content: 'That makes sense! Can you show me a practical example of when I should choose useReducer over useState?',
      sender: 'user',
      timestamp: new Date(Date.now() - 120000),
    },
    {
      id: '5',
      content: 'Absolutely! Here\'s a perfect scenario: imagine you\'re building a form with validation. With useState, you\'d need multiple state variables, but with useReducer, you can manage all related state in one place. This makes state updates more predictable and easier to debug!',
      sender: 'bot',
      timestamp: new Date(Date.now() - 60000),
    },
  ];

  const messages = currentChat?.messages || demoMessages;

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Chat Header */}
      <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">AI</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI Assistant
            </h2>
            <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Online
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isAnimating={message.id === newMessageId}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none max-h-32"
                rows={1}
                style={{ minHeight: '48px' }}
                disabled={isLoading}
                aria-label="Type your message"
              />
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors ${
                  isListening
                    ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-400 dark:hover:bg-gray-500'
                }`}
                aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white p-3 rounded-2xl transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Send message"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          
          {isListening && (
            <div className="mt-2 flex items-center justify-center text-sm text-red-600 dark:text-red-400">
              <div className="animate-pulse flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Listening...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};