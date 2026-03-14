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
  age: string
  gender: string
  chestpaintype: string
  restingbloodpressure: string
  serumcholesterol: string
  fastingbloodsugar: string
  restingelectro: string
  maxheartrate: string
  exerciseangia: string
  oldpeak: string
  slope: string
  noofmajorvessels: string
}

interface PredictionResult {
  prediction: number
  risk_status?: string
  probability?: number
}

export default function HeartPage() {
  const [activeTab, setActiveTab] = useState("form")
  const [isLoading, setIsLoading] = useState(false)
  const [isSummaryLoading, setIsSummaryLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<FormData>({
    age: "",
    gender: "0", // Default to Female
    chestpaintype: "0", // Default to Typical Angina
    restingbloodpressure: "",
    serumcholesterol: "",
    fastingbloodsugar: "0", // Default to False
    restingelectro : "0", // Default to Normal
    maxheartrate: "",
    exerciseangia: "0", // Default to No
    oldpeak: "",
    slope: "1", // Default to Upsloping
    noofmajorvessels: "0", // Default to 0
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
    const { age, restingbloodpressure, serumcholesterol, maxheartrate, oldpeak } = formData

    if (!age || isNaN(Number(age)) || Number(age) <= 0 || Number(age) > 120) {
      setError("Please enter a valid age between 1 and 120")
      return false
    }

    if (
      !restingbloodpressure ||
      isNaN(Number(restingbloodpressure)) ||
      Number(restingbloodpressure) < 94 ||
      Number(restingbloodpressure) > 200
    ) {
      setError("Please enter a valid resting blood pressure between 94 and 200 mm Hg")
      return false
    }

    if (
      !serumcholesterol ||
      isNaN(Number(serumcholesterol)) ||
      Number(serumcholesterol) < 126 ||
      Number(serumcholesterol) > 564
    ) {
      setError("Please enter a valid serum cholesterol between 126 and 564 mg/dL")
      return false
    }

    if (
      !maxheartrate ||
      isNaN(Number(maxheartrate)) ||
      Number(maxheartrate) < 71 ||
      Number(maxheartrate) > 202
    ) {
      setError("Please enter a valid maximum heart rate between 71 and 202")
      return false
    }

    if (!oldpeak || isNaN(Number(oldpeak)) || Number(oldpeak) < 0 || Number(oldpeak) > 6.2) {
      setError("Please enter a valid ST depression (oldpeak) between 0 and 6.2")
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
        gender: Number.parseInt(formData.gender),
        chestpaintype: Number.parseInt(formData.chestpaintype),
        restingbloodpressure: Number.parseFloat(formData.restingbloodpressure),
        serumcholesterol: Number.parseFloat(formData.serumcholesterol),
        fastingbloodsugar: Number.parseInt(formData.fastingbloodsugar),
        restingelectro: Number.parseInt(formData.restingelectro),
        maxheartrate: Number.parseFloat(formData.maxheartrate),
        exerciseangia: Number.parseInt(formData.exerciseangia),
        oldpeak: Number.parseFloat(formData.oldpeak),
        slope: Number.parseInt(formData.slope),
        noofmajorvessels: Number.parseInt(formData.noofmajorvessels),
      }

      const summaryResponse = await fetch("/api/ai-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          disease: "heart",
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
  
      // Correctly align field names with HeartInput schema in backend
      const apiData = {
        age: Number.parseInt(formData.age),
        gender: Number.parseInt(formData.gender),
        chestpain: Number.parseInt(formData.chestpaintype),
        restingBP: Number.parseInt(formData.restingbloodpressure),
        serumcholesterol: Number.parseInt(formData.serumcholesterol),
        fastingbloodsugar: Number.parseInt(formData.fastingbloodsugar),
        restingrelectro: Number.parseInt(formData.restingelectro),
        maxheartrate: Number.parseInt(formData.maxheartrate),
        exerciseangia: Number.parseInt(formData.exerciseangia),
        oldpeak: Number.parseFloat(formData.oldpeak),
        slope: Number.parseInt(formData.slope),
        noofmajorvessels: Number.parseInt(formData.noofmajorvessels)
      }
      console.log("Submitting form with data:", apiData)
  
      const predictionResponse = await fetch("http://localhost:8000/predict/heart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      })
  
      // Improved error handling to show more details
      if (!predictionResponse.ok) {
        const errorText = await predictionResponse.text();
        console.error("API Error:", predictionResponse.status, errorText);
        throw new Error(`Failed to get prediction: ${predictionResponse.status} - ${errorText}`);
      }
  
      const predictionData = await predictionResponse.json()
      setResult(predictionData)
  
      setActiveTab("results")
    } catch (err) {
      console.error("Full error:", err);
      setError(err instanceof Error ? err.message : "An error occurred while processing your request")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showBackButton />
      <div className="container mx-auto max-w-4xl py-6 flex-1">
        <h1 className="text-3xl font-bold mb-6">Heart Disease Risk Assessment</h1>

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
                      <Label className="text-base font-medium">Gender</Label>
                      <RadioGroup
                        value={formData.gender}
                        onValueChange={(value) => handleRadioChange("gender", value)}
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chest_pain_type">Chest Pain Type</Label>
                    <Select 
                      value={formData.chestpaintype} 
                      onValueChange={(value) => handleSelectChange("chestpaintype", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Typical Angina</SelectItem>
                        <SelectItem value="1">Atypical Angina</SelectItem>
                        <SelectItem value="2">Non-anginal Pain</SelectItem>
                        <SelectItem value="3">Asymptomatic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="resting_blood_pressure">Resting Blood Pressure (94-200 mm Hg)</Label>
                      <Input
                        id="restingbloodpressure"
                        name="restingbloodpressure"
                        type="number"
                        placeholder="Enter resting blood pressure"
                        value={formData.restingbloodpressure}
                        onChange={handleInputChange}
                        min="94"
                        max="200"
                        step="1"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="serum_cholesterol">Serum Cholesterol (126-564 mg/dL)</Label>
                      <Input
                        id="serumcholesterol"
                        name="serumcholesterol"
                        type="number"
                        placeholder="Enter serum cholesterol"
                        value={formData.serumcholesterol}
                        onChange={handleInputChange}
                        min="126"
                        max="564"
                        step="1"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-base font-medium">Fasting Blood Sugar {`>`} 120 mg/dL</Label>
                      <RadioGroup
                        value={formData.fastingbloodsugar}
                        onValueChange={(value) => handleRadioChange("fastingbloodsugar", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="fbs-false" />
                          <Label htmlFor="fbs-false">False</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="fbs-true" />
                          <Label htmlFor="fbs-true">True</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resting_ecg">Resting ECG Results</Label>
                      <Select 
                        value={formData.restingelectro} 
                        onValueChange={(value) => handleSelectChange("restingelectro", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select result" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Normal</SelectItem>
                          <SelectItem value="1">ST-T Abnormality</SelectItem>
                          <SelectItem value="2">Left Ventricular Hypertrophy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="maxheartrate">Maximum Heart Rate Achieved (71-202)</Label>
                      <Input
                        id="maxheartrate"
                        name="maxheartrate"
                        type="number"
                        placeholder="Enter maximum heart rate"
                        value={formData.maxheartrate}
                        onChange={handleInputChange}
                        min="71"
                        max="202"
                        step="1"
                        required
                      />
                    </div>

                    <div>
                      <Label className="text-base font-medium">Exercise Induced Angina</Label>
                      <RadioGroup
                        value={formData.exerciseangia}
                        onValueChange={(value) => handleRadioChange("exerciseangia", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="angina-no" />
                          <Label htmlFor="angina-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="angina-yes" />
                          <Label htmlFor="angina-yes">Yes</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="oldpeak">ST Depression (Oldpeak) (0-6.2)</Label>
                      <Input
                        id="oldpeak"
                        name="oldpeak"
                        type="number"
                        placeholder="Enter ST depression"
                        value={formData.oldpeak}
                        onChange={handleInputChange}
                        min="0"
                        max="6.2"
                        step="0.1"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="slope">Slope of ST Segment</Label>
                      <Select 
                        value={formData.slope} 
                        onValueChange={(value) => handleSelectChange("slope", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select slope" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Upsloping</SelectItem>
                          <SelectItem value="2">Flat</SelectItem>
                          <SelectItem value="3">Downsloping</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="major_vessels">Number of Major Vessels Colored</Label>
                      <Select 
                        value={formData.noofmajorvessels} 
                        onValueChange={(value) => handleSelectChange("noofmajorvessels", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select number" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0</SelectItem>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                        </SelectContent>
                      </Select>
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
                      {result.risk_status || (result.prediction === 1 ? "High Risk of Heart Disease" : "Low Risk of Heart Disease")}
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
                        <p className="font-medium">Gender:</p>
                        <p className="text-muted-foreground">{formData.gender === "0" ? "Female" : "Male"}</p>
                      </div>
                      <div>
                        <p className="font-medium">Chest Pain Type:</p>
                        <p className="text-muted-foreground">
                          {formData.chestpaintype === "0"
                            ? "Typical Angina"
                            : formData.chestpaintype === "1"
                            ? "Atypical Angina"
                            : formData.chestpaintype === "2"
                            ? "Non-anginal Pain"
                            : "Asymptomatic"}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Resting Blood Pressure:</p>
                        <p className="text-muted-foreground">{formData.restingbloodpressure} mm Hg</p>
                      </div>
                      <div>
                        <p className="font-medium">Serum Cholesterol:</p>
                        <p className="text-muted-foreground">{formData.serumcholesterol} mg/dL</p>
                      </div>
                      <div>
                        <p className="font-medium">Fasting Blood Sugar 120 mg/dL:</p>
                        <p className="text-muted-foreground">{formData.fastingbloodsugar === "1" ? "True" : "False"}</p>
                      </div>
                      <div>
                        <p className="font-medium">Resting ECG Results:</p>
                        <p className="text-muted-foreground">
                          {formData.restingelectro === "0"
                            ? "Normal"
                            : formData.restingelectro === "1"
                            ? "ST-T Abnormality"
                            : "Left Ventricular Hypertrophy"}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Maximum Heart Rate:</p>
                        <p className="text-muted-foreground">{formData.maxheartrate}</p>
                      </div>
                      <div>
                        <p className="font-medium">Exercise Induced Angina:</p>
                        <p className="text-muted-foreground">{formData.exerciseangia === "1" ? "Yes" : "No"}</p>
                      </div>
                      <div>
                        <p className="font-medium">ST Depression (Oldpeak):</p>
                        <p className="text-muted-foreground">{formData.oldpeak}</p>
                      </div>
                      <div>
                        <p className="font-medium">Slope of ST Segment:</p>
                        <p className="text-muted-foreground">
                            formData.slope === "1"
                            ? "Upsloping"
                            : formData.slope === "2"
                            ? "Flat"
                            : formData.slope === "3"
                            ? "Downsloping"
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Number of Major Vessels Colored:</p>
                        <p className="text-muted-foreground">{formData.noofmajorvessels}</p>
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
                          gender: "0",
                          chestpaintype: "0",
                          restingbloodpressure: "",
                          serumcholesterol: "",
                          fastingbloodsugar: "0",
                          restingelectro: "0",
                          maxheartrate: "",
                          exerciseangia: "0",
                          oldpeak: "",
                          slope: "1",
                          noofmajorvessels: "0",
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