import React, { useState, useEffect, useRef } from "react";
import { chatAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const Chat = () => {
  const { user, isAuthenticated, loading: authLoading, checkAuthStatus, logout } = useAuth();
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
    <div className="flex h-[90vh] bg-gray-50  ">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} h-[90vh] fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}>
        <div className="flex flex-col h-[90vh]   ">
          {/* Header */}
          <div className="p-4 border-b border-gray-300 ">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Chat History</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <button
              onClick={startNewChat}
              className="w-full mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              + New Chat
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-2 ">
            {chatHistory.length === 0 ? (
              <p className="text-gray-500 text-center text-sm">No previous chats</p>
            ) : (
              <div className="space-y-2">
                {chatHistory.slice(0, 10).map((chat, index) => (
                  <button
                    key={chat._id || index}
                    onClick={() => loadChat(chat._id)}
                    className="w-full text-left p-2 rounded-lg hover:bg-gray-100 transition text-sm text-gray-700 truncate"
                  >
                    {chat.userMessage?.substring(0, 30)}...
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="p-4 border-t border-gray-300 ">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.username}</span>
              </div>
              <button
                onClick={logout}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-[90vh]  ">
        {/* Header */}


        {/* <div className="bg-blue-300 border-b border-gray-300 px-4 py-1 flex items-center justify-between ">
          <div className="flex items-center space-x-3 ">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
            >
              ☰
            </button>
            <h1 className="text-xl font-semibold text-gray-800">EchoMind Chat</h1>
          </div>
          <div className="text-xs text-gray-500">
            Auth: {isAuthenticated ? 'Yes' : 'No'} | User: {user?.username}
          </div>
        </div> */}





        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 ">
          {chats.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Welcome to EchoMind!</h3>
                <p className="text-gray-600">Start a conversation by typing a message below.</p>
              </div>
            </div>
          ) : (
            chats.map((chat) => (
              <div key={chat._id} className="space-y-4">
                {/* User Message */}
                <div className="flex justify-end">
                  {/* <div className="max-w-3xl px-4 py-2 rounded-xl bg-gray-600 text-white"> */}
                  <div className="max-w-3xl px-4 py-2 rounded-xl bg-blue-900  text-white">
                    <p className="text-sm">{chat.userMessage}</p>
                    <div className="text-xs text-gray-400 mt-1 text-right">
                      {new Date(chat.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                
                {/* AI Response */}
                {chat.aiResponse && (
                  <div className="flex justify-start">
                    <div className="max-w-3xl px-4 py-2 rounded-xl bg-gray-100 text-gray-800">
                      <p className="text-sm whitespace-pre-wrap">{chat.aiResponse}</p>
                      <div className="text-xs text-gray-500 mt-1 text-right">
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
        <div className=" border-t border-gray-300 p-2 ">
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
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !message.trim()}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send"}
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
