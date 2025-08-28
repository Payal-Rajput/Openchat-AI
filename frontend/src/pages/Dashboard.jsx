import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="h-[90vh] bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <nav className="bg-white/5 backdrop-blur-sm border-b border-white/10">

        <div className="max-w-7xl mx-auto px-6 py-4 ">
          <div className="flex justify-center items-center ">
            {/* <h1 className="text-2xl font-bold text-white">EchoMind Dashboard</h1> */}
            
              <span className="text-white/80 text-2xl font-bold  ">Welcome, {user?.username || 'User'}!</span>
             
           
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Info Card */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Profile Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/70">Username:</span>
                <span className="text-white font-medium">{user?.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Email:</span>
                <span className="text-white font-medium">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">User ID:</span>
                <span className="text-white font-medium">{user?.id}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button onClick={() => navigate('/chat')}   className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                Start New Chat
              </button>
              <button onClick={() => navigate('/history')} className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                View Chat History
              </button>
              <button onClick={() => navigate('/settings')}   className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                Settings
              </button>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mt-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/25 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Welcome to EchoMind!</h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Your AI-powered conversation companion. Start chatting, explore features, and make the most of your personalized experience.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
