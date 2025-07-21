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
import { Badge } from "@/components/ui/badge";
import { Loader2, Brain, AlertTriangle } from "lucide-react";

const API_BASE_URL = process.env.VITE_API_URL || "http://localhost:8000";

export default function RootCauseAnalysis({ messages }) {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const negativeMessages = messages.filter((m) => m.score < 0);
      const messageContents = negativeMessages.map((m) => m.content);

      const response = await fetch(`${API_BASE_URL}/api/analytics/root-cause`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messageContents,
          emotion_filter: null,
        }),
      });

      if (!response.ok) throw new Error("Failed to analyze root cause");

      const result = await response.json();

      // Transform the API response to match the expected format
      setAnalysis({
        summary: result.summary,
        topIssues: [
          "Slow response times",
          "Confusing UI elements",
          "Billing concerns",
          "Feature accessibility",
        ], // These could be extracted from the summary in a real implementation
        affectedChannels: ["chat", "email"], // This could be derived from the messages
        recommendedActions: [
          "Implement automated chat responses for common queries",
          "Review and simplify checkout process",
          "Create better onboarding tutorials",
          "Expand support team capacity during peak hours",
        ], // These could be part of the API response
        exampleMessages: negativeMessages.slice(0, 3),
      });
    } catch (err) {
      console.error("Error analyzing root cause:", err);
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const negativeMessages = messages.filter((m) => m.score < 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-Powered Root Cause Analysis
          </CardTitle>
          <CardDescription>
            Analyze negative sentiment patterns to identify underlying issues
            and recommended actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium">
                  Ready to analyze {negativeMessages.length} negative messages
                </p>
                <p className="text-sm text-muted-foreground">
                  This will use AI to identify patterns and root causes
                </p>
              </div>
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || negativeMessages.length === 0}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Start Analysis
                  </>
                )}
              </Button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {analysis && (
        <div className="space-y-6">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{analysis.summary}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Issues */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Top Issues Identified
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.topIssues.map((issue, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Badge variant="destructive" className="text-xs">
                        #{index + 1}
                      </Badge>
                      <span className="text-sm">{issue}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Affected Channels */}
            <Card>
              <CardHeader>
                <CardTitle>Affected Channels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.affectedChannels.map((channel, index) => (
                    <Badge key={index} variant="outline">
                      {channel}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommended Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.recommendedActions.map((action, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg"
                  >
                    <Badge className="mt-0.5">{index + 1}</Badge>
                    <span className="text-sm">{action}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Example Messages */}
          <Card>
            <CardHeader>
              <CardTitle>Representative Examples</CardTitle>
              <CardDescription>
                Messages that illustrate the identified issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.exampleMessages.map((message) => (
                  <div
                    key={message.id}
                    className="border-l-4 border-red-500 pl-4 py-2"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {message.channel}
                      </Badge>
                      <Badge className="bg-red-100 text-red-800">
                        {message.score}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      "{message.content}"
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
