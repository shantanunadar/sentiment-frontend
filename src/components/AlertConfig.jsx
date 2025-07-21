"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Bell, Mail, Loader2 } from "lucide-react";

const API_BASE_URL = process.env.VITE_API_URL || "http://localhost:8000";

export default function AlertConfig() {
  const [alerts, setAlerts] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [emailSettings, setEmailSettings] = useState({
    recipients: "cx-team@company.com, support-lead@company.com",
    enabled: true,
  });

  // Fetch alert configurations from backend
  const fetchAlertConfigs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/alerts/config`);
      if (!response.ok) throw new Error("Failed to fetch alert configs");
      const data = await response.json();

      // Transform backend response to frontend format
      const transformedAlerts = data.configs.map((config) => ({
        emotion: config.emotion_type,
        threshold: config.threshold,
        timeWindow: config.time_window,
        enabled: config.enabled,
      }));

      setAlerts(transformedAlerts);
    } catch (err) {
      console.error("Error fetching alert configs:", err);
      setError(err.message);
    }
  };

  // Fetch recent alerts from backend
  const fetchRecentAlerts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/alerts`);
      if (!response.ok) throw new Error("Failed to fetch recent alerts");
      const data = await response.json();
      setRecentAlerts(data.alerts || []);
    } catch (err) {
      console.error("Error fetching recent alerts:", err);
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchAlertConfigs(), fetchRecentAlerts()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const addAlert = () => {
    const newAlert = {
      emotion: "neutral",
      threshold: 5,
      timeWindow: 15,
      enabled: true,
    };
    setAlerts([...alerts, newAlert]);
  };

  const updateAlert = async (index, field, value) => {
    const updatedAlerts = [...alerts];
    updatedAlerts[index] = { ...updatedAlerts[index], [field]: value };
    setAlerts(updatedAlerts);

    // Save to backend
    await saveAlertConfig(updatedAlerts[index]);
  };

  const removeAlert = (index) => {
    setAlerts(alerts.filter((_, i) => i !== index));
  };

  const saveAlertConfig = async (alertConfig) => {
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/alerts/config`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emotion_type: alertConfig.emotion,
          threshold: alertConfig.threshold,
          time_window: alertConfig.timeWindow,
          enabled: alertConfig.enabled,
        }),
      });

      if (!response.ok) throw new Error("Failed to save alert config");
    } catch (err) {
      console.error("Error saving alert config:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const getEmotionColor = (emotion) => {
    switch (emotion) {
      case "angry":
        return "bg-red-100 text-red-800";
      case "frustrated":
        return "bg-orange-100 text-orange-800";
      case "confused":
        return "bg-yellow-100 text-yellow-800";
      case "happy":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading alert configurations...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Alert Settings
          </CardTitle>
          <CardDescription>
            Configure email notifications for sentiment alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={emailSettings.enabled}
              onCheckedChange={(enabled) =>
                setEmailSettings({ ...emailSettings, enabled })
              }
            />
            <label className="text-sm font-medium">Enable email alerts</label>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Recipients</label>
            <Input
              value={emailSettings.recipients}
              onChange={(e) =>
                setEmailSettings({
                  ...emailSettings,
                  recipients: e.target.value,
                })
              }
              placeholder="Enter email addresses separated by commas"
              disabled={!emailSettings.enabled}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Separate multiple email addresses with commas
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Alert Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Alert Rules
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          </CardTitle>
          <CardDescription>
            Configure when to trigger alerts based on sentiment patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={getEmotionColor(alert.emotion)}>
                    {alert.emotion} sentiment alert
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={alert.enabled}
                      onCheckedChange={(enabled) =>
                        updateAlert(index, "enabled", enabled)
                      }
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAlert(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Emotion
                    </label>
                    <Select
                      value={alert.emotion}
                      onValueChange={(value) =>
                        updateAlert(index, "emotion", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="angry">Angry</SelectItem>
                        <SelectItem value="frustrated">Frustrated</SelectItem>
                        <SelectItem value="confused">Confused</SelectItem>
                        <SelectItem value="neutral">Neutral</SelectItem>
                        <SelectItem value="happy">Happy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Threshold
                    </label>
                    <Input
                      type="number"
                      value={alert.threshold}
                      onChange={(e) =>
                        updateAlert(
                          index,
                          "threshold",
                          Number.parseInt(e.target.value)
                        )
                      }
                      min="1"
                      max="50"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Number of messages
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Time Window
                    </label>
                    <Input
                      type="number"
                      value={alert.timeWindow}
                      onChange={(e) =>
                        updateAlert(
                          index,
                          "timeWindow",
                          Number.parseInt(e.target.value)
                        )
                      }
                      min="5"
                      max="120"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Minutes
                    </p>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
                  <strong>Rule:</strong> Trigger alert when more than{" "}
                  {alert.threshold} messages with "{alert.emotion}" sentiment
                  are received within {alert.timeWindow} minutes.
                </div>
              </div>
            ))}

            <Button
              onClick={addAlert}
              variant="outline"
              className="w-full bg-transparent"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Alert Rule
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>
            History of triggered sentiment alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAlerts.length > 0 ? (
              recentAlerts.map((alert, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge className={getEmotionColor(alert.emotion_type)}>
                        {alert.emotion_type}
                      </Badge>
                      <span className="text-sm font-medium">
                        {alert.summary}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {alert.message_count} messages in {alert.time_window}{" "}
                      minutes • Triggered{" "}
                      {new Date(alert.triggered_at).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="outline">Sent</Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No recent alerts
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
