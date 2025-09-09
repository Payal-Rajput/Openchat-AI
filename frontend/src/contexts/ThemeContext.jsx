import React, { createContext, useContext, useState, useEffect } from "react";
import { THEME_CONFIG } from "../config/theme";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem(THEME_CONFIG.STORAGE_KEYS.DARK_MODE);
    return saved ? JSON.parse(saved) : false;
  });

  const [backgroundColor, setBackgroundColor] = useState(() => {
    const saved = localStorage.getItem(THEME_CONFIG.STORAGE_KEYS.BACKGROUND_COLOR);
    return saved || THEME_CONFIG.DEFAULT_BACKGROUND;
  });

  const [chatBackgroundColor, setChatBackgroundColor] = useState(() => {
    const saved = localStorage.getItem(THEME_CONFIG.STORAGE_KEYS.CHAT_BACKGROUND_COLOR);
    return saved || THEME_CONFIG.DEFAULT_CHAT_BACKGROUND;
  });

  useEffect(() => {
    localStorage.setItem(THEME_CONFIG.STORAGE_KEYS.DARK_MODE, JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem(THEME_CONFIG.STORAGE_KEYS.BACKGROUND_COLOR, backgroundColor);
  }, [backgroundColor]);

  useEffect(() => {
    localStorage.setItem(THEME_CONFIG.STORAGE_KEYS.CHAT_BACKGROUND_COLOR, chatBackgroundColor);
  }, [chatBackgroundColor]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const changeBackgroundColor = (color) => {
    setBackgroundColor(color);
  };

  const changeChatBackgroundColor = (color) => {
    console.log('changeChatBackgroundColor called with:', color);
    setChatBackgroundColor(color);
  };

  const value = {
    isDarkMode,
    toggleTheme,
    backgroundColor,
    changeBackgroundColor,
    chatBackgroundColor,
    changeChatBackgroundColor,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
