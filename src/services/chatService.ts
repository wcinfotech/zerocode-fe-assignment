import { Message, Chat, PromptTemplate } from '../types';

class ChatService {
  private readonly CHATS_KEY = 'saved_chats';
  private readonly PROMPT_TEMPLATES_KEY = 'prompt_templates';

  async sendMessage(content: string): Promise<string> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Mock bot responses
    const responses = [
      'That\'s an interesting question! Let me think about that...',
      'I understand what you\'re asking. Here\'s my perspective on that topic.',
      'Great point! I can help you with that.',
      'Based on the information you\'ve provided, I would suggest the following approach.',
      'I appreciate you sharing that with me. Let me provide some insights.',
      'That\'s a complex topic. Let me break it down for you.',
      'I see what you mean. Here\'s how I would approach this situation.',
      'Thanks for the question! I have some thoughts on this matter.',
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  saveChat(chat: Chat): void {
    const chats = this.getSavedChats();
    const existingIndex = chats.findIndex(c => c.id === chat.id);
    
    if (existingIndex >= 0) {
      chats[existingIndex] = chat;
    } else {
      chats.push(chat);
    }
    
    localStorage.setItem(this.CHATS_KEY, JSON.stringify(chats));
  }

  getSavedChats(): Chat[] {
    const chatsStr = localStorage.getItem(this.CHATS_KEY);
    if (chatsStr) {
      try {
        return JSON.parse(chatsStr).map((chat: any) => ({
          ...chat,
          createdAt: new Date(chat.createdAt),
          updatedAt: new Date(chat.updatedAt),
          messages: chat.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
      } catch {
        return [];
      }
    }
    return [];
  }

  deleteChat(chatId: string): void {
    const chats = this.getSavedChats().filter(chat => chat.id !== chatId);
    localStorage.setItem(this.CHATS_KEY, JSON.stringify(chats));
  }

  getPromptTemplates(): PromptTemplate[] {
    const templatesStr = localStorage.getItem(this.PROMPT_TEMPLATES_KEY);
    if (templatesStr) {
      try {
        return JSON.parse(templatesStr);
      } catch {
        return this.getDefaultPromptTemplates();
      }
    }
    
    const defaultTemplates = this.getDefaultPromptTemplates();
    this.savePromptTemplates(defaultTemplates);
    return defaultTemplates;
  }

  savePromptTemplates(templates: PromptTemplate[]): void {
    localStorage.setItem(this.PROMPT_TEMPLATES_KEY, JSON.stringify(templates));
  }

  private getDefaultPromptTemplates(): PromptTemplate[] {
    return [
      {
        id: '1',
        title: 'Explain Concept',
        content: 'Please explain the concept of [TOPIC] in simple terms.',
        category: 'Learning'
      },
      {
        id: '2',
        title: 'Code Review',
        content: 'Can you review this code and suggest improvements?\n\n[CODE]',
        category: 'Development'
      },
      {
        id: '3',
        title: 'Meeting Summary',
        content: 'Summarize the key points from this meeting: [MEETING_NOTES]',
        category: 'Business'
      },
      {
        id: '4',
        title: 'Creative Writing',
        content: 'Write a creative story about [TOPIC] in [STYLE] style.',
        category: 'Creative'
      },
      {
        id: '5',
        title: 'Problem Solving',
        content: 'Help me solve this problem step by step: [PROBLEM]',
        category: 'General'
      }
    ];
  }
}

export const chatService = new ChatService();