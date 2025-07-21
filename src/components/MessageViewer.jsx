"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react"

export default function MessageViewer({ messages }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [emotionFilter, setEmotionFilter] = useState("all")
  const [channelFilter, setChannelFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const messagesPerPage = 10

  // Filter messages
  const filteredMessages = messages.filter((message) => {
    const matchesSearch = message.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEmotion = emotionFilter === "all" || message.emotion.includes(emotionFilter)
    const matchesChannel = channelFilter === "all" || message.channel === channelFilter

    return matchesSearch && matchesEmotion && matchesChannel
  })

  // Paginate messages
  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage)
  const startIndex = (currentPage - 1) * messagesPerPage
  const paginatedMessages = filteredMessages.slice(startIndex, startIndex + messagesPerPage)

  const getEmotionColor = (emotion) => {
    switch (emotion) {
      case "happy":
        return "bg-green-100 text-green-800"
      case "angry":
        return "bg-red-100 text-red-800"
      case "frustrated":
        return "bg-orange-100 text-orange-800"
      case "confused":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getScoreColor = (score) => {
    if (score > 5) return "bg-green-100 text-green-800"
    if (score > 0) return "bg-blue-100 text-blue-800"
    if (score > -5) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Message Viewer</CardTitle>
          <CardDescription>Browse and filter customer messages with sentiment analysis</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={emotionFilter} onValueChange={setEmotionFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by emotion" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Emotions</SelectItem>
                <SelectItem value="happy">Happy</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="frustrated">Frustrated</SelectItem>
                <SelectItem value="angry">Angry</SelectItem>
                <SelectItem value="confused">Confused</SelectItem>
              </SelectContent>
            </Select>

            <Select value={channelFilter} onValueChange={setChannelFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                <SelectItem value="chat">Live Chat</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="ticket">Support Ticket</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results count */}
          <div className="text-sm text-muted-foreground mb-4">
            Showing {paginatedMessages.length} of {filteredMessages.length} messages
          </div>

          {/* Messages list */}
          <div className="space-y-4">
            {paginatedMessages.map((message) => (
              <div key={message.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {message.channel}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(message.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <Badge className={getScoreColor(message.score)}>
                    {message.score > 0 ? "+" : ""}
                    {message.score}
                  </Badge>
                </div>

                <p className="text-sm mb-3 leading-relaxed">{message.content}</p>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-muted-foreground">Emotions:</span>
                  {message.emotion.map((emotion, index) => (
                    <Badge key={index} className={getEmotionColor(emotion)} variant="secondary">
                      {emotion}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
