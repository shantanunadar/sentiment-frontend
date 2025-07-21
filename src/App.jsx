"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  TrendingUp,
  MessageSquare,
  Settings,
} from "lucide-react";
import Dashboard from "./components/Dashboard";
import MessageInput from "./components/MessageInput";
import MessageViewer from "./components/MessageViewer";
import AlertConfig from "./components/AlertConfig";
import RootCauseAnalysis from "./components/RootCauseAnalysis";
import "./index.css";

// API base URL - adjust this based on your backend deployment
const API_BASE_URL = process.env.VITE_API_URL || "http://localhost:8000";

function App() {
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({
    totalMessages: 0,
    averageScore: 0,
    dominantEmotion: "neutral",
    emotionDistribution: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch messages from backend
  const fetchMessages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/messages`);
      if (!response.ok) throw new Error("Failed to fetch messages");
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError(err.message);
    }
  };

  // Fetch sentiment stats from backend
  const fetchStats = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/analytics/sentiment-stats`
      );
      if (!response.ok) throw new Error("Failed to fetch stats");
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError(err.message);
    }
  };

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchMessages(), fetchStats()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Add new message via API
  const addMessage = async (messageData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: messageData.content,
          channel: messageData.channel,
        }),
      });

      if (!response.ok) throw new Error("Failed to add message");

      const newMessage = await response.json();

      // Update local state
      setMessages((prev) => [newMessage, ...prev]);

      // Refresh stats
      await fetchStats();

      return newMessage;
    } catch (err) {
      console.error("Error adding message:", err);
      throw err;
    }
  };

  const getDominantEmotionColor = (emotion) => {
    switch (emotion) {
      case "happy":
        return "bg-green-500";
      case "angry":
        return "bg-red-500";
      case "frustrated":
        return "bg-orange-500";
      case "confused":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-500 p-8 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              Loading Customer Sentiment Watchdog...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-blue-500 p-8 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Connection Error
            </h2>
            <p className="text-gray-600 mb-4">
              Unable to connect to the backend API
            </p>
            <p className="text-sm text-gray-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-500 p-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Customer Sentiment Watchdog
        </h1>
        <p className="text-gray-600">
          Monitor customer emotions and sentiment trends across all support
          channels
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">
                Total Messages
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {stats.totalMessages}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">
                Average Score
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {stats.averageScore}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-800">
                Dominant Emotion
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <Badge
                className={`${getDominantEmotionColor(
                  stats.dominantEmotion
                )} text-white`}
              >
                {stats.dominantEmotion}
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-800">
                Active Alerts
              </CardTitle>
              <Settings className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">2</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="input">Add Message</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="analysis">Root Cause</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard messages={messages} stats={stats} />
          </TabsContent>

          <TabsContent value="input">
            <MessageInput onAddMessage={addMessage} />
          </TabsContent>

          <TabsContent value="messages">
            <MessageViewer messages={messages} />
          </TabsContent>

          <TabsContent value="analysis">
            <RootCauseAnalysis messages={messages} />
          </TabsContent>

          <TabsContent value="alerts">
            <AlertConfig />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
