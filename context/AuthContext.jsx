'use client'

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState();

  useEffect(() => {
    const checkSession = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dogs/breeds`, {
        credentials: "include",
      });
      if (response.ok) {
        console.log(await response.json())
        setLoggedIn({ name: "Restored", email: "session@example.com" });
      } else {
        setLoggedIn(null);
      }
    };
    checkSession();
  }, []);

  return <AuthContext.Provider value={{ loggedIn, setLoggedIn }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
