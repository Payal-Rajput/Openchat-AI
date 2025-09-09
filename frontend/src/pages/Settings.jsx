import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import ColorWheelPicker from "../components/ColorWheelPicker";
import { validateHexColor, normalizeHexColor } from "../config/theme";

const Settings = () => {
  const { user, logout } = useAuth();
  const { 
    isDarkMode, 
    toggleTheme, 
    backgroundColor, 
    changeBackgroundColor,
    chatBackgroundColor,
    changeChatBackgroundColor 
  } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  const backgroundColors = [
    { name: 'Default', value: '#f9fafb' },
    { name: 'Light Blue', value: '#eff6ff' },
    { name: 'Light Green', value: '#f0fdf4' },
    { name: 'Light Purple', value: '#faf5ff' },
    { name: 'Light Pink', value: '#fdf2f8' },
    { name: 'Light Yellow', value: '#fefce8' },
    { name: 'Dark Blue', value: '#1e3a8a' },
    { name: 'Dark Green', value: '#14532d' },
    { name: 'Dark Purple', value: '#581c87' },
    { name: 'Dark Gray', value: '#374151' },
  ];

  const chatBackgroundColors = [
    { name: 'White', value: '#ffffff' },
    { name: 'Light Gray', value: '#f9fafb' },
    { name: 'Light Blue', value: '#eff6ff' },
    { name: 'Light Green', value: '#f0fdf4' },
    { name: 'Light Purple', value: '#faf5ff' },
    { name: 'Light Pink', value: '#fdf2f8' },
    { name: 'Dark Gray', value: '#374151' },
    { name: 'Dark Blue', value: '#1e3a8a' },
    { name: 'Dark Green', value: '#14532d' },
    { name: 'Dark Purple', value: '#581c87' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleNewChat = () => {
    navigate('/chat');
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: <i class="ri-user-fill"></i> },
    { id: 'theme', name: 'Theme', icon: <i class="ri-palette-fill"></i> },
    { id: 'background', name: 'Background', icon: <i class="ri-image-fill"></i> },
    { id: 'actions', name: 'Actions', icon: <i class="ri-settings-2-fill"></i> },
  ];

  return (
    <div className="h-[88vh] bg-black transition-all duration-500 overflow-hidden">
      <div className="h-full max-w-4xl mx-auto p-6">
        <div className="h-full backdrop-blur-xl bg-black dark:bg-gray-800/80 rounded-2xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700/50 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-black-600 via-zinc-800 to-black px-6 py-6">
            <h1 className="text-3xl font-bold text-white mb-2"><i class="ri-settings-2-fill"></i> Settings</h1>
            <p className="text-blue-100 text-lg text-white">Customize your EchoMind experience</p>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 bg-black dark:bg-gray-700/50 border-r border-white/20 dark:border-gray-600/50 backdrop-blur-sm flex-shrink-0">
              <nav className="p-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl mb-2 transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-zinc-900 dark:from-blue-900/50 dark:to-purple-900/50 text-gray-700 dark:text-blue-300 shadow-lg'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-zinc-900  hover:shadow-md'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="font-medium text-gray-400">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white dark:text-white">Profile Information</h2>
                  
                                     <div className="backdrop-blur-sm bg-white/500 dark:bg-gray-700/50 rounded-2xl p-6 border border-white/20 dark:border-gray-600/50">
                     <div className="flex items-center space-x-4 mb-4">
                       <div className="w-16 h-16 bg-gradient-to-r from-zinc-500 to-gray-900 dark:from-blue-700 dark:to-purple-700 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                         {user?.username?.charAt(0).toUpperCase()}
                       </div>
                       <div>
                         <h3 className="text-lg font-semibold text-gray-800 text-zinc-300">{user?.username}</h3>
                         <p className="text-gray-500 dark:text-gray-300">{user?.email}</p>
                       </div>
                     </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 dark:text-gray-300 mb-2">
                          Username
                        </label>
                        <input
                          type="text"
                          value={user?.username || ''}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-zinc-900 dark:bg-gray-600 text-gray-500 dark:text-gray-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 dark:text-gray-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-zinc-900 dark:bg-gray-600 text-gray-500 dark:text-gray-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Theme Tab */}
              {activeTab === 'theme' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white dark:text-white">Theme Settings</h2>
                  
                  {/* Live Preview */}
                  <div className="bg-zinc-800 dark:bg-gray-600 rounded-lg p-4 border border-white/20">
                    <h3 className="text-lg font-medium text-white mb-3">Live Preview</h3>
                    <div 
                      className="w-full h-32 rounded-lg border-2 border-white/30 transition-all duration-500"
                      style={{ backgroundColor: chatBackgroundColor }}
                    >
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="text-2xl mb-2">💬</div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                            Chat Preview
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 text-center">
                      This shows how your chat area will look
                    </p>
                  </div>
                  
                  <div className="bg-zinc-900 dark:bg-gray-700 rounded-lg p-6">
                    {/* <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-400 dark:text-white">Dark Mode</h3>
                        <p className="text-gray-500 dark:text-gray-300">Switch between light and dark themes</p>
                      </div>
                      <button
                        onClick={toggleTheme}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <span>{isDarkMode ? '☀️' : '🌙'}</span>
                        <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                      </button>
                    </div> */}
                    
                    <div className="mt-6">
                      <h4 className="text-md font-medium text-zinc-400 dark:text-white mb-3">Chat Background Color</h4>
                      
                      {/* Color Wheel Picker */}
                      <div className="flex justify-center mb-4">
                        <div className="scale-75">
                          <ColorWheelPicker
                            onColorSelect={changeChatBackgroundColor}
                            selectedColor={chatBackgroundColor}
                            // title="Choose Chat Background Color"
                          />
                        </div>
                      </div>
                      
                      {/* Quick Preset Colors */}
                      {/* <div className="mt-4">
                        <h5 className="text-sm font-medium text-gray-400 dark:text-gray-300 mb-3">Quick Presets</h5>
                        <div className="grid grid-cols-5 gap-3">
                          {chatBackgroundColors.map((color) => (
                            <button
                              key={color.value}
                              onClick={() => changeChatBackgroundColor(color.value)}
                              className={`w-12 h-12 rounded-lg border-2 transition-all ${
                                chatBackgroundColor === color.value
                                  ? 'border-blue-500 scale-110'
                                  : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                              }`}
                              style={{ backgroundColor: color.value }}
                              title={color.name}
                            />
                          ))}
                        </div>
                      </div> */}
                      
                      {/* Custom Color Input */}
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-400 dark:text-gray-300 mb-2">
                          Custom Color (Hex)
                        </label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={chatBackgroundColor}
                            onChange={(e) => changeChatBackgroundColor(e.target.value)}
                            className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={chatBackgroundColor}
                            onChange={(e) => {
                              const normalizedColor = normalizeHexColor(e.target.value);
                              if (validateHexColor(normalizedColor)) {
                                changeChatBackgroundColor(normalizedColor);
                              }
                            }}
                            placeholder="#ffffff"
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-zinc-900 dark:bg-gray-600 text-gray-300 dark:text-gray-300 font-mono text-sm"
                          />
                          <button
                            onClick={() => changeChatBackgroundColor('#ffffff')}
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors text-sm"
                          >
                            Reset
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Background Tab */}
              {activeTab === 'background' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white dark:text-white">Background Settings</h2>
                  
                  <div className="bg-zinc-900 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-300 dark:text-white mb-4">Main Background Color</h3>
                    <p className="text-gray-300 dark:text-gray-300 mb-4">Choose a background color for the main application</p>
                    
                    <div className="grid grid-cols-5 gap-3">
                      {backgroundColors.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => changeBackgroundColor(color.value)}
                          className={`w-12 h-12 rounded-lg border-2 transition-all ${
                            backgroundColor === color.value
                              ? 'border-blue-500 scale-110'
                              : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                    
                    <div className="mt-4">
                      <button
                        onClick={() => changeBackgroundColor('#f9fafb')}
                        className="px-4 py-2 bg-black dark:bg-gray-600 text-gray-300 dark:text-gray-300 rounded-lg hover:bg-zinc-800 dark:hover:bg-gray-500 transition-colors"
                      >
                        Reset to Default
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions Tab */}
              {activeTab === 'actions' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white dark:text-white">Quick Actions</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={handleNewChat}
                      className="p-6 bg-zinc-900 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg hover:bg-black dark:hover:bg-blue-900/30 transition-colors text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl text-white"><i class="ri-cloud-fill"></i></span>
                        <div>
                          <h3 className="font-semibold text-white dark:text-blue-300">Start New Chat</h3>
                          <p className="text-zinc-400 dark:text-blue-400 text-sm">Begin a fresh conversation</p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => navigate('/history')}
                      className="p-6 bg-zinc-900 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg hover:bg-black dark:hover:bg-green-900/30 transition-colors text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl text-white"><i class="ri-book-open-fill"></i></span>
                        <div>
                          <h3 className="font-semibold text-white dark:text-green-300">View History</h3>
                          <p className="text-zinc-400 dark:text-green-400 text-sm">See your chat history</p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => navigate('/dashboard')}
                      className="p-6 bg-zinc-900 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg hover:bg-black dark:hover:bg-purple-900/30 transition-colors text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl text-white"><i class="ri-dashboard-fill"></i></span>
                        <div>
                          <h3 className="font-semibold text-white dark:text-purple-300">Dashboard</h3>
                          <p className="text-zinc-400 dark:text-purple-400 text-sm">View your statistics</p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="p-6 bg-zinc-900 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg hover:bg-black dark:hover:bg-red-900/30 transition-colors text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl text-white"><i class="ri-logout-circle-fill"></i></span>
                        <div>
                          <h3 className="font-semibold text-white dark:text-red-300">Logout</h3>
                          <p className="text-zinc-400 dark:text-red-400 text-sm">Sign out of your account</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;