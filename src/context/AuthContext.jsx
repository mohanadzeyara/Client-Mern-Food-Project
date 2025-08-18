import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });

  useEffect(() => {
    async function load() {
      try {
        if (token) {
          const { data } = await api.get('/auth/me');
          setUser(data);
          localStorage.setItem('user', JSON.stringify(data));
        }
      } catch (e) {
        console.error(e);
        logout();
      } finally {
        setLoading(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  function saveSession(tok, usr) {
    setToken(tok);
    setUser(usr);
    localStorage.setItem('token', tok);
    localStorage.setItem('user', JSON.stringify(usr));
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  async function login(email, password) {
    const { data } = await axios.post((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/auth/login', { email, password });
    saveSession(data.token, data.user);
  }

  async function register(name, email, password) {
    const { data } = await axios.post((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/auth/register', { name, email, password });
    saveSession(data.token, data.user);
  }

  return (
    <AuthCtx.Provider value={{ api, user, token, login, register, logout, loading, setUser }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
