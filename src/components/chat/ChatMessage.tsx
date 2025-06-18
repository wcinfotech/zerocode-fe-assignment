import React from 'react';
import { Message } from '../../types';
import { User, Bot, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ChatMessageProps {
  message: Message;
  isAnimating?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isAnimating = false }) => {
  const isUser = message.sender === 'user';
  const isLoading = message.isLoading;

  return (
    <div
      className={`flex items-start space-x-3 mb-6 ${
        isUser ? 'flex-row-reverse space-x-reverse' : ''
      } ${isAnimating ? 'animate-fade-in-up' : ''}`}
      role="article"
      aria-label={`Message from ${isUser ? 'user' : 'bot'}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
        }`}
        aria-hidden="true"
      >
        {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl`}>
        <div
          className={`px-4 py-3 rounded-2xl shadow-sm ${
            isUser
              ? 'bg-blue-600 text-white rounded-br-md'
              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-md'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-sm text-gray-500">Bot is typing...</span>
            </div>
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {message.content}
            </p>
          )}
        </div>

        {/* Timestamp */}
        <div
          className={`flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400 ${
            isUser ? 'justify-end' : 'justify-start'
          }`}
        >
          <Clock className="w-3 h-3 mr-1" aria-hidden="true" />
          <time dateTime={message.timestamp.toISOString()}>
            {formatDistanceToNow(message.timestamp, { addSuffix: true })}
          </time>
        </div>
      </div>
    </div>
  );
};