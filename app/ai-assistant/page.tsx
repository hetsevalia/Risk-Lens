"use client"

import { useState, useRef, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, FileText, Bot, User, X, AlertCircle, Trash2, Download } from "lucide-react"

interface Message {
  id: string
  type: "user" | "assistant" | "loading"
  content: string
  timestamp: Date
  sources?: string[]
}

export default function AIAssistantPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const riskScore = searchParams.get("riskScore")
  const financial = searchParams.get("financial")
  const health = searchParams.get("health")
  const time = searchParams.get("time")

  const [hasDashboardData, setHasDashboardData] = useState(false)

  const getInitialPrompt = (hasData: boolean) => {
    if (!hasData) {
      return "Hello! I'm your AI Risk Advisor. To provide personalized advice, please complete the Finance and Health Risk Assessment forms first. Once you've submitted both forms, I'll be able to analyze your data and provide tailored recommendations."
    }

    return riskScore
      ? `Hello! I'm your AI Risk Advisor. Here are your current scores:
- Total Risk Score: ${riskScore}
- Financial Score: ${financial}
- Health Score: ${health}
- Time Horizon Score: ${time}

I can provide advice and suggestions based on these scores.`
      : "Hello! I'm your AI Risk Advisor. I have your risk assessment data and can provide personalized advice based on your financial and health information."
  }

  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Helper function to format message content with proper markdown rendering
  const formatMessageContent = (content: string) => {
    // Clean up the content first
    let cleanContent = content
    
    // Remove excessive asterisks and clean up formatting
    cleanContent = cleanContent.replace(/\*{3,}/g, '') // Remove triple+ asterisks
    cleanContent = cleanContent.replace(/#{4,}/g, '###') // Limit headers to max 3 levels
    
    const lines = cleanContent.split('\n')
    
    return lines.map((line, index) => {
      const trimmedLine = line.trim()
      
      // Skip empty lines but add spacing
      if (trimmedLine === '') {
        return <div key={index} className="mb-1"></div>
      }
      
      // Handle headers - clean and format
      if (trimmedLine.startsWith('### ')) {
        const headerText = trimmedLine.substring(4).replace(/\*+/g, '').trim()
        return <h3 key={index} className="text-lg font-semibold mt-4 mb-2 text-blue-300">{headerText}</h3>
      }
      if (trimmedLine.startsWith('## ')) {
        const headerText = trimmedLine.substring(3).replace(/\*+/g, '').trim()
        return <h2 key={index} className="text-xl font-bold mt-5 mb-3 text-blue-200">{headerText}</h2>
      }
      if (trimmedLine.startsWith('# ')) {
        const headerText = trimmedLine.substring(2).replace(/\*+/g, '').trim()
        return <h1 key={index} className="text-2xl font-bold mt-6 mb-4 text-blue-100">{headerText}</h1>
      }
      
      // Handle bullet points
      if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
        const bulletText = trimmedLine.substring(2).trim()
        return (
          <div key={index} className="mb-2">
            <span className="text-blue-400 mr-2">•</span>
            <span>{formatInlineText(bulletText)}</span>
          </div>
        )
      }
      
      // Handle numbered lists
      const numberedMatch = trimmedLine.match(/^\d+\.\s(.+)/)
      if (numberedMatch) {
        return (
          <div key={index} className="mb-2">
            <span className="text-blue-400 mr-2 font-medium">{numberedMatch[0].match(/^\d+\./)[0]}</span>
            <span>{formatInlineText(numberedMatch[1])}</span>
          </div>
        )
      }
      
      // Regular paragraphs
      return (
        <p key={index} className="mb-3 leading-relaxed">
          {formatInlineText(trimmedLine)}
        </p>
      )
    })
  }

  // Helper function to clean and format inline text
  const formatInlineText = (text: string) => {
    // Split text by bold markers and format
    const parts = []
    let currentIndex = 0
    
    // Find bold text patterns
    const boldRegex = /\*\*(.*?)\*\*/g
    let match
    
    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before bold
      if (match.index > currentIndex) {
        const beforeText = text.slice(currentIndex, match.index)
        if (beforeText) {
          parts.push(<span key={`text-${currentIndex}`}>{cleanText(beforeText)}</span>)
        }
      }
      
      // Add bold text
      const boldText = match[1].trim()
      if (boldText) {
        parts.push(<strong key={`bold-${match.index}`} className="font-semibold text-white">{cleanText(boldText)}</strong>)
      }
      
      currentIndex = match.index + match[0].length
    }
    
    // Add remaining text
    if (currentIndex < text.length) {
      const remainingText = text.slice(currentIndex)
      if (remainingText.trim()) {
        parts.push(<span key={`text-${currentIndex}`}>{cleanText(remainingText)}</span>)
      }
    }
    
    // If no bold text found, just return cleaned text
    if (parts.length === 0) {
      return cleanText(text)
    }
    
    return <span>{parts}</span>
  }

  // Helper function to clean text of unwanted markdown symbols
  const cleanText = (text: string) => {
    return text
      .replace(/\*+/g, '') // Remove remaining asterisks
      .replace(/#+/g, '') // Remove remaining hashes
      .replace(/`+/g, '') // Remove backticks
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
  }

  // Export chat history function
  const exportChatHistory = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      messageCount: messages.filter(m => m.type !== "loading").length,
      messages: messages.filter(m => m.type !== "loading").map(msg => ({
        type: msg.type,
        content: msg.content,
        timestamp: msg.timestamp.toISOString(),
        sources: msg.sources || []
      }))
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `chat-history-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  // Clear chat history function
  const clearChatHistory = () => {
    if (confirm('Are you sure you want to clear all chat history? This cannot be undone.')) {
      const hasData = checkDashboardData()
      const welcomeMessage = { 
        id: "welcome", 
        type: "assistant" as const, 
        content: getInitialPrompt(hasData), 
        timestamp: new Date() 
      }
      setMessages([welcomeMessage])
      localStorage.removeItem("chatHistory")
    }
  }

  const checkDashboardData = () => {
    try {
      const dashboardData = localStorage.getItem("dashboardData")
      if (!dashboardData) {
        console.log("No dashboard data found in localStorage")
        return false
      }

      const parsedData = JSON.parse(dashboardData)
      console.log("Dashboard data found:", parsedData)

      // Check for form data (what the dashboard actually stores)
      const hasFinanceForm = parsedData?.financeForm && 
        typeof parsedData.financeForm === 'object' && 
        Object.keys(parsedData.financeForm).length > 0

      const hasHealthForm = parsedData?.healthForm && 
        typeof parsedData.healthForm === 'object' && 
        Object.keys(parsedData.healthForm).length > 0

      // Also check for results (optional, as they might be calculated on dashboard)
      const hasFinanceResult = parsedData?.financeResult && 
        typeof parsedData.financeResult === 'object'

      const hasHealthResult = parsedData?.healthResult && 
        typeof parsedData.healthResult === 'object'

      console.log("Data validation:", {
        hasFinanceForm,
        hasHealthForm,
        hasFinanceResult,
        hasHealthResult
      })

      // Return true if we have both form data OR both result data
      const hasCompleteData = (hasFinanceForm && hasHealthForm) || (hasFinanceResult && hasHealthResult)
      
      console.log("Has complete data:", hasCompleteData)
      return hasCompleteData

    } catch (error) {
      console.error("Failed to parse dashboard data:", error)
      return false
    }
  }

  useEffect(() => {
    const hasData = checkDashboardData()
    console.log("useEffect - hasData:", hasData)
    setHasDashboardData(hasData)

    const savedHistory = localStorage.getItem("chatHistory")
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory)
        setMessages(
          parsedHistory.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        )
      } catch (error) {
        console.error("Failed to load chat history:", error)
        setMessages([{ id: "welcome", type: "assistant", content: getInitialPrompt(hasData), timestamp: new Date() }])
      }
    } else {
      setMessages([{ id: "welcome", type: "assistant", content: getInitialPrompt(hasData), timestamp: new Date() }])
    }
  }, [riskScore, financial, health, time])

  // Add a refresh function to check data when user returns from forms
  useEffect(() => {
    const handleFocus = () => {
      const hasData = checkDashboardData()
      if (hasData !== hasDashboardData) {
        setHasDashboardData(hasData)
        // Update welcome message if data status changed
        setMessages(prev => {
          if (prev[0]?.id === "welcome") {
            return [
              { id: "welcome", type: "assistant", content: getInitialPrompt(hasData), timestamp: new Date() },
              ...prev.slice(1)
            ]
          }
          return prev
        })
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [hasDashboardData])

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(messages))
    }
  }, [messages])

  // Scroll to bottom when messages update
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector<HTMLDivElement>("[data-radix-scroll-area-viewport]")
      if (scrollContainer) scrollContainer.scrollTop = scrollContainer.scrollHeight
    }
  }
  useEffect(() => scrollToBottom(), [messages])

  const handleSendMessage = async (msg: string) => {
    if (!msg.trim() || isLoading || !hasDashboardData) return

    const userMessage: Message = { id: Date.now().toString(), type: "user", content: msg, timestamp: new Date() }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    const loadingMessage: Message = {
      id: `loading-${Date.now()}`,
      type: "loading",
      content: "Retrieving info...",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, loadingMessage])

    try {
      const dashboardData = localStorage.getItem("dashboardData")
      let parsedDashboardData = null

      if (dashboardData) {
        try {
          parsedDashboardData = JSON.parse(dashboardData)
        } catch (error) {
          console.error("Failed to parse dashboard data:", error)
        }
      }

      // Prepare data for API call - adapt to your actual data structure
      const apiPayload = {
        input: msg,
        // Legacy fields for backward compatibility
        health_risk: parsedDashboardData?.healthResult?.risk || 
                     parsedDashboardData?.healthResult?.RiskRating || 
                     "Unknown",
        health_score: parsedDashboardData?.healthResult?.score || 
                      parsedDashboardData?.healthResult?.probability || 
                      0,
        finance_risk: parsedDashboardData?.financeResult?.risk || 
                      parsedDashboardData?.financeResult?.RiskRating || 
                      "Unknown",
        finance_score: parsedDashboardData?.financeResult?.score || 
                       parsedDashboardData?.financeResult?.FSI || 
                       0,
        time_horizon_risk: parsedDashboardData?.timeHorizon?.risk || "Unknown",
        time_horizon_score: parsedDashboardData?.timeHorizon?.score || 0,
        // New structure - form data
        finance_form: parsedDashboardData?.financeForm || null,
        health_form: parsedDashboardData?.healthForm || null,
        // Result data
        finance_result: parsedDashboardData?.financeResult || null,
        health_result: parsedDashboardData?.healthResult || null
      }

      console.log("Sending API payload:", apiPayload)

      const response = await fetch("http://127.0.0.1:8080/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiPayload),
      })

      console.log("Response status:", response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error("API Error Response:", errorText)
        throw new Error(`API responded with status: ${response.status}`)
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        type: "assistant",
        content: data.answer || "I apologize, but I couldn't generate a response at this time.",
        sources: data.sources || [],
        timestamp: new Date(),
      }

      setMessages((prev) => prev.filter((m) => m.type !== "loading").concat(assistantMessage))
    } catch (error) {
      console.error("API Error:", error)

      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: "assistant",
        content: "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.",
        timestamp: new Date(),
      }

      setMessages((prev) => prev.filter((m) => m.type !== "loading").concat(errorMessage))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl p-6 relative">
      <h1 className="text-3xl font-bold mb-6">AI Risk Assistant</h1>

      <Card className="shadow-md rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 relative">
        {/* 3D Close Button */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-2xl flex items-center justify-center transform transition-transform hover:scale-110 active:scale-95"
          >
            <X className="w-5 h-5 text-red-500" />
          </button>
        </div>

        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-blue-500" />
              AI Risk Assistant
              {/* Debug info - remove in production */}
              <span className="text-xs text-gray-500">
                (Data: {hasDashboardData ? "✓" : "✗"})
              </span>
            </CardTitle>
            
            {/* Chat History Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={exportChatHistory}
                className="text-xs"
                disabled={messages.length <= 1}
              >
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChatHistory}
                className="text-xs text-red-500 hover:text-red-600"
                disabled={messages.length <= 1}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col h-[60vh]">
          {!hasDashboardData && (
            <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Please complete both Finance and Health Risk Assessment forms to enable personalized AI assistance.{" "}
                <button onClick={() => router.push("/riskassessment")} className="underline hover:no-underline font-medium">
                  Go to forms
                </button>
              </p>
            </div>
          )}

          <div className="flex-1 overflow-hidden">
            <ScrollArea ref={scrollAreaRef} className="h-full pr-2">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.type !== "user" && (
                      <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                        {message.type === "loading" ? (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Bot className="w-3 h-3 text-white" />
                        )}
                      </div>
                    )}

                    <div className={`max-w-[75%] ${message.type === "user" ? "order-first" : ""}`}>
                      <div
                        className={`p-4 rounded-lg ${
                          message.type === "user"
                            ? "bg-blue-600 text-white"
                            : message.type === "loading"
                              ? "bg-white/10 text-gray-400 italic"
                              : "bg-white/10 text-gray-900 dark:text-gray-100"
                        }`}
                      >
                        {message.type === "user" || message.type === "loading" ? (
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        ) : (
                          <div className="prose prose-invert max-w-none">
                            {formatMessageContent(message.content)}
                          </div>
                        )}

                        {message.sources?.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-white/20">
                            <p className="text-xs text-gray-400 mb-2 font-medium">Sources:</p>
                            <div className="flex flex-wrap gap-2">
                              {message.sources.map((src, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded text-xs"
                                >
                                  <FileText className="w-3 h-3" />
                                  {src}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Timestamp for non-loading messages */}
                        {message.type !== "loading" && (
                          <div className="mt-2 text-xs opacity-50">
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        )}
                      </div>
                    </div>

                    {message.type === "user" && (
                      <div className="w-7 h-7 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="w-3 h-3 text-gray-900 dark:text-gray-100" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage(inputValue)
            }}
            className="flex gap-2 mt-4"
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                hasDashboardData
                  ? "Ask about risk, investments, or finance..."
                  : "Complete the forms first to enable chat..."
              }
              className="flex-1 bg-white/10 border-white/20 text-gray-900 dark:text-gray-100 placeholder:text-gray-500"
              disabled={isLoading || !hasDashboardData}
              maxLength={500}
            />
            <Button
              type="submit"
              disabled={!inputValue.trim() || isLoading || !hasDashboardData}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 px-4"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
          
          {/* Chat Info */}
          <div className="mt-2 text-xs text-gray-500 flex justify-between items-center">
            <span>{messages.filter(m => m.type !== "loading").length} messages</span>
            {inputValue.length > 0 && (
              <span className={inputValue.length > 450 ? "text-red-500" : "text-gray-500"}>
                {inputValue.length}/500
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}