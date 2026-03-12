import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiClient } from '../services/apiClient';

const AuthContext = createContext(null);

const STORAGE_KEY = 'readscope_token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => window.localStorage.getItem(STORAGE_KEY) || '');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Keep the session in sync with the backend so refreshes stay authenticated.
    apiClient(token)
      .get('/auth/me')
      .then((response) => {
        setUser(response.data);
      })
      .catch(() => {
        setUser(null);
        setToken('');
        window.localStorage.removeItem(STORAGE_KEY);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      login: (nextToken) => {
        setToken(nextToken);
        window.localStorage.setItem(STORAGE_KEY, nextToken);
      },
      logout: () => {
        setUser(null);
        setToken('');
        window.localStorage.removeItem(STORAGE_KEY);
      },
    }),
    [token, user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

