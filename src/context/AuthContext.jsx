import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../utils/api';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser]   = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(true);

  const api = axios.create({ baseURL: API_URL });

  // Attach token for every request
  api.interceptors.request.use(config => {
    const t = localStorage.getItem('token');
    if (t) config.headers.Authorization = `Bearer ${t}`;
    return config;
  });

  useEffect(() => {
    async function boot() {
      try {
        if (!token) return;
        const { data } = await api.get('/auth/me');
        setUser(data);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    }
    boot();
  }, []); // once

  function saveSession(tk, usr) {
    localStorage.setItem('token', tk);
    localStorage.setItem('user', JSON.stringify(usr));
    setToken(tk);
    setUser(usr);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    saveSession(data.token, data.user);
  }
  async function register(name, email, password) {
    const { data } = await api.post('/auth/register', { name, email, password });
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
