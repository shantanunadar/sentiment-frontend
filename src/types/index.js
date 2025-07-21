// No need for TypeScript interfaces in JavaScript
// These are just for documentation purposes

/*
Message shape:
{
  id: string,
  content: string,
  emotion: string[],
  score: number,
  channel: "chat" | "email" | "ticket",
  timestamp: Date
}

SentimentStats shape:
{
  totalMessages: number,
  averageScore: number,
  dominantEmotion: string,
  emotionDistribution: Record<string, number>
}

Alert shape:
{
  id: string,
  triggered_at: Date,
  emotion_type: string,
  summary: string
}

AlertConfig shape:
{
  emotion: string,
  threshold: number,
  timeWindow: number,
  enabled: boolean
}
*/
