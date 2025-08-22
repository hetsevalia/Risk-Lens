"use client"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Calculator, Shield, TrendingUp, Brain, Clock } from "lucide-react"

export default function KnowMore() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => router.push("/riskassessment/dashboard")} className="flex items-center gap-2">
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
                    predicts 10-year cardiovascular disease risk and converts it to a safety score.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Formula:</h4>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <div className="space-y-2">
                      <div>L = β₀ + βₗₙₐₑ × ln(age) + βₗₙᵦₘᵢ × ln(BMI) + βₗₙₛᵦₚ × ln(SBP) + βₛₘₒₖₑᵣ × smoker + βᵈⁱᵃᵇᵉᵗᵉˢ × diabetes</div>
                      <div>p₁₀ = 1 - S₀^exp(L - L̄)</div>
                      <div className="text-green-600 font-bold">HealthScore = 100 × (1 - p₁₀)</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Input Parameters:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                      <li><strong>Age:</strong> Clamped between 20-100 years</li>
                      <li><strong>BMI:</strong> Body Mass Index (15-50 range)</li>
                      <li><strong>Systolic BP:</strong> Blood pressure (80-200 mmHg)</li>
                      <li><strong>Gender:</strong> Sex-specific coefficients</li>
                    </ul>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                      <li><strong>Smoking Status:</strong> Current smoker (Yes/No)</li>
                      <li><strong>Diabetes:</strong> Diabetes diagnosis (Yes/No)</li>
                      <li><strong>BP Medication:</strong> Blood pressure treatment</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Risk Classification:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                      <div className="font-semibold text-green-700 dark:text-green-300">Low Risk</div>
                      <div className="text-sm">&lt; 5% CVD risk (Score: 95+)</div>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                      <div className="font-semibold text-yellow-700 dark:text-yellow-300">Medium Risk</div>
                      <div className="text-sm">5-15% CVD risk (Score: 85-95)</div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                      <div className="font-semibold text-red-700 dark:text-red-300">High Risk</div>
                      <div className="text-sm">&gt; 15% CVD risk (Score: &lt;85)</div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="text-sm">
                    <strong>Reference:</strong> D'Agostino, R.B., et al. (2008). "General Cardiovascular Risk Profile
                    for Use in Primary Care." <em>Circulation</em>, 117(6), 743-753.
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
                  Financial Risk Score Calculation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Weighted Risk Assessment Model</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    Our financial risk score uses a comprehensive weighted model that evaluates multiple financial indicators
                    to determine overall financial stability and creditworthiness.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Core Formula:</h4>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <div className="space-y-2">
                      <div>FSI = Σ(Risk Factor × Weight) / Total Weight</div>
                      <div className="text-blue-600 font-bold">FinanceScore = 100 × (1 - FSI)</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Risk Factors & Weights:</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                        <h5 className="font-semibold text-blue-600 mb-2">Primary Factors (65%)</h5>
                        <ul className="space-y-1 text-sm">
                          <li>• <strong>Credit Score (25%):</strong> 750+ = Low Risk, &lt;600 = High Risk</li>
                          <li>• <strong>Debt-to-Income (20%):</strong> &lt;20% = Low, &gt;50% = High</li>
                          <li>• <strong>Payment History (20%):</strong> Excellent/Good/Fair/Poor</li>
                        </ul>
                      </div>
                      
                      <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                        <h5 className="font-semibold text-purple-600 mb-2">Secondary Factors (35%)</h5>
                        <ul className="space-y-1 text-sm">
                          <li>• <strong>Previous Defaults (15%):</strong> 0 = Low, 3+ = High</li>
                          <li>• <strong>Employment Status (10%):</strong> Full-time = Low</li>
                          <li>• <strong>Job Tenure (5%):</strong> 5+ years = Low</li>
                          <li>• <strong>Loan-to-Income (5%):</strong> &lt;2x = Low</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Risk Score Ranges:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                      <div className="font-semibold text-green-700 dark:text-green-300">Low Risk (70-100)</div>
                      <div className="text-sm">FSI &lt; 0.3 - Excellent financial profile</div>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                      <div className="font-semibold text-yellow-700 dark:text-yellow-300">Medium Risk (30-69)</div>
                      <div className="text-sm">FSI 0.3-0.7 - Moderate risk factors</div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                      <div className="font-semibold text-red-700 dark:text-red-300">High Risk (0-29)</div>
                      <div className="text-sm">FSI &gt; 0.7 - Significant risk factors</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Assets Bonus:</h4>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <p className="text-sm">
                      <strong>Risk Reduction:</strong> Assets-to-income ratio &gt; 1 provides up to 10% risk reduction,
                      acknowledging financial cushion and stability.
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="text-sm">
                    <strong>Methodology:</strong> Our weighted model follows industry standards for credit risk assessment,
                    incorporating factors used by major financial institutions while ensuring fairness and transparency.
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
                  <Clock className="h-6 w-6 text-purple-600" />
                  Time Horizon Score
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Combined Risk Projection</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    The Time Horizon Score represents your overall risk stability over time by combining both health 
                    and financial risk probabilities into a unified temporal assessment.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Formula:</h4>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <div className="space-y-2">
                      <div>HealthRiskProb = Framingham p₁₀ (10-year CVD risk)</div>
                      <div>FinanceRiskProb = Financial FSI</div>
                      <div>AvgRiskProb = (HealthRiskProb + FinanceRiskProb) / 2</div>
                      <div className="text-purple-600 font-bold">TimeHorizonScore = 100 × (1 - AvgRiskProb)</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Interpretation:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                      <div className="font-semibold text-green-700 dark:text-green-300">Long-term Safe Zone</div>
                      <div className="text-sm">Score ≥ 70 - Low combined risk</div>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                      <div className="font-semibold text-yellow-700 dark:text-yellow-300">Moderate Horizon</div>
                      <div className="text-sm">Score 40-69 - Moderate risk levels</div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                      <div className="font-semibold text-red-700 dark:text-red-300">Short Horizon</div>
                      <div className="text-sm">Score &lt; 40 - Higher combined risk</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Overall Risk Score */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-6 w-6 text-indigo-600" />
                  Overall Risk Score
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Comprehensive Risk Assessment</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    A weighted combination of all risk factors to provide the most comprehensive assessment of your 
                    overall risk profile across health and financial dimensions.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Weighted Formula:</h4>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <div className="space-y-2">
                      <div className="text-indigo-600 font-bold">OverallRiskScore = 0.4 × HealthScore + 0.4 × FinanceScore + 0.2 × TimeHorizonScore</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Weight Rationale:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                      <div className="font-semibold text-green-700 dark:text-green-300">Health (40%)</div>
                      <div className="text-sm">Primary driver of long-term wellbeing and life quality</div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <div className="font-semibold text-blue-700 dark:text-blue-300">Finance (40%)</div>
                      <div className="text-sm">Critical for stability and security planning</div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                      <div className="font-semibold text-purple-700 dark:text-purple-300">Time Horizon (20%)</div>
                      <div className="text-sm">Combined future risk projection modifier</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Final Interpretation Ranges:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border-l-4 border-green-500">
                      <div className="font-semibold text-green-700 dark:text-green-300 text-lg">80-100</div>
                      <div className="font-medium">Low Overall Risk (Safe)</div>
                      <div className="text-sm mt-1">Excellent health and financial profile with strong long-term outlook</div>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border-l-4 border-yellow-500">
                      <div className="font-semibold text-yellow-700 dark:text-yellow-300 text-lg">50-79</div>
                      <div className="font-medium">Medium Overall Risk</div>
                      <div className="text-sm mt-1">Some areas need attention; opportunities for improvement exist</div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border-l-4 border-red-500">
                      <div className="font-semibold text-red-700 dark:text-red-300 text-lg">0-49</div>
                      <div className="font-medium">High Overall Risk</div>
                      <div className="text-sm mt-1">Significant risk factors present; immediate attention recommended</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* AI Analysis Explanation */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-rose-600" />
                  AI-Powered Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Gemini AI Integration</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    Each score is enhanced with AI-generated insights using advanced language models, providing
                    personalized analysis and actionable recommendations based on your specific risk profile.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">AI Analysis Process:</h4>
                  <div className="space-y-3">
                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                      <h5 className="font-semibold text-rose-600 mb-2">Input Processing</h5>
                      <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                        <li>• Analyzes your specific score values and classifications</li>
                        <li>• Considers risk category boundaries and thresholds</li>
                        <li>• Evaluates score in context of population norms</li>
                      </ul>
                    </div>
                    
                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                      <h5 className="font-semibold text-indigo-600 mb-2">Insight Generation</h5>
                      <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                        <li>• Generates concise, actionable recommendations</li>
                        <li>• Provides context-aware suggestions for improvement</li>
                        <li>• Identifies key areas of strength and concern</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">What the AI Considers:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                    <li>Your specific score and risk classification level</li>
                    <li>Industry best practices for risk management and improvement</li>
                    <li>Evidence-based strategies for health and financial wellness</li>
                    <li>Personalized actionable steps based on your risk profile</li>
                    <li>Context-appropriate recommendations for your situation</li>
                  </ul>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border-l-4 border-amber-500">
                  <div className="flex items-start space-x-2">
                    <BookOpen className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Important Disclaimer</p>
                      <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                        AI analysis is provided as supplementary information and educational guidance. It should not replace 
                        professional medical advice, financial planning consultation, or personalized risk assessment by 
                        qualified professionals.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Data Sources & Validation */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-emerald-600" />
                  Data Sources & Validation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Health Model Validation:</h4>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <p className="text-sm">
                      <strong>Framingham Heart Study:</strong> Based on over 60 years of cardiovascular research data 
                      from the landmark Framingham Heart Study, validated across diverse populations and widely used 
                      in clinical practice worldwide.
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Financial Model Validation:</h4>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <p className="text-sm">
                      <strong>Industry Standards:</strong> Our weighted model incorporates factors used by major credit 
                      bureaus and financial institutions, following established practices in credit risk assessment and 
                      financial stability evaluation.
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Continuous Improvement:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                    <li>Models are regularly updated based on latest research findings</li>
                    <li>Risk thresholds calibrated against current population data</li>
                    <li>AI analysis trained on current best practices and guidelines</li>
                    <li>User feedback incorporated to improve accuracy and relevance</li>
                  </ul>
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
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}