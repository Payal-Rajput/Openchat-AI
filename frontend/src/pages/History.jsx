import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { chatAPI } from "../services/api";

const History = () => {
  const { user, isAuthenticated } = useAuth();
  const { isDarkMode } = useTheme();
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchChatHistory();
    }
  }, [isAuthenticated, user]);

  const fetchChatHistory = async () => {
    try {
      setLoading(true);
      const res = await chatAPI.getChatHistory();
      
      // Handle different response structures
      let chatData = [];
      if (Array.isArray(res.data)) {
        chatData = res.data;
      } else if (res.data && Array.isArray(res.data.data)) {
        chatData = res.data.data;
      } else if (res.data && typeof res.data === 'object') {
        const keys = Object.keys(res.data);
        for (const key of keys) {
          if (Array.isArray(res.data[key])) {
            chatData = res.data[key];
            break;
          }
        }
      }
      
      setChatHistory(chatData);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getChatPreview = (userMessage) => {
    return userMessage?.length > 50 ? userMessage.substring(0, 50) + '...' : userMessage;
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-gray-600 dark:text-gray-400">
        Please login to access the history.
      </div>
    );
  }

  return (
    <div className="h-[89vh] bg-black dark:bg-gray-900 transition-all duration-500">
      {/* Fixed Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/80 dark:bg-gray-800/80 shadow-2xl border-b border-white/20 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4 ">
            <h1
              className="text-red-700 absolute left-5 top-8 text-2xl cursor-pointer"
              onClick={() => window.location.href = '/dashboard'}
            >
              <i className="ri-arrow-left-long-line"></i>
            </h1>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">📚 Chat History</h1>
              <p className="text-zinc-300 dark:text-gray-400 text-lg">View all your conversations</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-white  bg-zinc-800 dark:bg-gray-700/50 px-4 py-2 rounded-full backdrop-blur-sm">
                Total Chats: {chatHistory.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with top padding for fixed nav */}
      <div className="pt-10 max-h-[89vh] pb-8 ">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading chat history...</p>
              </div>
            </div>
          ) : chatHistory.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No Chat History</h3>
              <p className="text-gray-600 dark:text-gray-400">Start a conversation to see your chat history here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
              {/* Chat List */}
              <div className="lg:col-span-1 ">
                <div className="bg-zinc-900  rounded-lg shadow-lg overflow-hidden">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-white ">Recent Chats</h2>
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    {chatHistory.map((chat) => (
                      <button
                        key={chat._id}
                        onClick={() => setSelectedChat(chat)}
                        className={`w-full text-left p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-zinc-800 dark:hover:bg-gray-700 transition-colors ${
                          selectedChat?._id === chat._id ? ' dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-blue-600 dark:bg-blue-700 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                            {user?.username?.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-300  truncate">
                              {getChatPreview(chat.userMessage)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {formatDate(chat.timestamp)}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>


              {/* Chat Details */}
              <div className="lg:col-span-2">

                {selectedChat ? (
                  <div className="bg-zinc-900/70 backdrop-blur-sm border border-white/10  rounded-lg shadow-lg overflow-hidden ">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <h2 className="text-lg font-semibold text-white dark:text-white">Chat Details</h2>
                      <p className="text-sm text-gray-400 dark:text-gray-400">
                        {formatDate(selectedChat.timestamp)}
                      </p>
                    </div>

                    <div className="h-[70vh] overflow-y-auto p-6 space-y-4 bg-zinc-900/10  backdrop-blur-sm border border-white/10 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                      {/* User Message */}
                      <div className="flex justify-end ">
                        <div className="max-w-2xl px-4 py-3 rounded-xl bg-zinc-800  text-white">
                          <p className="text-sm">{selectedChat.userMessage}</p>
                          <div className="text-xs text-gray-400 mt-1 text-right">
                            {formatDate(selectedChat.timestamp)}
                          </div>
                        </div>
                      </div>
                      
                      {/* AI Response */}
                      {selectedChat.aiResponse && (
                        <div className="flex justify-start  ">
                          <div className="max-w-2xl px-4 py-3 rounded-xl bg-zinc-800 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                            <p className="text-sm text-white whitespace-pre-wrap">{selectedChat.aiResponse}</p>
                            <div className="text-xs text-gray-400  mt-1 text-right">
                              {formatDate(selectedChat.timestamp)}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                ) : (
                  <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg p-8 text-center">
                    <div className="text-4xl mb-4">💬</div>
                    <h3 className="text-lg font-semibold text-white  mb-2">Select a Chat</h3>
                    <p className="text-white ">Choose a conversation from the list to view its details.</p>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
