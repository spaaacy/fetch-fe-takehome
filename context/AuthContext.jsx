"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState();
  const [user, setUser] = useState();

  useEffect(() => {
    const checkSession = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dogs/breeds`, {
        credentials: "include",
      });
      if (response.ok) {
        const user = JSON.parse(localStorage.getItem("user"));
        setUser(user);
        setLoggedIn(user);
      } else {
        setLoggedIn(null);
      }
      setLoading(false);
    };
    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{ loading, loggedIn, setLoggedIn, user, setUser }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
