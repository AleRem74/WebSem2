import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getToken, saveToken, clearToken } from '../utils/localStorageUtils';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  isAuthenticated: boolean;
  userName: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(getToken());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token); // !!token преобразует токен в boolean (true если есть, false если null)
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    setIsAuthenticated(!!token); // Обновляем isAuthenticated при изменении токена
    if (token) {
      try {
        const decodedToken: { username?: string } = jwtDecode(token);
        setUserName(decodedToken.username || 'Пользователь');
      } catch (error) {
        console.error('Ошибка при декодировании токена:', error);
        setUserName(null);
      }
    } else {
      setUserName(null);
    }
  }, [token]);

  const login = (newToken: string) => {
    saveToken(newToken); // Сохраняем токен в localStorage
    setTokenState(newToken); // Обновляем состояние токена в контексте, что вызовет перерендер компонентов, подписанных на контекст
  };

  const logout = () => {
    clearToken();
    setTokenState(null); // Обновляем состояние токена в контексте
  };

  const value: AuthContextType = {
    isAuthenticated,
    userName,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
