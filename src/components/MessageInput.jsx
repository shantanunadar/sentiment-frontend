"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Send, Loader2 } from "lucide-react";

export default function MessageInput({ onAddMessage }) {
  const [content, setContent] = useState("");
  const [channel, setChannel] = useState("chat");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await onAddMessage({
        content,
        channel,
      });

      setLastAnalysis({
        emotion: result.emotion,
        score: result.score,
      });

      setContent("");
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
      setError("Failed to analyze message. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Simulate Customer Message</CardTitle>
          <CardDescription>
            Add a customer message to test sentiment analysis and see real-time
            updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Message Content
              </label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter customer message here..."
                className="min-h-[100px]"
                disabled={isAnalyzing}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Channel</label>
              <Select
                value={channel}
                onValueChange={(value) => setChannel(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chat">Live Chat</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="ticket">Support Ticket</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={!content.trim() || isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Sentiment...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Analyze & Add Message
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {lastAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle>Last Analysis Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium">Detected Emotions:</span>
                <div className="flex gap-2 mt-1">
                  {lastAnalysis.emotion.map((emotion, index) => (
                    <Badge key={index} variant="secondary">
                      {emotion}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-sm font-medium">Sentiment Score:</span>
                <span
                  className={`ml-2 px-2 py-1 rounded text-sm ${
                    lastAnalysis.score > 0
                      ? "bg-green-100 text-green-800"
                      : lastAnalysis.score < 0
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {lastAnalysis.score > 0 ? "+" : ""}
                  {lastAnalysis.score}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
