import { useState, useCallback } from 'react';
import { Message, Chat } from '../types';
import { chatService } from '../services/chatService';

export const useChat = (initialChatId?: string) => {
  const [currentChat, setCurrentChat] = useState<Chat | null>(() => {
    if (initialChatId) {
      const savedChats = chatService.getSavedChats();
      return savedChats.find(chat => chat.id === initialChatId) || null;
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);

  const createNewChat = useCallback(() => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setCurrentChat(newChat);
    return newChat;
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!currentChat) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: '',
      sender: 'bot',
      timestamp: new Date(),
      isLoading: true,
    };

    // Update chat with user message and loading bot message
    const updatedChat = {
      ...currentChat,
      messages: [...currentChat.messages, userMessage, botMessage],
      updatedAt: new Date(),
      title: currentChat.messages.length === 0 ? content.slice(0, 30) + '...' : currentChat.title,
    };

    setCurrentChat(updatedChat);
    setIsLoading(true);

    try {
      const botResponse = await chatService.sendMessage(content);
      
      const finalBotMessage: Message = {
        ...botMessage,
        content: botResponse,
        isLoading: false,
      };

      const finalChat = {
        ...updatedChat,
        messages: [...updatedChat.messages.slice(0, -1), finalBotMessage],
        updatedAt: new Date(),
      };

      setCurrentChat(finalChat);
      chatService.saveChat(finalChat);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove the loading message on error
      const errorChat = {
        ...updatedChat,
        messages: updatedChat.messages.slice(0, -1),
      };
      setCurrentChat(errorChat);
    } finally {
      setIsLoading(false);
    }
  }, [currentChat]);

  const loadChat = useCallback((chatId: string) => {
    const savedChats = chatService.getSavedChats();
    const chat = savedChats.find(c => c.id === chatId);
    if (chat) {
      setCurrentChat(chat);
    }
  }, []);

  return {
    currentChat,
    isLoading,
    sendMessage,
    createNewChat,
    loadChat,
  };
};