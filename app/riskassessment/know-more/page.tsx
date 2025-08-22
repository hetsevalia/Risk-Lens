"use client"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Calculator, Shield, TrendingUp } from "lucide-react"

export default function KnowMore() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Understanding Your Risk Scores
          </h1>
          <div></div>
        </div>

        <div className="space-y-8">
          {/* Health Score Explanation */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-green-600" />
                  Health Score Calculation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Framingham CVD Risk Model</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    Our health score is based on the validated Framingham Cardiovascular Disease Risk Model, which
                    predicts 10-year cardiovascular disease risk.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Formula:</h4>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg font-mono text-sm">
                    L = β₀ + βₗₙₐₑ × ln(age) + βₗₙᵦₘᵢ × ln(BMI) + βₗₙₛᵦₚ × ln(SBP) + βₛₘₒₖₑᵣ × smoker + βᵈⁱᵃᵇᵉᵗᵉˢ ×
                    diabetes
                    <br />
                    p₁₀ = 1 - S₀^exp(L - L̄)
                    <br />
                    HealthScore = 100 × (1 - p₁₀)
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Key Points:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                    <li>Uses sex-specific coefficients for accurate predictions</li>
                    <li>Accounts for blood pressure medication usage</li>
                    <li>Higher scores indicate lower cardiovascular risk</li>
                    <li>Based on decades of clinical research data</li>
                  </ul>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="text-sm">
                    <strong>Reference:</strong> D'Agostino, R.B., et al. (2008). "General Cardiovascular Risk Profile
                    for Use in Primary Care."
                    <em>Circulation</em>, 117(6), 743-753.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Finance Score Explanation */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                  Finance Score Calculation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Financial Stability Index (FSI)</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    Our finance score converts the Financial Stability Index (FSI) from our machine learning model into
                    an interpretable score.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Formula:</h4>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg font-mono text-sm">
                    FinanceScore = 100 × (1 - FSI)
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Key Factors Considered:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                    <li>Credit score and payment history</li>
                    <li>Debt-to-income ratio</li>
                    <li>Employment status and job stability</li>
                    <li>Assets and number of dependents</li>
                    <li>Previous defaults and loan purpose</li>
                  </ul>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="text-sm">
                    <strong>Validation:</strong> Our model is trained on comprehensive financial datasets and validated
                    against traditional credit scoring methods to ensure accuracy and fairness.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Time Horizon Score Explanation */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-6 w-6 text-purple-600" />
                  Time Horizon & Overall Risk
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Time Horizon Score</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    Represents your risk projection over time, combining both health and financial risk probabilities.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Formula:</h4>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg font-mono text-sm">
                    TimeHorizonScore = 100 × (1 - RiskProb)
                    <br />
                    where RiskProb = average of health p₁₀ and finance FSI
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 mt-6">Overall Risk Score</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    A weighted combination of all risk factors to provide a comprehensive assessment.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Formula:</h4>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg font-mono text-sm">
                    OverallRiskScore = 0.4 × HealthScore + 0.4 × FinanceScore + 0.2 × TimeHorizonScore
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Interpretation Ranges:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                      <div className="font-semibold text-green-700 dark:text-green-300">80-100</div>
                      <div className="text-sm">Low Overall Risk (Safe)</div>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                      <div className="font-semibold text-yellow-700 dark:text-yellow-300">50-79</div>
                      <div className="text-sm">Medium Overall Risk</div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                      <div className="font-semibold text-red-700 dark:text-red-300">0-49</div>
                      <div className="text-sm">High Overall Risk</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* AI Analysis Explanation */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-indigo-600" />
                  AI-Powered Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Gemini 2.5 Flash Integration</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    Each score is accompanied by AI-generated insights using Google's Gemini 2.5 Flash model, providing
                    personalized analysis and actionable recommendations.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">What the AI Considers:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                    <li>Your specific score and risk classification</li>
                    <li>Industry best practices for risk management</li>
                    <li>Actionable steps for improvement</li>
                    <li>Context-aware recommendations</li>
                  </ul>
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
                  <p className="text-sm">
                    <strong>Note:</strong> AI analysis is provided as supplementary information and should not replace
                    professional medical or financial advice.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Back to Dashboard Button */}
        <div className="text-center mt-8">
          <Button
            onClick={() => router.push("/riskassessment/dashboard")}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
