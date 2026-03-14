"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Loader2 } from 'lucide-react'
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface FormData {
  gender: string
  age: string
  hypertension: string
  heart_disease: string
  ever_married: string
  work_type: string
  residence_type: string
  avg_glucose_level: string
  bmi: string
  smoking_status: string
}

interface PredictionResult {
  prediction: number
  risk_status?: string
  probability?: number
}

export default function StrokePage() {
  const [activeTab, setActiveTab] = useState("form")
  const [isLoading, setIsLoading] = useState(false)
  const [isSummaryLoading, setIsSummaryLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<FormData>({
    gender: "0", // Default to male
    age: "",
    hypertension: "0", // Default to no
    heart_disease: "0", // Default to no
    ever_married: "0", // Default to no
    work_type: "0", // Default to private
    residence_type: "0", // Default to urban
    avg_glucose_level: "",
    bmi: "",
    smoking_status: "0", // Default to never smoked
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    const { age, avg_glucose_level, bmi } = formData

    if (!age || isNaN(Number(age)) || Number(age) <= 0 || Number(age) > 120) {
      setError("Please enter a valid age between 1 and 120")
      return false
    }

    if (!avg_glucose_level || isNaN(Number(avg_glucose_level)) || Number(avg_glucose_level) < 50 || Number(avg_glucose_level) > 300) {
      setError("Please enter a valid average glucose level between 50 and 300")
      return false
    }

    if (!bmi || isNaN(Number(bmi)) || Number(bmi) < 10 || Number(bmi) > 50) {
      setError("Please enter a valid BMI between 10 and 50")
      return false
    }

    return true
  }
  
  const { isAuthenticated } = useAuth();
  
  const fetchAISummary = async (predictionData: PredictionResult) => {
    setIsSummaryLoading(true)
    
    try {
      const parameters = {
        gender: Number.parseInt(formData.gender),
        age: Number.parseFloat(formData.age),
        hypertension: Number.parseInt(formData.hypertension),
        heart_disease: Number.parseInt(formData.heart_disease),
        ever_married: Number.parseInt(formData.ever_married),
        work_type: Number.parseInt(formData.work_type),
        residence_type: Number.parseInt(formData.residence_type),
        avg_glucose_level: Number.parseFloat(formData.avg_glucose_level),
        bmi: Number.parseFloat(formData.bmi),
        smoking_status: Number.parseInt(formData.smoking_status),
      }

      const summaryResponse = await fetch("/api/ai-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          disease: "stroke",
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
        gender: Number.parseInt(formData.gender),
        age: Number.parseFloat(formData.age),
        hypertension: Number.parseInt(formData.hypertension),
        heart_disease: Number.parseInt(formData.heart_disease),
        ever_married: Number.parseInt(formData.ever_married),
        work_type: Number.parseInt(formData.work_type),
        residence_type: Number.parseInt(formData.residence_type),
        avg_glucose_level: Number.parseFloat(formData.avg_glucose_level),
        bmi: Number.parseFloat(formData.bmi),
        smoking_status: Number.parseInt(formData.smoking_status),
      }

      const predictionResponse = await fetch("http://localhost:8000/predict/stroke", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      if (!predictionResponse.ok) {
        throw new Error("Failed to get prediction from the model");
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
        <h1 className="text-3xl font-bold mb-6">Stroke Risk Assessment</h1>

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
                    <Label className="text-base font-medium">Ever Married?</Label>
                    <RadioGroup
                      value={formData.ever_married}
                      onValueChange={(value) => handleRadioChange("ever_married", value)}
                      className="flex flex-row gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="0" id="ever-married-no" />
                        <Label htmlFor="ever-married-no">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1" id="ever-married-yes" />
                        <Label htmlFor="ever-married-yes">Yes</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="work_type">Work Type</Label>
                    <Select 
                      value={formData.work_type} 
                      onValueChange={(value) => handleSelectChange("work_type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select work type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Private</SelectItem>
                        <SelectItem value="1">Self-employed</SelectItem>
                        <SelectItem value="2">Government Job</SelectItem>
                        <SelectItem value="3">Children</SelectItem>
                        <SelectItem value="4">Never worked</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Residence Type</Label>
                    <RadioGroup
                      value={formData.residence_type}
                      onValueChange={(value) => handleRadioChange("residence_type", value)}
                      className="flex flex-row gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="0" id="residence-urban" />
                        <Label htmlFor="residence-urban">Urban</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1" id="residence-rural" />
                        <Label htmlFor="residence-rural">Rural</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="avg_glucose_level">Average Glucose Level (mg/dL)</Label>
                    <Input
                      id="avg_glucose_level"
                      name="avg_glucose_level"
                      type="number"
                      placeholder="Enter your average glucose level"
                      value={formData.avg_glucose_level}
                      onChange={handleInputChange}
                      min="50"
                      max="300"
                      step="0.1"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smoking_status">Smoking Status</Label>
                    <Select 
                      value={formData.smoking_status} 
                      onValueChange={(value) => handleSelectChange("smoking_status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select smoking status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Never smoked</SelectItem>
                        <SelectItem value="1">Formerly smoked</SelectItem>
                        <SelectItem value="2">Smokes</SelectItem>
                        <SelectItem value="3">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
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
                      {result.risk_status || (result.prediction === 1 ? "High Risk of Stroke" : "Low Risk of Stroke")}
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
                        <p className="font-medium">Ever Married:</p>
                        <p className="text-muted-foreground">{formData.ever_married === "1" ? "Yes" : "No"}</p>
                      </div>
                      <div>
                        <p className="font-medium">Work Type:</p>
                        <p className="text-muted-foreground">
                          {formData.work_type === "0" ? "Private" : 
                           formData.work_type === "1" ? "Self-employed" :
                           formData.work_type === "2" ? "Government Job" :
                           formData.work_type === "3" ? "Children" : "Never worked"}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Residence Type:</p>
                        <p className="text-muted-foreground">{formData.residence_type === "0" ? "Urban" : "Rural"}</p>
                      </div>
                      <div>
                        <p className="font-medium">Average Glucose Level:</p>
                        <p className="text-muted-foreground">{formData.avg_glucose_level} mg/dL</p>
                      </div>
                      <div>
                        <p className="font-medium">BMI:</p>
                        <p className="text-muted-foreground">{formData.bmi} kg/m²</p>
                      </div>
                      <div>
                        <p className="font-medium">Smoking Status:</p>
                        <p className="text-muted-foreground">
                          {formData.smoking_status === "0" ? "Never smoked" :
                           formData.smoking_status === "1" ? "Formerly smoked" :
                           formData.smoking_status === "2" ? "Smokes" : "Unknown"}
                        </p>
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
                          ever_married: "0",
                          work_type: "0",
                          residence_type: "0",
                          avg_glucose_level: "",
                          bmi: "",
                          smoking_status: "0",
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
