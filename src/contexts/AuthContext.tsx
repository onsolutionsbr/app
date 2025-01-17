import React, { createContext, useContext, useState } from 'react';
import { User, UserType } from '../types/user';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  async function login(email: string, password: string): Promise<User> {
    try {
      setLoading(true);
      // Hardcoded admin credentials for testing
      if (email === 'admin@admin.com' && password === 'admin123') {
        const adminUser: User = {
          id: '1',
          email: 'admin@admin.com',
          userType: UserType.ADMIN
        };
        setCurrentUser(adminUser);
        return adminUser;
      }
      throw new Error('Invalid credentials');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setCurrentUser(null);
  }

  const value = {
    currentUser,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}