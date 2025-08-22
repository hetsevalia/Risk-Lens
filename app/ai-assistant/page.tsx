"use client"

import { useState, useRef, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, FileText, Bot, User, X, AlertCircle } from "lucide-react"

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

  const checkDashboardData = () => {
    const dashboardData = localStorage.getItem("dashboardData")
    if (!dashboardData) return false

    try {
      const parsedData = JSON.parse(dashboardData)
      // Check if both finance and health results exist
      const hasFinanceData =
        parsedData?.financeResult && (parsedData.financeResult.risk || parsedData.financeResult.score !== undefined)
      const hasHealthData =
        parsedData?.healthResult && (parsedData.healthResult.risk || parsedData.healthResult.score !== undefined)

      return hasFinanceData && hasHealthData
    } catch (error) {
      console.error("Failed to parse dashboard data:", error)
      return false
    }
  }

  useEffect(() => {
    const hasData = checkDashboardData()
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

      const response = await fetch("http://127.0.0.1:8080/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: msg,
          health_risk: parsedDashboardData?.healthResult?.risk || "",
          health_score: parsedDashboardData?.healthResult?.score || 0,
          finance_risk: parsedDashboardData?.financeResult?.risk || "",
          finance_score: parsedDashboardData?.financeResult?.score || 0,
          time_horizon_risk: parsedDashboardData?.timeHorizon?.risk || "",
          time_horizon_score: parsedDashboardData?.timeHorizon?.score || 0,
        }),
      })

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
            onClick={() => router.back()} // or router.push("/") to go home
            className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-2xl flex items-center justify-center transform transition-transform hover:scale-110 active:scale-95"
          >
            <X className="w-5 h-5 text-red-500" />
          </button>
        </div>

        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-blue-500" />
            AI Risk Assistant
          </CardTitle>
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
                        className={`p-3 rounded-lg ${
                          message.type === "user"
                            ? "bg-blue-600 text-white"
                            : message.type === "loading"
                              ? "bg-white/10 text-gray-400 italic"
                              : "bg-white/10 text-gray-900 dark:text-gray-100"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>

                        {message.sources?.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-white/20">
                            <p className="text-xs text-gray-500 mb-1">Sources:</p>
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
            className="flex gap-2 mt-2"
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
            />
            <Button
              type="submit"
              disabled={!inputValue.trim() || isLoading || !hasDashboardData}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
