import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { api, setAuthToken } from '@/src/services/api';
import type { LoginPayload, RegisterPayload, ResetPasswordPayload, Usuario } from '@/src/types/auth';

const TOKEN_KEY = '@tasklist:token';
const USER_KEY = '@tasklist:user';

interface AuthContextData {
  user: Usuario | null;
  token: string | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  resetPassword: (payload: ResetPasswordPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarSessao() {
      try {
        const [tokenSalvo, userSalvo] = await Promise.all([
          AsyncStorage.getItem(TOKEN_KEY),
          AsyncStorage.getItem(USER_KEY),
        ]);

        if (tokenSalvo && userSalvo) {
          setAuthToken(tokenSalvo);
          setToken(tokenSalvo);
          setUser(JSON.parse(userSalvo));
        }
      } finally {
        setLoading(false);
      }
    }

    carregarSessao();
  }, []);

  async function salvarSessao(novoToken: string, novoUsuario: Usuario) {
    setAuthToken(novoToken);
    setToken(novoToken);
    setUser(novoUsuario);

    await Promise.all([
      AsyncStorage.setItem(TOKEN_KEY, novoToken),
      AsyncStorage.setItem(USER_KEY, JSON.stringify(novoUsuario)),
    ]);
  }

  async function limparSessao() {
    setAuthToken(null);
    setToken(null);
    setUser(null);

    await Promise.all([
      AsyncStorage.removeItem(TOKEN_KEY),
      AsyncStorage.removeItem(USER_KEY),
    ]);
  }

  async function login(payload: LoginPayload) {
    const response = await api.login(payload);
    await salvarSessao(response.token, response.user);
  }

  async function register(payload: RegisterPayload) {
    const response = await api.register(payload);
    await salvarSessao(response.token, response.user);
  }

  async function resetPassword(payload: ResetPasswordPayload) {
    const response = await api.resetPassword(payload);
    await salvarSessao(response.token, response.user);
  }

  async function logout() {
    try {
      if (token) {
        await api.logout();
      }
    } finally {
      await limparSessao();
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }

  return context;
}
