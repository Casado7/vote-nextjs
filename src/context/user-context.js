"use client";
import { createContext, useContext, useState, useEffect } from "react";

function getUserFromToken() {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
}

const UserContext = createContext({ user: null, setUser: () => {} });

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      // Intenta restaurar el usuario desde localStorage (persistencia instantánea)
      const stored = localStorage.getItem("_user");
      if (stored) return JSON.parse(stored);
    }
    return null;
  });

  // Sincroniza el usuario con el token y persiste en localStorage
  useEffect(() => {
    const tokenUser = getUserFromToken();
    setUser(tokenUser);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("_user");
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
