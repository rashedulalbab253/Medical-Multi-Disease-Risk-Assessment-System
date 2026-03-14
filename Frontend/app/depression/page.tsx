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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FormData {
  Gender: string
  Age: string
  Academic_Pressure: string
  CGPA: string
  Study_Satisfaction: string
  Sleep_Duration: string
  Dietary_Habits: string
  "Have you ever had suicidal thoughts ?": string
  "Work/Study Hours": string
  Financial_Stress: string
  "Family History of Mental Illness": string
  New_Degree: string
}

interface PredictionResult {
  prediction: number
  risk_status?: string
  probability?: number
}

export default function DepressionPage() {
  const [activeTab, setActiveTab] = useState("form")
  const [isLoading, setIsLoading] = useState(false)
  const [isSummaryLoading, setIsSummaryLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<FormData>({
    Gender: "0",
    Age: "",
    Academic_Pressure: "3",
    CGPA: "",
    Study_Satisfaction: "3",
    Sleep_Duration: "2",
    Dietary_Habits: "1",
    New_Degree: "0",
    "Have you ever had suicidal thoughts ?": "0",
    "Work/Study Hours": "",
    Financial_Stress: "3",
    "Family History of Mental Illness": "0",
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
    const { Age, CGPA, "Work/Study Hours": workStudyHours } = formData

    if (!Age || isNaN(Number(Age)) || Number(Age) <= 0 || Number(Age) > 120) {
      setError("Please enter a valid age between 1 and 120")
      return false
    }

    if (!CGPA || isNaN(Number(CGPA)) || Number(CGPA) < 0 || Number(CGPA) > 10) {
      setError("Please enter a valid CGPA between 0 and 10")
      return false
    }

    if (!workStudyHours || isNaN(Number(workStudyHours)) || Number(workStudyHours) < 0 || Number(workStudyHours) > 24) {
      setError("Please enter valid work/study hours between 0 and 24")
      return false
    }

    return true
  }

  const { isAuthenticated } = useAuth()

  const fetchAISummary = async (predictionData: PredictionResult) => {
    setIsSummaryLoading(true)

    try {
      const parameters = {
        Gender: Number.parseInt(formData.Gender),
        Age: Number.parseFloat(formData.Age),
        "Academic Pressure": Number.parseFloat(formData.Academic_Pressure),
        CGPA: Number.parseFloat(formData.CGPA),
        "Study Satisfaction": Number.parseFloat(formData.Study_Satisfaction),
        "Sleep Duration": Number.parseInt(formData.Sleep_Duration),
        "Dietary Habits": Number.parseInt(formData.Dietary_Habits),
        "Have you ever had suicidal thoughts ?": Number.parseInt(formData["Have you ever had suicidal thoughts ?"]),
        "Work/Study Hours": Number.parseFloat(formData["Work/Study Hours"]),
        "Financial Stress": Number.parseFloat(formData.Financial_Stress),
        "Family History of Mental Illness": Number.parseInt(formData["Family History of Mental Illness"]),
        New_Degree: Number.parseInt(formData.New_Degree),
      }

      const summaryResponse = await fetch("/api/ai-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          disease: "depression",
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

      // Map formData to backend schema
      const apiData = {
        gender: Number.parseInt(formData.Gender),
        age: Number.parseFloat(formData.Age),
        city: 0, // TODO: Replace with actual city selection if available
        academic_pressure: Number.parseFloat(formData.Academic_Pressure),
        cgpa: Number.parseFloat(formData.CGPA),
        study_satisfaction: Number.parseFloat(formData.Study_Satisfaction),
        sleep_duration: Number.parseInt(formData.Sleep_Duration),
        dietary_habits: Number.parseInt(formData.Dietary_Habits),
        suicidal_thoughts: Number.parseInt(formData["Have you ever had suicidal thoughts ?"]),
        work_study_hours: Number.parseFloat(formData["Work/Study Hours"]),
        financial_stress: Number.parseFloat(formData.Financial_Stress),
        family_history_mental_illness: Number.parseInt(formData["Family History of Mental Illness"]),
        new_degree: Number.parseInt(formData.New_Degree),
      }
      console.log("Submitting form with data:", apiData)

      const predictionResponse = await fetch("http://localhost:8000/predict/depression", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      })

      if (!predictionResponse.ok) {
        // Log status and body for debugging
        const errText = await predictionResponse.text()
        console.error(`Prediction API error ${predictionResponse.status}: ${errText}`)
        throw new Error(`Failed to get prediction from the model: ${errText}`)
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
        <h1 className="text-3xl font-bold mb-6">Depression Risk Assessment</h1>

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
                    <div>
                      <Label className="text-base font-medium">Gender</Label>
                      <RadioGroup
                        value={formData.Gender}
                        onValueChange={(value) => handleRadioChange("Gender", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="gender-female" />
                          <Label htmlFor="gender-female">Female</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="gender-male" />
                          <Label htmlFor="gender-male">Male</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="Age">Age</Label>
                      <Input
                        id="Age"
                        name="Age"
                        type="number"
                        placeholder="Enter your age"
                        value={formData.Age}
                        onChange={handleInputChange}
                        min="1"
                        max="120"
                        step="1"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="Academic_Pressure">Academic Pressure (1-5)</Label>
                      <Select
                        value={formData.Academic_Pressure}
                        onValueChange={(value) => handleSelectChange("Academic_Pressure", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 (Very Low)</SelectItem>
                          <SelectItem value="2">2 (Low)</SelectItem>
                          <SelectItem value="3">3 (Moderate)</SelectItem>
                          <SelectItem value="4">4 (High)</SelectItem>
                          <SelectItem value="5">5 (Very High)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="CGPA">CGPA</Label>
                      <Input
                        id="CGPA"
                        name="CGPA"
                        type="number"
                        placeholder="Enter your CGPA"
                        value={formData.CGPA}
                        onChange={handleInputChange}
                        min="0"
                        max="10"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="Study_Satisfaction">Study Satisfaction (1-5)</Label>
                      <Select
                        value={formData.Study_Satisfaction}
                        onValueChange={(value) => handleSelectChange("Study_Satisfaction", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 (Very Dissatisfied)</SelectItem>
                          <SelectItem value="2">2 (Dissatisfied)</SelectItem>
                          <SelectItem value="3">3 (Neutral)</SelectItem>
                          <SelectItem value="4">4 (Satisfied)</SelectItem>
                          <SelectItem value="5">5 (Very Satisfied)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="Sleep_Duration">Sleep Duration</Label>
                      <Select
                        value={formData.Sleep_Duration}
                        onValueChange={(value) => handleSelectChange("Sleep_Duration", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Less than 5 hours</SelectItem>
                          <SelectItem value="1">5-6 hours</SelectItem>
                          <SelectItem value="2">7-8 hours</SelectItem>
                          <SelectItem value="3">More than 8 hours</SelectItem>
                          <SelectItem value="4">Others</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="Dietary_Habits">Dietary Habits</Label>
                      <Select
                        value={formData.Dietary_Habits}
                        onValueChange={(value) => handleSelectChange("Dietary_Habits", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select habits" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Unhealthy</SelectItem>
                          <SelectItem value="1">Moderate</SelectItem>
                          <SelectItem value="2">Healthy</SelectItem>
                          <SelectItem value="3">Others</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="New_Degree">Education Level</Label>
                      <Select
                        value={formData.New_Degree}
                        onValueChange={(value) => handleSelectChange("New_Degree", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Graduated</SelectItem>
                          <SelectItem value="1">Post Graduated</SelectItem>
                          <SelectItem value="2">Higher Secondary</SelectItem>
                          <SelectItem value="3">Others</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-base font-medium">Have you ever had suicidal thoughts?</Label>
                      <RadioGroup
                        value={formData["Have you ever had suicidal thoughts ?"]}
                        onValueChange={(value) => handleRadioChange("Have you ever had suicidal thoughts ?", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="suicidal-no" />
                          <Label htmlFor="suicidal-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="suicidal-yes" />
                          <Label htmlFor="suicidal-yes">Yes</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="Work/Study Hours">Work/Study Hours per day</Label>
                      <Input
                        id="Work/Study Hours"
                        name="Work/Study Hours"
                        type="number"
                        placeholder="Enter hours"
                        value={formData["Work/Study Hours"]}
                        onChange={handleInputChange}
                        min="0"
                        max="24"
                        step="0.5"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="Financial_Stress">Financial Stress (1-5)</Label>
                      <Select
                        value={formData.Financial_Stress}
                        onValueChange={(value) => handleSelectChange("Financial_Stress", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 (Very Low)</SelectItem>
                          <SelectItem value="2">2 (Low)</SelectItem>
                          <SelectItem value="3">3 (Moderate)</SelectItem>
                          <SelectItem value="4">4 (High)</SelectItem>
                          <SelectItem value="5">5 (Very High)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Family History of Mental Illness</Label>
                      <RadioGroup
                        value={formData["Family History of Mental Illness"]}
                        onValueChange={(value) => handleRadioChange("Family History of Mental Illness", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="family-history-no" />
                          <Label htmlFor="family-history-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="family-history-yes" />
                          <Label htmlFor="family-history-yes">Yes</Label>
                        </div>
                      </RadioGroup>
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
                        (result.prediction === 1 ? "High Risk of Depression" : "Low Risk of Depression")}
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
                        <p className="font-medium">Gender:</p>
                        <p className="text-muted-foreground">{formData.Gender === "0" ? "Female" : "Male"}</p>
                      </div>
                      <div>
                        <p className="font-medium">Age:</p>
                        <p className="text-muted-foreground">{formData.Age} years</p>
                      </div>
                      <div>
                        <p className="font-medium">Academic Pressure:</p>
                        <p className="text-muted-foreground">{formData.Academic_Pressure} out of 5</p>
                      </div>
                      <div>
                        <p className="font-medium">CGPA:</p>
                        <p className="text-muted-foreground">{formData.CGPA}</p>
                      </div>
                      <div>
                        <p className="font-medium">Study Satisfaction:</p>
                        <p className="text-muted-foreground">{formData.Study_Satisfaction} out of 5</p>
                      </div>
                      <div>
                        <p className="font-medium">Sleep Duration:</p>
                        <p className="text-muted-foreground">
                          {formData.Sleep_Duration === "0"
                            ? "Less than 5 hours"
                            : formData.Sleep_Duration === "1"
                              ? "5-6 hours"
                              : formData.Sleep_Duration === "2"
                                ? "7-8 hours"
                                : formData.Sleep_Duration === "3"
                                  ? "More than 8 hours"
                                  : "Others"}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Dietary Habits:</p>
                        <p className="text-muted-foreground">
                          {formData.Dietary_Habits === "0"
                            ? "Unhealthy"
                            : formData.Dietary_Habits === "1"
                              ? "Moderate"
                              : formData.Dietary_Habits === "2"
                                ? "Healthy"
                                : "Others"}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Education Level:</p>
                        <p className="text-muted-foreground">
                          {formData.New_Degree === "0"
                            ? "Graduated"
                            : formData.New_Degree === "1"
                              ? "Post Graduated"
                              : formData.New_Degree === "2"
                                ? "Higher Secondary"
                                : "Others"}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Suicidal Thoughts:</p>
                        <p className="text-muted-foreground">
                          {formData["Have you ever had suicidal thoughts ?"] === "1" ? "Yes" : "No"}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Work/Study Hours:</p>
                        <p className="text-muted-foreground">{formData["Work/Study Hours"]} hours per day</p>
                      </div>
                      <div>
                        <p className="font-medium">Financial Stress:</p>
                        <p className="text-muted-foreground">{formData.Financial_Stress} out of 5</p>
                      </div>
                      <div>
                        <p className="font-medium">Family History of Mental Illness:</p>
                        <p className="text-muted-foreground">
                          {formData["Family History of Mental Illness"] === "1" ? "Yes" : "No"}
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
                          Gender: "0",
                          Age: "",
                          Academic_Pressure: "3",
                          CGPA: "",
                          Study_Satisfaction: "3",
                          Sleep_Duration: "2",
                          Dietary_Habits: "1",
                          New_Degree: "0",
                          "Have you ever had suicidal thoughts ?": "0",
                          "Work/Study Hours": "",
                          Financial_Stress: "3",
                          "Family History of Mental Illness": "0",
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
