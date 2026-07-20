import { create } from 'zustand';
import api from '@/lib/api';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  googleLogin: (tokenId: string) => Promise<void>;
  facebookLogin: (accessToken: string) => Promise<void>;
  setUser: (user: User) => void;
  setToken: (token: string, refreshToken: string) => void;
  loadUser: () => Promise<void>;
  completeProfile: (data: Record<string, unknown>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user, token, refreshToken } = res.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token, refreshToken, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (data) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/auth/register', data);
      const { user, token, refreshToken } = res.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token, refreshToken, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
  },

  updateProfile: async (data) => {
    set({ isLoading: true });
    try {
      const res = await api.put('/auth/profile', data);
      const user = res.data.data;
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  googleLogin: async (tokenId: string) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/auth/google', { tokenId });
      const { user, token, refreshToken } = res.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token, refreshToken, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  facebookLogin: async (accessToken: string) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/auth/facebook', { accessToken });
      const { user, token, refreshToken } = res.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token, refreshToken, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  setUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },

  setToken: (token: string, refreshToken: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    set({ token, refreshToken });
  },

  loadUser: async () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, token, refreshToken: localStorage.getItem('refreshToken'), isAuthenticated: true });
        const res = await api.get('/auth/me');
        const updatedUser = res.data.data;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        set({ user: updatedUser });
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
      }
    }
  },

  completeProfile: async (data: Record<string, unknown>) => {
    set({ isLoading: true });
    try {
      const res = await api.put('/auth/complete-profile', data);
      const user = res.data.data;
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));
