import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 🔹 Check auth status once when app loads
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await authAPI.getMe(); // sends cookie automatically
      if (response.status === 200 && response.data?.user) {
        const userData = response.data.user;
        // Ensure user has _id field for compatibility
        if (userData && userData.id && !userData._id) {
          userData._id = userData.id;
        }
        setIsAuthenticated(true);
        setUser(userData);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      // Don't log this error as it's expected when user is not logged in
      console.log("User not authenticated:", error.response?.status);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      // ✅ backend sets cookie automatically, so we just update state
      const userData = response.data.user;
      // Ensure user has _id field for compatibility
      if (userData && userData.id && !userData._id) {
        userData._id = userData.id;
      }
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true, user: userData };
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      return { success: true, message: response.data.message };
    } catch (error) {
      throw error;
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      const response = await authAPI.verifyOTP(email, otp);
      return { success: true, message: response.data.message };
    } catch (error) {
      throw error;
    }
  };

  const resendOTP = async (email) => {
    try {
      const response = await authAPI.resendOTP(email);
      return { success: true, message: response.data.message };
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout(); // clears cookie on backend
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear state locally
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    verifyOTP,
    resendOTP,
    logout,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div className="h-screen flex items-center justify-center">Loading...</div>}
    </AuthContext.Provider>
  );
};
