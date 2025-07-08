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
      const stored = localStorage.getItem("_user");
      const img = localStorage.getItem("_user_img");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (img) parsed.imagen = img;
        return parsed;
      }
    }
    return null;
  });

  // Sincroniza el usuario con el token y persiste en localStorage
  useEffect(() => {
    const tokenUser = getUserFromToken();
    if (tokenUser && typeof window !== "undefined") {
      const img = localStorage.getItem("_user_img");
      if (img) tokenUser.imagen = img;
      setUser(tokenUser);
    }
    // Si no hay tokenUser pero hay _user en localStorage, ya está en el estado inicial
  }, []);

  useEffect(() => {
    if (user) {
      // Guardar imagen aparte si existe
      const { imagen, ...rest } = user;
      localStorage.setItem("_user", JSON.stringify(rest));
      if (imagen) {
        localStorage.setItem("_user_img", imagen);
      } else {
        localStorage.removeItem("_user_img");
      }
    } else {
      localStorage.removeItem("_user");
      localStorage.removeItem("_user_img");
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
