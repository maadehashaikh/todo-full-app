import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axiosInstance.get(`/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data.user);
          setIsAuthenticated(true);
        } catch (error) {
          console.error(
            "Error checking authentication:",
            error.response?.data || error.message
          );
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post("/login", { email, password });
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      setIsAuthenticated(true); // User is authenticated after login
      setUser(user);
      return { success: true };
    } catch (error) {
      setIsAuthenticated(false); // User is authenticated after login
      console.error("Login error:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const signUp = async (name, email, password) => {
    try {
      const response = await axiosInstance.post("/signup", {
        name,
        email,
        password,
      });
      return { success: true, message: "Sign-up successful" };
    } catch (error) {
      console.error("Sign-up error:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Sign-up failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false); // User is no longer authenticated
    delete axiosInstance.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{ user, login, isAuthenticated, signUp, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
