import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { redirect, RedirectType } from 'next/navigation';
import React, { createContext, useContext, ReactNode } from 'react';
import useSWR from 'swr';

interface User {
  sub: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user?: User;
  login: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data, mutate } = useSWR<User>(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
    async (url) => {
      const token = getCookie('access_token');
      if (!token) throw new Error();
      const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      return await response.json();
    },
    { revalidateOnFocus: false, onError: () => deleteCookie('access_token') },
  );

  const login = async (username: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/sign-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });

    if (response.ok) {
      const { access_token } = await response.json();
      setCookie('access_token', access_token);
      mutate();
      redirect('/dashboard', RedirectType.push);
    }
  };

  const logout = () => {
    deleteCookie('access_token');
    mutate();
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!data?.username, user: data, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
