import React, { createContext, useContext, useState, useEffect } from "react";

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
    const saved = localStorage.getItem('isDarkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [backgroundColor, setBackgroundColor] = useState(() => {
    const saved = localStorage.getItem('backgroundColor');
    return saved || '#f9fafb'; // Default light gray
  });

  const [chatBackgroundColor, setChatBackgroundColor] = useState(() => {
    const saved = localStorage.getItem('chatBackgroundColor');
    return saved || '#ffffff'; // Default white
  });

  useEffect(() => {
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('backgroundColor', backgroundColor);
  }, [backgroundColor]);

  useEffect(() => {
    localStorage.setItem('chatBackgroundColor', chatBackgroundColor);
  }, [chatBackgroundColor]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const changeBackgroundColor = (color) => {
    setBackgroundColor(color);
  };

  const changeChatBackgroundColor = (color) => {
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
