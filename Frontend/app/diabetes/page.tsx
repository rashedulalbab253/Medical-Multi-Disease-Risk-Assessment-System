"use client"

import type React from "react"

import { useState, useEffect } from "react" // Added useEffect
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
  gender: string
  age: string
  hypertension: string
  heart_disease: string
  smoking_history: string
  bmi: string
  hba1c_level: string
  blood_glucose_level: string
}

interface PredictionResult {
  prediction: number
  risk_status?: string
  probability?: number  // Keep this optional for backward compatibility
}

export default function DiabetesPage() {
  const [activeTab, setActiveTab] = useState("form")
  const [isLoading, setIsLoading] = useState(false)
  const [isSummaryLoading, setIsSummaryLoading] = useState(false) // Added new state for summary loading
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<FormData>({
    gender: "0", // Default to male
    age: "",
    hypertension: "0", // Default to no
    heart_disease: "0", // Default to no
    smoking_history: "0", // Default to never smoked
    bmi: "",
    hba1c_level: "",
    blood_glucose_level: "",
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
    const { age, bmi, hba1c_level, blood_glucose_level } = formData

    if (!age || isNaN(Number(age)) || Number(age) <= 0 || Number(age) > 120) {
      setError("Please enter a valid age between 1 and 120")
      return false
    }

    if (!bmi || isNaN(Number(bmi)) || Number(bmi) < 10 || Number(bmi) > 50) {
      setError("Please enter a valid BMI between 10 and 50")
      return false
    }

    if (!hba1c_level || isNaN(Number(hba1c_level)) || Number(hba1c_level) < 3 || Number(hba1c_level) > 15) {
      setError("Please enter a valid HbA1c level between 3 and 15")
      return false
    }

    if (
      !blood_glucose_level ||
      isNaN(Number(blood_glucose_level)) ||
      Number(blood_glucose_level) < 50 ||
      Number(blood_glucose_level) > 400
    ) {
      setError("Please enter a valid blood glucose level between 50 and 400")
      return false
    }

    return true
  }
  
  const { isAuthenticated } = useAuth();
  
  // New function to fetch AI summary
  const fetchAISummary = async (predictionData: PredictionResult) => {
    setIsSummaryLoading(true)
    
    try {
      // Format the parameters for the AI summary API
      const parameters = {
        gender: Number.parseInt(formData.gender),
        age: Number.parseFloat(formData.age),
        hypertension: Number.parseInt(formData.hypertension),
        heart_disease: Number.parseInt(formData.heart_disease),
        smoking_history: Number.parseInt(formData.smoking_history),
        bmi: Number.parseFloat(formData.bmi),
        HbA1c_level: Number.parseFloat(formData.hba1c_level),
        blood_glucose_level: Number.parseInt(formData.blood_glucose_level),
      }

      // Call the API route for AI summary
      const summaryResponse = await fetch("/api/ai-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          disease: "diabetes",
          parameters,
          prediction: predictionData.prediction,
          probability: predictionData.probability || 0.5, // Default probability if not provided
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

  // Effect to fetch AI summary when result changes
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
      // Check if user is authenticated 
      if (!isAuthenticated) {
        throw new Error("You must be logged in to access this feature")
      }
      
      // Convert form data to the format expected by the API
      const apiData = {
        gender: Number.parseInt(formData.gender),
        age: Number.parseFloat(formData.age),
        hypertension: Number.parseInt(formData.hypertension),
        heart_disease: Number.parseInt(formData.heart_disease),
        smoking_history: Number.parseInt(formData.smoking_history),
        bmi: Number.parseFloat(formData.bmi),
        HbA1c_level: Number.parseFloat(formData.hba1c_level),
        blood_glucose_level: Number.parseInt(formData.blood_glucose_level),
      }
      console.log("Submitting form with data:", apiData)

      // Call the FastAPI backend for prediction without token
      const predictionResponse = await fetch("http://localhost:8000/predict/diabetes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      })

      if (!predictionResponse.ok) {
        const errText = await predictionResponse.text()
        console.error(`Prediction API error ${predictionResponse.status}: ${errText}`)

        throw new Error(`Failed to get prediction from the model: ${errText}`)
      }

      const predictionData = await predictionResponse.json()
      setResult(predictionData)

      // Switch to results tab
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
        <h1 className="text-3xl font-bold mb-6">Diabetes Risk Assessment</h1>

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
                  <div>
                    <Label className="text-base font-medium">Gender</Label>
                    <RadioGroup
                      value={formData.gender}
                      onValueChange={(value) => handleRadioChange("gender", value)}
                      className="flex flex-row gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="0" id="gender-male" />
                        <Label htmlFor="gender-male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1" id="gender-female" />
                        <Label htmlFor="gender-female">Female</Label>
                      </div>
                    </RadioGroup>
                  </div>

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

                    <div className="space-y-2">
                      <Label htmlFor="bmi">BMI (Body Mass Index)</Label>
                      <Input
                        id="bmi"
                        name="bmi"
                        type="number"
                        placeholder="Enter your BMI"
                        value={formData.bmi}
                        onChange={handleInputChange}
                        min="10"
                        max="50"
                        step="0.1"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Do you have hypertension?</Label>
                    <RadioGroup
                      value={formData.hypertension}
                      onValueChange={(value) => handleRadioChange("hypertension", value)}
                      className="flex flex-row gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="0" id="hypertension-no" />
                        <Label htmlFor="hypertension-no">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1" id="hypertension-yes" />
                        <Label htmlFor="hypertension-yes">Yes</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Do you have heart disease?</Label>
                    <RadioGroup
                      value={formData.heart_disease}
                      onValueChange={(value) => handleRadioChange("heart_disease", value)}
                      className="flex flex-row gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="0" id="heart-disease-no" />
                        <Label htmlFor="heart-disease-no">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1" id="heart-disease-yes" />
                        <Label htmlFor="heart-disease-yes">Yes</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Smoking History</Label>
                    <RadioGroup
                      value={formData.smoking_history}
                      onValueChange={(value) => handleRadioChange("smoking_history", value)}
                      className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="0" id="smoking-never" />
                        <Label htmlFor="smoking-never">Never Smoked</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1" id="smoking-current" />
                        <Label htmlFor="smoking-current">Current Smoker</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="2" id="smoking-former" />
                        <Label htmlFor="smoking-former">Former Smoker</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="3" id="smoking-no-info" />
                        <Label htmlFor="smoking-no-info">No Information</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hba1c_level">HbA1c Level (%)</Label>
                      <Input
                        id="hba1c_level"
                        name="hba1c_level"
                        type="number"
                        placeholder="Enter your HbA1c level"
                        value={formData.hba1c_level}
                        onChange={handleInputChange}
                        min="3"
                        max="15"
                        step="0.1"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="blood_glucose_level">Blood Glucose Level (mg/dL)</Label>
                      <Input
                        id="blood_glucose_level"
                        name="blood_glucose_level"
                        type="number"
                        placeholder="Enter your blood glucose level"
                        value={formData.blood_glucose_level}
                        onChange={handleInputChange}
                        min="50"
                        max="400"
                        step="1"
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
                      {result.risk_status || (result.prediction === 1 ? "High Risk of Diabetes" : "Low Risk of Diabetes")}
                    </div>
                    {result.probability !== undefined && (
                      <p className="mt-2 text-lg">
                        Confidence: {(result.probability * 100).toFixed(2)}%
                      </p>
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
                      <div className="text-muted-foreground">
                        No analysis available. Please try again later.
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-xl font-semibold mb-3">Your Assessment Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">Gender:</p>
                        <p className="text-muted-foreground">{formData.gender === "0" ? "Male" : "Female"}</p>
                      </div>
                      <div>
                        <p className="font-medium">Age:</p>
                        <p className="text-muted-foreground">{formData.age} years</p>
                      </div>
                      <div>
                        <p className="font-medium">Hypertension:</p>
                        <p className="text-muted-foreground">{formData.hypertension === "1" ? "Yes" : "No"}</p>
                      </div>
                      <div>
                        <p className="font-medium">Heart Disease:</p>
                        <p className="text-muted-foreground">{formData.heart_disease === "1" ? "Yes" : "No"}</p>
                      </div>
                      <div>
                        <p className="font-medium">Smoking History:</p>
                        <p className="text-muted-foreground">
                          {formData.smoking_history === "0"
                            ? "Never Smoked"
                            : formData.smoking_history === "1"
                              ? "Current Smoker"
                              : formData.smoking_history === "2"
                                ? "Former Smoker"
                                : "No Information"}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">BMI:</p>
                        <p className="text-muted-foreground">{formData.bmi} kg/m²</p>
                      </div>
                      <div>
                        <p className="font-medium">HbA1c Level:</p>
                        <p className="text-muted-foreground">{formData.hba1c_level}%</p>
                      </div>
                      <div>
                        <p className="font-medium">Blood Glucose Level:</p>
                        <p className="text-muted-foreground">{formData.blood_glucose_level} mg/dL</p>
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
                          gender: "0",
                          age: "",
                          hypertension: "0",
                          heart_disease: "0",
                          smoking_history: "0",
                          bmi: "",
                          hba1c_level: "",
                          blood_glucose_level: "",
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