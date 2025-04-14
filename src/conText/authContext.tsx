import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  userId: number | null;
  setUserId: (id: number | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  userId: null,
  setUserId: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userId, setUserId] = useState<number | null>(5); // giả định mặc định userId = 1 khi đã đăng nhập

  return (
    <AuthContext.Provider value={{ userId, setUserId }}>
      {children}
    </AuthContext.Provider>
  );
};
