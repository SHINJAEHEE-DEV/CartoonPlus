import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminUser } from '../types/domain';
import { INITIAL_ADMIN_USERS } from '../data/seedData';

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'cp_auth_user_v1';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const login = (username: string, password: string): boolean => {
    // Mock authentication: passwords "1234" or matching username
    const targetUser = INITIAL_ADMIN_USERS.find(
      u => u.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (targetUser && (password === '1234' || password === 'admin1234')) {
      setUser(targetUser);
      return true;
    }
    
    // Default fallback for any staff test
    if (username.trim() && password === '1234') {
      const fallbackUser: AdminUser = {
        id: `admin-${Date.now()}`,
        storeId: username.includes('jamsil') ? 'jamsil' : 'snu',
        username: username.trim(),
        role: username.toLowerCase().includes('admin') ? 'ADMIN' : 'STAFF',
      };
      setUser(fallbackUser);
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
