"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Brain, TrendingUp, Clock, Shield } from "lucide-react"

interface DashboardData {
  financeResult: any
  healthResult: any
  financeForm: any
  healthForm: any
}

interface ScoreData {
  healthScore: number
  financeScore: number
  timeHorizonScore: number
  overallRiskScore: number
  healthClassification: string
  financeClassification: string
  timeHorizonInterpretation: string
  overallRiskInterpretation: string
}

export default function Dashboard() {
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [scores, setScores] = useState<ScoreData | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState<{
    health: string
    finance: string
    timeHorizon: string
    overall: string
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data = localStorage.getItem("dashboardData")
    if (data) {
      const parsedData = JSON.parse(data)
      setDashboardData(parsedData)
      calculateScores(parsedData)
    } else {
      router.push("/")
    }
  }, [router])

  const calculateScores = async (data: DashboardData) => {
    try {
      let healthScore = 0
      let financeScore = 0
      let healthClassification = "No Data"
      let financeClassification = "No Data"

      // Calculate Health Score using Framingham CVD Risk Model
      if (data.healthResult && data.healthForm) {
        const p10 = calculateFraminghamRisk(data.healthForm)
        healthScore = Math.round(100 * (1 - p10))
        healthClassification = getHealthClassification(p10)
      }

      // Calculate Finance Score from FSI
      if (data.financeResult && data.financeResult.FSI !== undefined) {
        const fsi = data.financeResult.FSI
        financeScore = Math.round(100 * (1 - fsi))
        financeClassification = getFinanceClassification(fsi)
      }

      // Calculate Time Horizon Score
      const healthRiskProb = data.healthResult ? calculateFraminghamRisk(data.healthForm) : 0
      const financeRiskProb = data.financeResult ? data.financeResult.FSI : 0
      const avgRiskProb = (healthRiskProb + financeRiskProb) / 2
      const timeHorizonScore = Math.round(100 * (1 - avgRiskProb))
      const timeHorizonInterpretation = getTimeHorizonInterpretation(timeHorizonScore)

      // Calculate Overall Risk Score
      const overallRiskScore = Math.round(0.4 * healthScore + 0.4 * financeScore + 0.2 * timeHorizonScore)
      const overallRiskInterpretation = getOverallRiskInterpretation(overallRiskScore)

      const calculatedScores = {
        healthScore,
        financeScore,
        timeHorizonScore,
        overallRiskScore,
        healthClassification,
        financeClassification,
        timeHorizonInterpretation,
        overallRiskInterpretation,
      }

      setScores(calculatedScores)

      // Generate AI Analysis
      await generateAIAnalysis(calculatedScores)
    } catch (error) {
      console.error("Error calculating scores:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateFraminghamRisk = (healthForm: any) => {
    // Framingham CVD Risk Model coefficients (simplified version)
    const coefficients = {
      male: {
        beta0: -29.799,
        betaLnAge: 4.884,
        betaLnBMI: 0.645,
        betaLnSBP_treated: 2.019,
        betaLnSBP_untreated: 1.957,
        betaSmoker: 0.549,
        betaDiabetes: 0.645,
        L_mean: 61.18,
        S0: 0.88431,
      },
      female: {
        beta0: -29.067,
        betaLnAge: 4.276,
        betaLnBMI: 0.302,
        betaLnSBP_treated: 2.469,
        betaLnSBP_untreated: 2.323,
        betaSmoker: 0.691,
        betaDiabetes: 0.874,
        L_mean: 26.1931,
        S0: 0.95012,
      },
    }

    const isMale = healthForm.male === 1
    const coeff = isMale ? coefficients.male : coefficients.female

    const lnAge = Math.log(healthForm.age)
    const lnBMI = Math.log(healthForm.BMI)
    const lnSBP = Math.log(healthForm.sysBP)
    const betaLnSBP = healthForm.BPMeds === 1 ? coeff.betaLnSBP_treated : coeff.betaLnSBP_untreated

    const L =
      coeff.beta0 +
      coeff.betaLnAge * lnAge +
      coeff.betaLnBMI * lnBMI +
      betaLnSBP * lnSBP +
      coeff.betaSmoker * healthForm.currentSmoker +
      coeff.betaDiabetes * healthForm.diabetes

    const p10 = 1 - Math.pow(coeff.S0, Math.exp(L - coeff.L_mean))
    return Math.max(0, Math.min(1, p10)) // Clamp between 0 and 1
  }

  const getHealthClassification = (p10: number) => {
    if (p10 < 0.05) return "Low Risk"
    if (p10 < 0.15) return "Medium Risk"
    return "High Risk"
  }

  const getFinanceClassification = (fsi: number) => {
    if (fsi < 0.3) return "Low Risk"
    if (fsi < 0.7) return "Medium Risk"
    return "High Risk"
  }

  const getTimeHorizonInterpretation = (score: number) => {
    if (score >= 70) return "Long-term safe zone"
    if (score >= 40) return "Moderate horizon"
    return "Short horizon"
  }

  const getOverallRiskInterpretation = (score: number) => {
    if (score >= 80) return "Low Overall Risk (Safe)"
    if (score >= 50) return "Medium Overall Risk"
    return "High Overall Risk"
  }

  const generateAIAnalysis = async (scores: ScoreData) => {
    try {
      const analyses = await Promise.all([
        generateSingleAnalysis(
          `health score of ${scores.healthScore} (classification: ${scores.healthClassification})`,
        ),
        generateSingleAnalysis(
          `finance score of ${scores.financeScore} (classification: ${scores.financeClassification})`,
        ),
        generateSingleAnalysis(
          `time horizon score of ${scores.timeHorizonScore} (${scores.timeHorizonInterpretation})`,
        ),
        generateSingleAnalysis(
          `overall risk score of ${scores.overallRiskScore} (${scores.overallRiskInterpretation})`,
        ),
      ])

      setAiAnalysis({
        health: analyses[0],
        finance: analyses[1],
        timeHorizon: analyses[2],
        overall: analyses[3],
      })
    } catch (error) {
      console.error("Error generating AI analysis:", error)
    }
  }

  const generateSingleAnalysis = async (scoreDescription: string) => {
    try {
      const response = await fetch("/api/gemini-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `Provide a short analysis (1-2 lines) of a ${scoreDescription}. Be concise and actionable.`,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate analysis")
      }

      const data = await response.json()
      return data.analysis || "Analysis unavailable"
    } catch (error) {
      return "Analysis unavailable"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 50) return "text-yellow-600"
    return "text-red-600"
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 50) return "bg-yellow-500"
    return "bg-red-500"
  }

  if (loading || !scores) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Calculating your risk scores...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => router.push("/")} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Assessment
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Risk Dashboard
          </h1>
          <div></div>
        </div>

        {/* Score Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Health Score */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="h-5 w-5 text-green-600" />
                  Health Risk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-3xl font-bold ${getScoreColor(scores.healthScore)}`}>
                      {scores.healthScore}
                    </span>
                    <Badge variant="outline">{scores.healthClassification}</Badge>
                  </div>
                  <Progress value={scores.healthScore} className="h-2" />
                  {aiAnalysis?.health && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{aiAnalysis.health}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Finance Score */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Financial Risk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-3xl font-bold ${getScoreColor(scores.financeScore)}`}>
                      {scores.financeScore}
                    </span>
                    <Badge variant="outline">{scores.financeClassification}</Badge>
                  </div>
                  <Progress value={scores.financeScore} className="h-2" />
                  {aiAnalysis?.finance && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{aiAnalysis.finance}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Time Horizon Score */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5 text-purple-600" />
                  Time Horizon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-3xl font-bold ${getScoreColor(scores.timeHorizonScore)}`}>
                      {scores.timeHorizonScore}
                    </span>
                    <Badge variant="outline">{scores.timeHorizonInterpretation}</Badge>
                  </div>
                  <Progress value={scores.timeHorizonScore} className="h-2" />
                  {aiAnalysis?.timeHorizon && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{aiAnalysis.timeHorizon}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Overall Risk Score */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="relative overflow-hidden border-2 border-primary">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="h-5 w-5 text-primary" />
                  Overall Risk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-3xl font-bold ${getScoreColor(scores.overallRiskScore)}`}>
                      {scores.overallRiskScore}
                    </span>
                    <Badge variant="default">{scores.overallRiskInterpretation}</Badge>
                  </div>
                  <Progress value={scores.overallRiskScore} className="h-2" />
                  {aiAnalysis?.overall && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{aiAnalysis.overall}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Know More Button */}
        <div className="text-center">
          <Button
            onClick={() => router.push("/riskassessment/know-more")}
            variant="outline"
            size="lg"
            className="bg-white/50 backdrop-blur"
          >
            Know More About These Calculations
          </Button>
        </div>
      </div>
    </div>
  )
}
