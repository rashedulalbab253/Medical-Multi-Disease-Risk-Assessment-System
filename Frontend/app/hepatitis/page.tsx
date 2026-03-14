"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Navbar } from "@/components/navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface FormData {
  age: string
  sex: string
  alb: string
  che: string
  chol: string
  crea_log: string
  bil_log: string
  alt_log: string
  ggt_log: string
  ast_log: string
  alp_log: string
}

interface PredictionResult {
  prediction: number
  risk_status?: string
  probability?: number
}

export default function HepatitisPage() {
  const [activeTab, setActiveTab] = useState("form")
  const [isLoading, setIsLoading] = useState(false)
  const [isSummaryLoading, setIsSummaryLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<FormData>({
    age: "",
    sex: "0", // Default to Female
    alb: "",
    che: "",
    chol: "",
    crea_log: "",
    bil_log: "",
    alt_log: "",
    ggt_log: "",
    ast_log: "",
    alp_log: "",
  })
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [summary, setSummary] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    const { age, alb, che, chol, crea_log, bil_log, alt_log, ggt_log, ast_log, alp_log } = formData

    if (!age || isNaN(Number(age)) || Number(age) <= 0 || Number(age) > 120) {
      setError("Please enter a valid age between 1 and 120")
      return false
    }

    if (!alb || isNaN(Number(alb))) {
      setError("Please enter a valid albumin (ALB) value")
      return false
    }

    if (!che || isNaN(Number(che))) {
      setError("Please enter a valid cholinesterase (CHE) value")
      return false
    }

    if (!chol || isNaN(Number(chol))) {
      setError("Please enter a valid cholesterol (CHOL) value")
      return false
    }

    if (!crea_log || isNaN(Number(crea_log))) {
      setError("Please enter a valid creatinine log (CREA_log) value")
      return false
    }

    if (!bil_log || isNaN(Number(bil_log))) {
      setError("Please enter a valid bilirubin log (BIL_log) value")
      return false
    }

    if (!alt_log || isNaN(Number(alt_log))) {
      setError("Please enter a valid ALT log (ALT_log) value")
      return false
    }

    if (!ggt_log || isNaN(Number(ggt_log))) {
      setError("Please enter a valid GGT log (GGT_log) value")
      return false
    }

    if (!ast_log || isNaN(Number(ast_log))) {
      setError("Please enter a valid AST log (AST_log) value")
      return false
    }

    if (!alp_log || isNaN(Number(alp_log))) {
      setError("Please enter a valid ALP log (ALP_log) value")
      return false
    }

    return true
  }

  const { isAuthenticated } = useAuth()

  const fetchAISummary = async (predictionData: PredictionResult) => {
    setIsSummaryLoading(true)

    try {
      const parameters = {
        age: Number.parseFloat(formData.age),
        sex: Number.parseInt(formData.sex),
        alb: Number.parseFloat(formData.alb),
        che: Number.parseFloat(formData.che),
        chol: Number.parseFloat(formData.chol),
        crea_log: Number.parseFloat(formData.crea_log),
        bil_log: Number.parseFloat(formData.bil_log),
        alt_log: Number.parseFloat(formData.alt_log),
        ggt_log: Number.parseFloat(formData.ggt_log),
        ast_log: Number.parseFloat(formData.ast_log),
        alp_log: Number.parseFloat(formData.alp_log),
      }

      const summaryResponse = await fetch("/api/ai-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          disease: "hepatitis",
          parameters,
          prediction: predictionData.prediction,
          probability: predictionData.probability || 0.5,
        }),
      })

      if (!summaryResponse.ok) {
        throw new Error("Failed to get AI summary")
      }

      const summaryData = await summaryResponse.json()
      setSummary(summaryData.summary)
    } catch (err) {
      console.error("Error fetching AI summary:", err)
      setSummary("Unable to generate summary. Please try again later.")
    } finally {
      setIsSummaryLoading(false)
    }
  }

  useEffect(() => {
    if (result && activeTab === "results") {
      fetchAISummary(result)
    }
  }, [result, activeTab])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      if (!isAuthenticated) {
        throw new Error("You must be logged in to access this feature")
      }

      const apiData = {
        age: Number.parseInt(formData.age),
        sex: Number.parseInt(formData.sex),
        alb: Number.parseFloat(formData.alb),
        che: Number.parseFloat(formData.che),
        chol: Number.parseFloat(formData.chol),
        crea_log: Number.parseFloat(formData.crea_log),
        bil_log: Number.parseFloat(formData.bil_log),
        alt_log: Number.parseFloat(formData.alt_log),
        ggt_log: Number.parseFloat(formData.ggt_log),
        ast_log: Number.parseFloat(formData.ast_log),
        alp_log: Number.parseFloat(formData.alp_log),
      }
      console.log("Submitting form with data:", apiData)

      const predictionResponse = await fetch("http://localhost:8000/predict/hepatitis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      })

      if (!predictionResponse.ok) {
        throw new Error("Failed to get prediction from the model")
      }

      const predictionData = await predictionResponse.json()
      setResult(predictionData)

      setActiveTab("results")
    } catch (err) {
      console.error("Error submitting form:", err)
      setError(err instanceof Error ? err.message : "An error occurred while processing your request")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showBackButton />
      <div className="container mx-auto max-w-4xl py-6 flex-1">
        <h1 className="text-3xl font-bold mb-6">Hepatitis Risk Assessment</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form">Assessment Form</TabsTrigger>
            <TabsTrigger value="results" disabled={!result}>
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form">
            <Card className="p-6">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        placeholder="Enter your age"
                        value={formData.age}
                        onChange={handleInputChange}
                        min="1"
                        max="120"
                        step="1"
                        required
                      />
                    </div>

                    <div>
                      <Label className="text-base font-medium">Sex</Label>
                      <RadioGroup
                        value={formData.sex}
                        onValueChange={(value) => handleRadioChange("sex", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="sex-female" />
                          <Label htmlFor="sex-female">Female</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="sex-male" />
                          <Label htmlFor="sex-male">Male</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="alb">ALB (Albumin)</Label>
                      <Input
                        id="alb"
                        name="alb"
                        type="number"
                        placeholder="Enter ALB value"
                        value={formData.alb}
                        onChange={handleInputChange}
                        step="0.01"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="che">CHE (Cholinesterase)</Label>
                      <Input
                        id="che"
                        name="che"
                        type="number"
                        placeholder="Enter CHE value"
                        value={formData.che}
                        onChange={handleInputChange}
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="chol">CHOL (Cholesterol)</Label>
                      <Input
                        id="chol"
                        name="chol"
                        type="number"
                        placeholder="Enter CHOL value"
                        value={formData.chol}
                        onChange={handleInputChange}
                        step="0.01"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="crea_log">CREA_log (Creatinine log)</Label>
                      <Input
                        id="crea_log"
                        name="crea_log"
                        type="number"
                        placeholder="Enter CREA_log value"
                        value={formData.crea_log}
                        onChange={handleInputChange}
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bil_log">BIL_log (Bilirubin log)</Label>
                      <Input
                        id="bil_log"
                        name="bil_log"
                        type="number"
                        placeholder="Enter BIL_log value"
                        value={formData.bil_log}
                        onChange={handleInputChange}
                        step="0.01"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="alt_log">ALT_log (Alanine Transaminase log)</Label>
                      <Input
                        id="alt_log"
                        name="alt_log"
                        type="number"
                        placeholder="Enter ALT_log value"
                        value={formData.alt_log}
                        onChange={handleInputChange}
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ggt_log">GGT_log (Gamma-Glutamyl Transferase log)</Label>
                      <Input
                        id="ggt_log"
                        name="ggt_log"
                        type="number"
                        placeholder="Enter GGT_log value"
                        value={formData.ggt_log}
                        onChange={handleInputChange}
                        step="0.01"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ast_log">AST_log (Aspartate Aminotransferase log)</Label>
                      <Input
                        id="ast_log"
                        name="ast_log"
                        type="number"
                        placeholder="Enter AST_log value"
                        value={formData.ast_log}
                        onChange={handleInputChange}
                        step="0.01"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="alp_log">ALP_log (Alkaline Phosphatase log)</Label>
                      <Input
                        id="alp_log"
                        name="alp_log"
                        type="number"
                        placeholder="Enter ALP_log value"
                        value={formData.alp_log}
                        onChange={handleInputChange}
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Submit Assessment"
                  )}
                </Button>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="results">
            {result && (
              <Card className="p-6">
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Assessment Results</h2>
                    <div
                      className={`text-3xl font-bold ${result.prediction === 1 ? "text-red-500" : "text-green-500"}`}
                    >
                      {result.risk_status ||
                        (result.prediction === 1 ? "High Risk of Hepatitis" : "Low Risk of Hepatitis")}
                    </div>
                    {result.probability !== undefined && (
                      <p className="mt-2 text-lg">Confidence: {(result.probability * 100).toFixed(2)}%</p>
                    )}
                  </div>
                  <div className="border-t pt-4">
                    <h3 className="text-xl font-semibold mb-3">AI Analysis</h3>
                    {isSummaryLoading ? (
                      <div className="flex justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : summary ? (
                      <div className="text-muted-foreground whitespace-pre-wrap">{summary}</div>
                    ) : (
                      <div className="text-muted-foreground">No analysis available. Please try again later.</div>
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-xl font-semibold mb-3">Your Assessment Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">Age:</p>
                        <p className="text-muted-foreground">{formData.age} years</p>
                      </div>
                      <div>
                        <p className="font-medium">Sex:</p>
                        <p className="text-muted-foreground">{formData.sex === "0" ? "Female" : "Male"}</p>
                      </div>
                      <div>
                        <p className="font-medium">ALB (Albumin):</p>
                        <p className="text-muted-foreground">{formData.alb}</p>
                      </div>
                      <div>
                        <p className="font-medium">CHE (Cholinesterase):</p>
                        <p className="text-muted-foreground">{formData.che}</p>
                      </div>
                      <div>
                        <p className="font-medium">CHOL (Cholesterol):</p>
                        <p className="text-muted-foreground">{formData.chol}</p>
                      </div>
                      <div>
                        <p className="font-medium">CREA_log (Creatinine log):</p>
                        <p className="text-muted-foreground">{formData.crea_log}</p>
                      </div>
                      <div>
                        <p className="font-medium">BIL_log (Bilirubin log):</p>
                        <p className="text-muted-foreground">{formData.bil_log}</p>
                      </div>
                      <div>
                        <p className="font-medium">ALT_log (Alanine Transaminase log):</p>
                        <p className="text-muted-foreground">{formData.alt_log}</p>
                      </div>
                      <div>
                        <p className="font-medium">GGT_log (Gamma-Glutamyl Transferase log):</p>
                        <p className="text-muted-foreground">{formData.ggt_log}</p>
                      </div>
                      <div>
                        <p className="font-medium">AST_log (Aspartate Aminotransferase log):</p>
                        <p className="text-muted-foreground">{formData.ast_log}</p>
                      </div>
                      <div>
                        <p className="font-medium">ALP_log (Alkaline Phosphatase log):</p>
                        <p className="text-muted-foreground">{formData.alp_log}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab("form")}>
                      Back to Form
                    </Button>
                    <Button
                      onClick={() => {
                        setFormData({
                          age: "",
                          sex: "0",
                          alb: "",
                          che: "",
                          chol: "",
                          crea_log: "",
                          bil_log: "",
                          alt_log: "",
                          ggt_log: "",
                          ast_log: "",
                          alp_log: "",
                        })
                        setResult(null)
                        setSummary("")
                        setActiveTab("form")
                      }}
                    >
                      Start New Assessment
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
