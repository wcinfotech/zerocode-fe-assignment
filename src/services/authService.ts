import { User } from '../types';

interface AuthResponse {
  user: User;
  token: string;
}

// Mock authentication service - replace with real API calls
class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  async login(email: string, password: string): Promise<AuthResponse> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (email === 'demo@example.com' && password === 'password') {
      const user: User = {
        id: '1',
        email,
        name: 'Demo User',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400'
      };
      const token = 'mock_jwt_token_' + Date.now();
      
      this.storeAuth(user, token);
      return { user, token };
    }
    
    throw new Error('Invalid credentials');
  }

  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: Date.now().toString(),
      email,
      name,
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400'
    };
    const token = 'mock_jwt_token_' + Date.now();
    
    this.storeAuth(user, token);
    return { user, token };
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  getStoredAuth(): AuthResponse | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userStr = localStorage.getItem(this.USER_KEY);
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        return { user, token };
      } catch {
        this.logout();
      }
    }
    
    return null;
  }

  private storeAuth(user: User, token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }
}

export const authService = new AuthService();