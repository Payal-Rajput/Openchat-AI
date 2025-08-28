import React, { useEffect, useState } from "react";
import { chatAPI } from "../services/api";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = "123"; // 👈 replace with real logged-in user ID

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await chatAPI.getChatHistory(userId);
        setHistory(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId]);

  if (loading) return <div className="p-6">Loading history...</div>;

  return (
    <div className="p-6 bg-gray-100 h-screen">
      <h2 className="text-2xl font-bold mb-4">Chat History</h2>
      <div className="space-y-4">
        {history.map((chat) => (
          <div
            key={chat._id}
            className="bg-white shadow rounded-lg p-4 border border-gray-200"
          >
            <p className="text-gray-700">
              <strong>You:</strong> {chat.userMessage}
            </p>
            <p className="text-gray-900 mt-2">
              <strong>AI:</strong> {chat.aiResponse}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              {new Date(chat.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;
