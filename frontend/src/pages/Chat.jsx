import React, { useState, useEffect, useRef } from "react";
import { chatAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

const Chat = () => {
  const { user, isAuthenticated, loading: authLoading, checkAuthStatus, logout } = useAuth();
  const { isDarkMode, chatBackgroundColor } = useTheme();
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);

  // Debug authentication state - remove in production
  // console.log("Chat Component - Auth State:", { isAuthenticated, user, authLoading });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchChatHistory();
    }
  }, [isAuthenticated, user]);

  const fetchChatHistory = async () => {
    try {
      const res = await chatAPI.getChatHistory();
      // Handle different response structures
      let chatData = [];
      if (Array.isArray(res.data)) {
        chatData = res.data;
      } else if (res.data && Array.isArray(res.data.data)) {
        chatData = res.data.data;
      } else if (res.data && typeof res.data === 'object') {
        // If it's an object, try to find the array
        const keys = Object.keys(res.data);
        for (const key of keys) {
          if (Array.isArray(res.data[key])) {
            chatData = res.data[key];
            break;
          }
        }
      }
      setChats(chatData);
      setChatHistory(chatData);
    } catch (error) {
      console.error("Error fetching chat history:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
      }
    }
  };

  const sendMessage = async () => {
    // Wait for authentication to be checked
    if (authLoading) {
      alert("Please wait while we check your authentication status...");
      return;
    }
    
    if (!isAuthenticated || !user?.id) {
      alert("Please login first!");
      return;
    }
    if (!message.trim()) return;

    setLoading(true);
    try {
      const res = await chatAPI.createChat({
        message,
      });

      // Add both user message and AI response to chat
      const newChat = {
        _id: res.data.id,
        userId: user.id,
        userMessage: message, // User message
        aiResponse: res.data.aiResponse, // AI response
        timestamp: new Date()
      };

      setChats((prev) => [...prev, newChat]);
      setMessage("");
    } catch (error) {
      console.error("Error creating chat:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
      } else {
        alert("Error sending message. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = () => {
    setChats([]);
    setMessage("");
  };

  const loadChat = (chatId) => {
    // For now, just reload all chats
    // In a real app, you'd load specific chat by ID
    fetchChatHistory();
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-gray-600">
        Loading authentication status...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-gray-600">
        Please login to access the chat.
      </div>
    );
  }

  return (
    <div className="flex h-[88vh] transition-all duration-500 ">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} h-[90vh] fixed inset-y-0 left-0 z-50 w-64 backdrop-blur-xl bg-black dark:bg-gray-800/80 shadow-2xl border-r border-white/20 dark:border-gray-700/50 transform transition-all duration-500 ease-in-out lg:relative lg:translate-x-0`}>
        <div className="flex flex-col h-[90vh]">
                     {/* Header */}
           <div className="p-4 border-b border-white/20 dark:border-gray-600/50">
             <div className="flex items-center justify-between">
               <h2 className="text-lg font-semibold text-white dark:text-white">Chat History</h2>
               <button
                 onClick={() => setSidebarOpen(false)}
                 className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/20 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
               >
                 ✕
               </button>
             </div>
             <button
               onClick={startNewChat}
               className="w-full mt-3 px-4 py-3 bg-gradient-to-r from-gray-600 to-zinc-800 dark:from-blue-700 dark:to-purple-700 text-white rounded-xl hover:from-gray-700  hover:to-zinc-900 dark:hover:from-blue-800 dark:hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
             >
              <i class="ri-sparkling-fill"></i> New Chat
             </button>
           </div>

                                           {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-2 5 custom-scrollbar">
              {chatHistory.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">💬</div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No previous chats</p>
                </div>
              ) : (
                <div className="space-y-2 ">
                  {chatHistory.slice(0, 10).map((chat, index) => (
                    <button
                      key={chat._id || index}
                      onClick={() => loadChat(chat._id)}
                      className="w-full text-left p-3 rounded-xl hover:bg-zinc-900 dark:hover:bg-gray-700/50 transition-all duration-300 text-sm text-white dark:text-gray-300 truncate border border-transparent hover:border-white/20 dark:hover:border-gray-600/50"
                    >
                      {chat.userMessage?.substring(0, 30)}...
                    </button>
                  ))}
                </div>
              )}
            </div>

                                           {/* User Info */}
            <div className="p-4 border-t border-white/10 dark:border-gray-600/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-zinc-500 to-gray-900 dark:from-blue-700 dark:to-purple-700 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-lg">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-white dark:text-gray-300 block">{user?.username}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-400">Online</span>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="text-sm text-gray-400 hover:text-gray-200 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-300 p-2  dark:hover:bg-red-900/20 rounded-lg"
                >
                  <i class="ri-logout-circle-line"></i>  Logout
                </button>
              </div>
            </div>
        </div>
      </div>

                           {/* Main Chat Area */}
        <div 
          className="flex-1 flex flex-col h-[90vh] backdrop-blur-sm"
          style={{ backgroundColor: chatBackgroundColor }}
        >
       


      


                                   {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black custom-scrollbar">
            {chats.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-6xl text-white mb-4 animate-bounce"> <i class="ri-sparkling-2-fill"></i> </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r text-white  bg-clip-text text-transparent mb-2">Welcome to EchoMind!</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">Start a conversation by typing a message below.</p>
                  <div className="mt-4 flex justify-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            ) : (
              chats.map((chat) => (

                <div key={chat._id} className="space-y-4">
                  {/* User Message */}

                  <div className="flex justify-end">
                    <div className="max-w-3xl px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-black dark:from-blue-700 dark:to-purple-700 text-white shadow-lg backdrop-blur-sm">
                      <p className="text-sm">{chat.userMessage}</p>
                      <div className="text-xs text-blue-200 mt-2 text-right">
                        {new Date(chat.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  
                  {/* AI Response */}
                  {chat.aiResponse && (
                    <div className="flex justify-start">
                      <div className="max-w-3xl px-6 py-3 rounded-2xl  bg-zinc-900 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 shadow-lg backdrop-blur-sm border border-white/20 dark:border-gray-700/50">
                        <p className="text-sm whitespace-pre-wrap text-white">{chat.aiResponse}</p>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
                          {new Date(chat.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

                                   {/* Input Area */}
          <div className="border-t border-white/20 dark:border-gray-600/50 p-3 backdrop-blur-xl bg-black dark:bg-gray-800/80">
            <div className="flex items-center space-x-3 max-w-4xl mx-auto">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Type your message..."
                className="flex-1 px-6 py-3 border border-white/30 dark:border-gray-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/35 focus:border-transparent bg-black dark:bg-gray-700/50 text-gray-300 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 backdrop-blur-sm shadow-lg"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !message.trim()}
                className="px-8 py-4 bg-zinc-800   text-white rounded-2xl  hover:bg-zinc-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 ">
                    <span className="text-white font-bold">Send</span>
                    <span><i class="ri-send-plane-fill"></i></span>
                  </div>
                )}
              </button>
            </div>
          </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Chat;
