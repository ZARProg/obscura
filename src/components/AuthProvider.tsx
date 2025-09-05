"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Type User
interface User {
  username: string;
  email: string;
  dateOfBirth?: string;
  createdAt?: string;
  avatar?: string;
  bio?: string;
  subscription?: string;
  lastLogin?: string;
}

// Context Value
interface AuthContextValue {
  user: User | null;
  login: (email?: string) => void;
  logout: () => void;
  updateUser: (updatedFields: Partial<User>) => void;
}

// Create context
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.email && parsedUser.username) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem("user");
        }
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = (email?: string) => {
    const dummyUser: User = {
      username: "John Doe",
      email: email || "john@example.com",
      dateOfBirth: "1990-01-01",
      createdAt: new Date().toISOString(),
      subscription: "Free",
      lastLogin: new Date().toISOString(),
      bio: "",
    };
    setUser(dummyUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updatedFields: Partial<User>) => {
    setUser(prev => (prev ? { ...prev, ...updatedFields } : prev));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
