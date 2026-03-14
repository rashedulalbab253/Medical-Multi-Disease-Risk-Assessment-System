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
import { Navbar } from "@/components/navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface FormData {
  age: string
  sex: string
  thyroxine: string
  queryonthyroxine: string
  onantithyroidmedication: string
  sick: string
  pregnant: string
  thyroidsurgery: string
  I131treatment: string
  queryhypothyroid: string
  queryhyperthyroid: string
  lithium: string
  goitre: string
  tumor: string
  hypopituitary: string
  psych: string
  TSH: string
  T3: string
  T4: string
  T4U: string
  FTI: string
}

interface PredictionResult {
  prediction: number
  risk_status?: string
  probability?: number
}

export default function ThyroidPage() {
  const [activeTab, setActiveTab] = useState("form")
  const [isLoading, setIsLoading] = useState(false)
  const [isSummaryLoading, setIsSummaryLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<FormData>({
    age: "",
    sex: "0", // Default to Female
    thyroxine: "0", // Default to No
    queryonthyroxine: "0", // Default to No
    onantithyroidmedication: "0", // Default to No
    sick: "0", // Default to No
    pregnant: "0", // Default to No
    thyroidsurgery: "0", // Default to No
    I131treatment: "0", // Default to No
    queryhypothyroid: "0", // Default to No
    queryhyperthyroid: "0", // Default to No
    lithium: "0", // Default to No
    goitre: "0", // Default to No
    tumor: "0", // Default to No
    hypopituitary: "0", // Default to No
    psych: "0", // Default to No
    TSH: "",
    T3: "",
    T4: "",
    T4U: "",
    FTI: "",
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
    const { age, TSH, T3, T4, T4U, FTI } = formData

    if (!age || isNaN(Number(age)) || Number(age) < 12 || Number(age) > 92) {
      setError("Please enter a valid age between 12 and 92")
      return false
    }

    if (!TSH || isNaN(Number(TSH)) || Number(TSH) < 0 || Number(TSH) > 40) {
      setError("Please enter a valid TSH value between 0 and 40")
      return false
    }

    if (!T3 || isNaN(Number(T3)) || Number(T3) < 0 || Number(T3) > 6.6) {
      setError("Please enter a valid T3 value between 0 and 6.6")
      return false
    }

    if (!T4 || isNaN(Number(T4)) || Number(T4) < 0 || Number(T4) > 258) {
      setError("Please enter a valid T4 value between 0 and 258")
      return false
    }

    if (!T4U || isNaN(Number(T4U)) || Number(T4U) < 0 || Number(T4U) > 1.5) {
      setError("Please enter a valid T4U value between 0 and 1.5")
      return false
    }

    if (!FTI || isNaN(Number(FTI)) || Number(FTI) < 0 || Number(FTI) > 227) {
      setError("Please enter a valid FTI value between 0 and 227")
      return false
    }

    return true
  }
  
  const { isAuthenticated } = useAuth();
  
  const fetchAISummary = async (predictionData: PredictionResult) => {
    setIsSummaryLoading(true)
    
    try {
      const parameters = {
        age: Number.parseFloat(formData.age),
        sex: Number.parseInt(formData.sex),
        thyroxine: Number.parseInt(formData.thyroxine),
        queryonthyroxine: Number.parseInt(formData.queryonthyroxine),
        onantithyroidmedication: Number.parseInt(formData.onantithyroidmedication),
        sick: Number.parseInt(formData.sick),
        pregnant: Number.parseInt(formData.pregnant),
        thyroidsurgery: Number.parseInt(formData.thyroidsurgery),
        I131treatment: Number.parseInt(formData.I131treatment),
        queryhypothyroid: Number.parseInt(formData.queryhypothyroid),
        queryhyperthyroid: Number.parseInt(formData.queryhyperthyroid),
        lithium: Number.parseInt(formData.lithium),
        goitre: Number.parseInt(formData.goitre),
        tumor: Number.parseInt(formData.tumor),
        hypopituitary: Number.parseInt(formData.hypopituitary),
        psych: Number.parseInt(formData.psych),
        TSH: Number.parseFloat(formData.TSH),
        T3: Number.parseFloat(formData.T3),
        T4: Number.parseFloat(formData.T4),
        T4U: Number.parseFloat(formData.T4U),
        FTI: Number.parseFloat(formData.FTI),
      }

      const summaryResponse = await fetch("/api/ai-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          disease: "thyroid",
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
        age: Number.parseFloat(formData.age),
        sex: Number.parseInt(formData.sex),
        thyroxine: Number.parseInt(formData.thyroxine),
        queryonthyroxine: Number.parseInt(formData.queryonthyroxine),
        onantithyroidmedication: Number.parseInt(formData.onantithyroidmedication),
        sick: Number.parseInt(formData.sick),
        pregnant: Number.parseInt(formData.pregnant),
        thyroidsurgery: Number.parseInt(formData.thyroidsurgery),
        I131treatment: Number.parseInt(formData.I131treatment),
        queryhypothyroid: Number.parseInt(formData.queryhypothyroid),
        queryhyperthyroid: Number.parseInt(formData.queryhyperthyroid),
        lithium: Number.parseInt(formData.lithium),
        goitre: Number.parseInt(formData.goitre),
        tumor: Number.parseInt(formData.tumor),
        hypopituitary: Number.parseInt(formData.hypopituitary),
        psych: Number.parseInt(formData.psych),
        TSH: Number.parseFloat(formData.TSH),
        T3: Number.parseFloat(formData.T3),
        T4: Number.parseFloat(formData.T4),
        T4U: Number.parseFloat(formData.T4U),
        FTI: Number.parseFloat(formData.FTI),
      }
      console.log("Submitting form with data:", apiData)

      const predictionResponse = await fetch("http://localhost:8000/predict/thyroid", {
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
        <h1 className="text-3xl font-bold mb-6">Thyroid Risk Assessment</h1>

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
                      <Label htmlFor="age">Age (12-92)</Label>
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        placeholder="Enter your age"
                        value={formData.age}
                        onChange={handleInputChange}
                        min="12"
                        max="92"
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
                    <div>
                      <Label className="text-base font-medium">On Thyroxine</Label>
                      <RadioGroup
                        value={formData.thyroxine}
                        onValueChange={(value) => handleRadioChange("thyroxine", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="thyroxine-no" />
                          <Label htmlFor="thyroxine-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="thyroxine-yes" />
                          <Label htmlFor="thyroxine-yes">Yes</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Query on Thyroxine</Label>
                      <RadioGroup
                        value={formData.queryonthyroxine}
                        onValueChange={(value) => handleRadioChange("queryonthyroxine", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="queryonthyroxine-no" />
                          <Label htmlFor="queryonthyroxine-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="queryonthyroxine-yes" />
                          <Label htmlFor="queryonthyroxine-yes">Yes</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-base font-medium">On Anti-thyroid Medication</Label>
                      <RadioGroup
                        value={formData.onantithyroidmedication}
                        onValueChange={(value) => handleRadioChange("onantithyroidmedication", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="onantithyroidmedication-no" />
                          <Label htmlFor="onantithyroidmedication-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="onantithyroidmedication-yes" />
                          <Label htmlFor="onantithyroidmedication-yes">Yes</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Sick</Label>
                      <RadioGroup
                        value={formData.sick}
                        onValueChange={(value) => handleRadioChange("sick", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="sick-no" />
                          <Label htmlFor="sick-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="sick-yes" />
                          <Label htmlFor="sick-yes">Yes</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-base font-medium">Pregnant</Label>
                      <RadioGroup
                        value={formData.pregnant}
                        onValueChange={(value) => handleRadioChange("pregnant", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="pregnant-no" />
                          <Label htmlFor="pregnant-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="pregnant-yes" />
                          <Label htmlFor="pregnant-yes">Yes</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Thyroid Surgery</Label>
                      <RadioGroup
                        value={formData.thyroidsurgery}
                        onValueChange={(value) => handleRadioChange("thyroidsurgery", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="thyroidsurgery-no" />
                          <Label htmlFor="thyroidsurgery-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="thyroidsurgery-yes" />
                          <Label htmlFor="thyroidsurgery-yes">Yes</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-base font-medium">I131 Treatment</Label>
                      <RadioGroup
                        value={formData.I131treatment}
                        onValueChange={(value) => handleRadioChange("I131treatment", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="I131treatment-no" />
                          <Label htmlFor="I131treatment-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="I131treatment-yes" />
                          <Label htmlFor="I131treatment-yes">Yes</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Query Hypothyroid</Label>
                      <RadioGroup
                        value={formData.queryhypothyroid}
                        onValueChange={(value) => handleRadioChange("queryhypothyroid", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="queryhypothyroid-no" />
                          <Label htmlFor="queryhypothyroid-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="queryhypothyroid-yes" />
                          <Label htmlFor="queryhypothyroid-yes">Yes</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-base font-medium">Query Hyperthyroid</Label>
                      <RadioGroup
                        value={formData.queryhyperthyroid}
                        onValueChange={(value) => handleRadioChange("queryhyperthyroid", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="queryhyperthyroid-no" />
                          <Label htmlFor="queryhyperthyroid-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="queryhyperthyroid-yes" />
                          <Label htmlFor="queryhyperthyroid-yes">Yes</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Lithium</Label>
                      <RadioGroup
                        value={formData.lithium}
                        onValueChange={(value) => handleRadioChange("lithium", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="lithium-no" />
                          <Label htmlFor="lithium-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="lithium-yes" />
                          <Label htmlFor="lithium-yes">Yes</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-base font-medium">Goitre</Label>
                      <RadioGroup
                        value={formData.goitre}
                        onValueChange={(value) => handleRadioChange("goitre", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="goitre-no" />
                          <Label htmlFor="goitre-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="goitre-yes" />
                          <Label htmlFor="goitre-yes">Yes</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Tumor</Label>
                      <RadioGroup
                        value={formData.tumor}
                        onValueChange={(value) => handleRadioChange("tumor", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="tumor-no" />
                          <Label htmlFor="tumor-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="tumor-yes" />
                          <Label htmlFor="tumor-yes">Yes</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-base font-medium">Hypopituitary</Label>
                      <RadioGroup
                        value={formData.hypopituitary}
                        onValueChange={(value) => handleRadioChange("hypopituitary", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="hypopituitary-no" />
                          <Label htmlFor="hypopituitary-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="hypopituitary-yes" />
                          <Label htmlFor="hypopituitary-yes">Yes</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Psych</Label>
                      <RadioGroup
                        value={formData.psych}
                        onValueChange={(value) => handleRadioChange("psych", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="psych-no" />
                          <Label htmlFor="psych-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="psych-yes" />
                          <Label htmlFor="psych-yes">Yes</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="TSH">TSH (0-40)</Label>
                      <Input
                        id="TSH"
                        name="TSH"
                        type="number"
                        placeholder="Enter TSH value"
                        value={formData.TSH}
                        onChange={handleInputChange}
                        min="0"
                        max="40"
                        step="0.01"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="T3">T3 (0-6.6)</Label>
                      <Input
                        id="T3"
                        name="T3"
                        type="number"
                        placeholder="Enter T3 value"
                        value={formData.T3}
                        onChange={handleInputChange}
                        min="0"
                        max="6.6"
                        step="0.1"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="T4">T4 (0-258)</Label>
                      <Input
                        id="T4"
                        name="T4"
                        type="number"
                        placeholder="Enter T4 value"
                        value={formData.T4}
                        onChange={handleInputChange}
                        min="0"
                        max="258"
                        step="0.1"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="T4U">T4U (0-1.5)</Label>
                      <Input
                        id="T4U"
                        name="T4U"
                        type="number"
                        placeholder="Enter T4U value"
                        value={formData.T4U}
                        onChange={handleInputChange}
                        min="0"
                        max="1.5"
                        step="0.01"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="FTI">FTI (0-227)</Label>
                      <Input
                        id="FTI"
                        name="FTI"
                        type="number"
                        placeholder="Enter FTI value"
                        value={formData.FTI}
                        onChange={handleInputChange}
                        min="0"
                        max="227"
                        step="0.1"
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
                      {result.risk_status || (result.prediction === 1 ? "High Risk of Thyroid Disease" : "Low Risk of Thyroid Disease")}
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
                        <p className="font-medium">Age:</p>
                        <p className="text-muted-foreground">{formData.age} years</p>
                      </div>
                      <div>
                        <p className="font-medium">Sex:</p>
                        <p className="text-muted-foreground">{formData.sex === "0" ? "Female" : "Male"}</p>
                      </div>
                      <div>
                        <p className="font-medium">On Thyroxine:</p>
                        <p className="text-muted-foreground">{formData.thyroxine === "1" ? "Yes" : "No"}</p>
                      </div>
                      <div>
                        <p className="font-medium">Query on Thyroxine:</p>
                        <p className="text-muted-foreground">{formData.queryonthyroxine === "1" ? "Yes" : "No"}</p>
                      </div>
                      <div>
                        <p className="font-medium">On Anti-thyroid Medication:</p>
                        <p className="text-muted-foreground">{formData.onantithyroidmedication === "1" ? "Yes" : "No"}</p>
                      </div>
                      <div>
                        <p className="font-medium">Sick:</p>
                        <p className="text-muted-foreground">{formData.sick === "1" ? "Yes" : "No"}</p>
                      </div>
                      <div>
                        <p className="font-medium">Pregnant:</p>
                        <p className="text-muted-foreground">{formData.pregnant === "1" ? "Yes" : "No"}</p>
                      </div>
                      <div>
                        <p className="font-medium">Thyroid Surgery:</p>
                        <p className="text-muted-foreground">{formData.thyroidsurgery === "1" ? "Yes" : "No"}</p>
                      </div>
                      <div>
                        <p className="font-medium">I131 Treatment:</p>
                        <p className="text-muted-foreground">{formData.I131treatment === "1" ? "Yes" : "No"}</p>
                      </div>
                      <div>
                        <p className="font-medium">Query Hypothyroid:</p>
                        <p className="text-muted-foreground">{formData.queryhypothyroid === "1" ? "Yes" : "No"}</p>
                      </div>
                      <div>
                        <p className="font-medium">Query Hyperthyroid:</p>
                        <p className="text-muted-foreground">{formData.queryhyperthyroid === "1" ? "Yes" : "No"}</p>
                      </div>
                      <div>
                        <p className="font-medium">Lithium:</p>
                        <p className="text-muted-foreground">{formData.lithium === "1" ? "Yes" : "No"}</p>
                      </div>
                      <div>
                        <p className="font-medium">Goitre:</p>
                        <p className="text-muted-foreground">{formData.goitre === "1" ? "Yes" : "No"}</p>
                      </div>
                      <div>
                        <p className="font-medium">Tumor:</p>
                        <p className="text-muted-foreground">{formData.tumor === "1" ? "Yes" : "No"}</p>
                      </div>
                      <div>
                        <p className="font-medium">Hypopituitary:</p>
                        <p className="text-muted-foreground">{formData.hypopituitary === "1" ? "Yes" : "No"}</p>
                      </div>
                      <div>
                        <p className="font-medium">Psych:</p>
                        <p className="text-muted-foreground">{formData.psych === "1" ? "Yes" : "No"}</p>
                      </div>
                      <div>
                        <p className="font-medium">TSH:</p>
                        <p className="text-muted-foreground">{formData.TSH}</p>
                      </div>
                      <div>
                        <p className="font-medium">T3:</p>
                        <p className="text-muted-foreground">{formData.T3}</p>
                      </div>
                      <div>
                        <p className="font-medium">T4:</p>
                        <p className="text-muted-foreground">{formData.T4}</p>
                      </div>
                      <div>
                        <p className="font-medium">T4U:</p>
                        <p className="text-muted-foreground">{formData.T4U}</p>
                      </div>
                      <div>
                        <p className="font-medium">FTI:</p>
                        <p className="text-muted-foreground">{formData.FTI}</p>
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
                          thyroxine: "0",
                          queryonthyroxine: "0",
                          onantithyroidmedication: "0",
                          sick: "0",
                          pregnant: "0",
                          thyroidsurgery: "0",
                          I131treatment: "0",
                          queryhypothyroid: "0",
                          queryhyperthyroid: "0",
                          lithium: "0",
                          goitre: "0",
                          tumor: "0",
                          hypopituitary: "0",
                          psych: "0",
                          TSH: "",
                          T3: "",
                          T4: "",
                          T4U: "",
                          FTI: "",
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
