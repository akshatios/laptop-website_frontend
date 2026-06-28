import { createContext, useContext, useState, useCallback } from 'react';

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));

  const login = useCallback((tok) => {
    localStorage.setItem('admin_token', tok);
    setToken(tok);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('admin_token');
    setToken(null);
    window.location.href = '/login';
  }, []);

  return (
    <AuthCtx.Provider value={{ token, login, logout, isAuth: !!token }}>
      {children}
    </AuthCtx.Provider>
  );
}
