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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

interface FormData {
  // Patient Information
  age: string
  gender: string
  ethnicity: string
  education_level: string
  bmi: string
  smoking: string
  alcohol_consumption: string
  physical_activity: string
  diet_quality: string
  sleep_quality: string

  // Medical History
  family_history_parkinsons: string
  traumatic_brain_injury: string
  hypertension: string
  diabetes: string
  depression: string
  stroke: string

  // Clinical Measurements
  systolic_bp: string
  diastolic_bp: string
  cholesterol_total: string
  cholesterol_ldl: string
  cholesterol_hdl: string
  cholesterol_triglycerides: string

  // Assessments
  updrs: string
  moca: string
  functional_assessment: string

  // Symptoms
  tremor: string
  rigidity: string
  bradykinesia: string
  postural_instability: string
  speech_problems: string
  sleep_disorders: string
  constipation: string
}

interface PredictionResult {
  prediction: number
  risk_status?: string
  probability?: number
}

export default function ParkinsonsPage() {
  const [activeTab, setActiveTab] = useState("form")
  const [isLoading, setIsLoading] = useState(false)
  const [isSummaryLoading, setIsSummaryLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<FormData>({
    // Patient Information
    age: "",
    gender: "0", // Default to male
    ethnicity: "0", // Default to Caucasian
    education_level: "1", // Default to High School
    bmi: "",
    smoking: "0", // Default to No
    alcohol_consumption: "",
    physical_activity: "",
    diet_quality: "",
    sleep_quality: "",

    // Medical History
    family_history_parkinsons: "0", // Default to No
    traumatic_brain_injury: "0", // Default to No
    hypertension: "0", // Default to No
    diabetes: "0", // Default to No
    depression: "0", // Default to No
    stroke: "0", // Default to No

    // Clinical Measurements
    systolic_bp: "",
    diastolic_bp: "",
    cholesterol_total: "",
    cholesterol_ldl: "",
    cholesterol_hdl: "",
    cholesterol_triglycerides: "",

    // Assessments
    updrs: "",
    moca: "",
    functional_assessment: "",

    // Symptoms
    tremor: "0", // Default to No
    rigidity: "0", // Default to No
    bradykinesia: "0", // Default to No
    postural_instability: "0", // Default to No
    speech_problems: "0", // Default to No
    sleep_disorders: "0", // Default to No
    constipation: "0", // Default to No
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
    // Age validation
    if (!formData.age || isNaN(Number(formData.age)) || Number(formData.age) < 10 || Number(formData.age) > 100) {
      setError("Please enter a valid age between 10 and 100")
      return false
    }

    // BMI validation
    if (!formData.bmi || isNaN(Number(formData.bmi)) || Number(formData.bmi) < 15 || Number(formData.bmi) > 40) {
      setError("Please enter a valid BMI between 15 and 40")
      return false
    }

    // Alcohol consumption validation
    if (
      !formData.alcohol_consumption ||
      isNaN(Number(formData.alcohol_consumption)) ||
      Number(formData.alcohol_consumption) < 0 ||
      Number(formData.alcohol_consumption) > 20
    ) {
      setError("Please enter a valid alcohol consumption between 0 and 20 units/week")
      return false
    }

    // Physical activity validation
    if (
      !formData.physical_activity ||
      isNaN(Number(formData.physical_activity)) ||
      Number(formData.physical_activity) < 0 ||
      Number(formData.physical_activity) > 10
    ) {
      setError("Please enter a valid physical activity between 0 and 10 hours/week")
      return false
    }

    // Diet quality validation
    if (
      !formData.diet_quality ||
      isNaN(Number(formData.diet_quality)) ||
      Number(formData.diet_quality) < 0 ||
      Number(formData.diet_quality) > 10
    ) {
      setError("Please enter a valid diet quality between 0 and 10")
      return false
    }

    // Sleep quality validation
    if (
      !formData.sleep_quality ||
      isNaN(Number(formData.sleep_quality)) ||
      Number(formData.sleep_quality) < 4 ||
      Number(formData.sleep_quality) > 10
    ) {
      setError("Please enter a valid sleep quality between 4 and 10")
      return false
    }

    // Blood pressure validation
    if (
      !formData.systolic_bp ||
      isNaN(Number(formData.systolic_bp)) ||
      Number(formData.systolic_bp) < 90 ||
      Number(formData.systolic_bp) > 180
    ) {
      setError("Please enter a valid systolic blood pressure between 90 and 180 mmHg")
      return false
    }

    if (
      !formData.diastolic_bp ||
      isNaN(Number(formData.diastolic_bp)) ||
      Number(formData.diastolic_bp) < 60 ||
      Number(formData.diastolic_bp) > 120
    ) {
      setError("Please enter a valid diastolic blood pressure between 60 and 120 mmHg")
      return false
    }

    // Cholesterol validation
    if (
      !formData.cholesterol_total ||
      isNaN(Number(formData.cholesterol_total)) ||
      Number(formData.cholesterol_total) < 150 ||
      Number(formData.cholesterol_total) > 300
    ) {
      setError("Please enter a valid total cholesterol between 150 and 300 mg/dL")
      return false
    }

    if (
      !formData.cholesterol_ldl ||
      isNaN(Number(formData.cholesterol_ldl)) ||
      Number(formData.cholesterol_ldl) < 50 ||
      Number(formData.cholesterol_ldl) > 200
    ) {
      setError("Please enter a valid LDL cholesterol between 50 and 200 mg/dL")
      return false
    }

    if (
      !formData.cholesterol_hdl ||
      isNaN(Number(formData.cholesterol_hdl)) ||
      Number(formData.cholesterol_hdl) < 20 ||
      Number(formData.cholesterol_hdl) > 100
    ) {
      setError("Please enter a valid HDL cholesterol between 20 and 100 mg/dL")
      return false
    }

    if (
      !formData.cholesterol_triglycerides ||
      isNaN(Number(formData.cholesterol_triglycerides)) ||
      Number(formData.cholesterol_triglycerides) < 50 ||
      Number(formData.cholesterol_triglycerides) > 400
    ) {
      setError("Please enter a valid triglycerides level between 50 and 400 mg/dL")
      return false
    }

    // Assessment validation
    if (
      !formData.updrs ||
      isNaN(Number(formData.updrs)) ||
      Number(formData.updrs) < 0 ||
      Number(formData.updrs) > 199
    ) {
      setError("Please enter a valid UPDRS score between 0 and 199")
      return false
    }

    if (!formData.moca || isNaN(Number(formData.moca)) || Number(formData.moca) < 0 || Number(formData.moca) > 30) {
      setError("Please enter a valid MoCA score between 0 and 30")
      return false
    }

    if (
      !formData.functional_assessment ||
      isNaN(Number(formData.functional_assessment)) ||
      Number(formData.functional_assessment) < 0 ||
      Number(formData.functional_assessment) > 10
    ) {
      setError("Please enter a valid functional assessment score between 0 and 10")
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
        ethnicity: Number.parseInt(formData.ethnicity),
        education_level: Number.parseInt(formData.education_level),
        bmi: Number.parseFloat(formData.bmi),
        smoking: Number.parseInt(formData.smoking),
        alcohol_consumption: Number.parseFloat(formData.alcohol_consumption),
        physical_activity: Number.parseFloat(formData.physical_activity),
        diet_quality: Number.parseInt(formData.diet_quality),
        sleep_quality: Number.parseInt(formData.sleep_quality),
        family_history_parkinsons: Number.parseInt(formData.family_history_parkinsons),
        traumatic_brain_injury: Number.parseInt(formData.traumatic_brain_injury),
        hypertension: Number.parseInt(formData.hypertension),
        diabetes: Number.parseInt(formData.diabetes),
        depression: Number.parseInt(formData.depression),
        stroke: Number.parseInt(formData.stroke),
        systolic_bp: Number.parseInt(formData.systolic_bp),
        diastolic_bp: Number.parseInt(formData.diastolic_bp),
        cholesterol_total: Number.parseInt(formData.cholesterol_total),
        cholesterol_ldl: Number.parseInt(formData.cholesterol_ldl),
        cholesterol_hdl: Number.parseInt(formData.cholesterol_hdl),
        cholesterol_triglycerides: Number.parseInt(formData.cholesterol_triglycerides),
        updrs: Number.parseInt(formData.updrs),
        moca: Number.parseInt(formData.moca),
        functional_assessment: Number.parseInt(formData.functional_assessment),
        tremor: Number.parseInt(formData.tremor),
        rigidity: Number.parseInt(formData.rigidity),
        bradykinesia: Number.parseInt(formData.bradykinesia),
        postural_instability: Number.parseInt(formData.postural_instability),
        speech_problems: Number.parseInt(formData.speech_problems),
        sleep_disorders: Number.parseInt(formData.sleep_disorders),
        constipation: Number.parseInt(formData.constipation),
      }

      const summaryResponse = await fetch("/api/ai-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          disease: "parkinsons",
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
        gender: Number.parseInt(formData.gender),
        ethnicity: Number.parseInt(formData.ethnicity),
        education_level: Number.parseInt(formData.education_level),
        bmi: Number.parseFloat(formData.bmi),
        smoking: Number.parseInt(formData.smoking),
        alcohol_consumption: Number.parseFloat(formData.alcohol_consumption),
        physical_activity: Number.parseFloat(formData.physical_activity),
        diet_quality: Number.parseInt(formData.diet_quality),
        sleep_quality: Number.parseInt(formData.sleep_quality),
        family_history_parkinsons: Number.parseInt(formData.family_history_parkinsons),
        traumatic_brain_injury: Number.parseInt(formData.traumatic_brain_injury),
        hypertension: Number.parseInt(formData.hypertension),
        diabetes: Number.parseInt(formData.diabetes),
        depression: Number.parseInt(formData.depression),
        stroke: Number.parseInt(formData.stroke),
        systolic_bp: Number.parseInt(formData.systolic_bp),
        diastolic_bp: Number.parseInt(formData.diastolic_bp),
        cholesterol_total: Number.parseInt(formData.cholesterol_total),
        cholesterol_ldl: Number.parseInt(formData.cholesterol_ldl),
        cholesterol_hdl: Number.parseInt(formData.cholesterol_hdl),
        cholesterol_triglycerides: Number.parseInt(formData.cholesterol_triglycerides),
        updrs: Number.parseInt(formData.updrs),
        moca: Number.parseInt(formData.moca),
        functional_assessment: Number.parseInt(formData.functional_assessment),
        tremor: Number.parseInt(formData.tremor),
        rigidity: Number.parseInt(formData.rigidity),
        bradykinesia: Number.parseInt(formData.bradykinesia),
        postural_instability: Number.parseInt(formData.postural_instability),
        speech_problems: Number.parseInt(formData.speech_problems),
        sleep_disorders: Number.parseInt(formData.sleep_disorders),
        constipation: Number.parseInt(formData.constipation),
      }

      const predictionResponse = await fetch("http://localhost:8000/predict/parkinsons", {
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
        <h1 className="text-3xl font-bold mb-6">Parkinson's Disease Assessment</h1>

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
                <div>
                  <h2 className="text-xl font-semibold mb-4">Patient Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age (10-100 years)</Label>
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        placeholder="Enter your age"
                        value={formData.age}
                        onChange={handleInputChange}
                        min="10"
                        max="100"
                        step="1"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base">Gender</Label>
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

                    <div className="space-y-2">
                      <Label htmlFor="ethnicity">Ethnicity</Label>
                      <Select
                        value={formData.ethnicity}
                        onValueChange={(value) => handleSelectChange("ethnicity", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select ethnicity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Caucasian</SelectItem>
                          <SelectItem value="1">African American</SelectItem>
                          <SelectItem value="2">Asian</SelectItem>
                          <SelectItem value="3">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="education_level">Education Level</Label>
                      <Select
                        value={formData.education_level}
                        onValueChange={(value) => handleSelectChange("education_level", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select education level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">None</SelectItem>
                          <SelectItem value="1">High School</SelectItem>
                          <SelectItem value="2">Bachelor's</SelectItem>
                          <SelectItem value="3">Higher</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bmi">BMI (15-40)</Label>
                      <Input
                        id="bmi"
                        name="bmi"
                        type="number"
                        placeholder="Enter your BMI"
                        value={formData.bmi}
                        onChange={handleInputChange}
                        min="15"
                        max="40"
                        step="0.1"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base">Smoking</Label>
                      <RadioGroup
                        value={formData.smoking}
                        onValueChange={(value) => handleRadioChange("smoking", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="smoking-no" />
                          <Label htmlFor="smoking-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="smoking-yes" />
                          <Label htmlFor="smoking-yes">Yes</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="alcohol_consumption">Alcohol Consumption (0-20 units/week)</Label>
                      <Input
                        id="alcohol_consumption"
                        name="alcohol_consumption"
                        type="number"
                        placeholder="Enter alcohol consumption"
                        value={formData.alcohol_consumption}
                        onChange={handleInputChange}
                        min="0"
                        max="20"
                        step="1"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="physical_activity">Physical Activity (0-10 hours/week)</Label>
                      <Input
                        id="physical_activity"
                        name="physical_activity"
                        type="number"
                        placeholder="Enter physical activity"
                        value={formData.physical_activity}
                        onChange={handleInputChange}
                        min="0"
                        max="10"
                        step="0.5"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="diet_quality">Diet Quality (0-10)</Label>
                      <Input
                        id="diet_quality"
                        name="diet_quality"
                        type="number"
                        placeholder="Enter diet quality"
                        value={formData.diet_quality}
                        onChange={handleInputChange}
                        min="0"
                        max="10"
                        step="1"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sleep_quality">Sleep Quality (4-10)</Label>
                      <Input
                        id="sleep_quality"
                        name="sleep_quality"
                        type="number"
                        placeholder="Enter sleep quality"
                        value={formData.sleep_quality}
                        onChange={handleInputChange}
                        min="4"
                        max="10"
                        step="1"
                        required
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold mb-4">Medical History</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-base">Family History of Parkinson's</Label>
                      <RadioGroup
                        value={formData.family_history_parkinsons}
                        onValueChange={(value) => handleRadioChange("family_history_parkinsons", value)}
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

                    <div className="space-y-2">
                      <Label className="text-base">Traumatic Brain Injury</Label>
                      <RadioGroup
                        value={formData.traumatic_brain_injury}
                        onValueChange={(value) => handleRadioChange("traumatic_brain_injury", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="brain-injury-no" />
                          <Label htmlFor="brain-injury-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="brain-injury-yes" />
                          <Label htmlFor="brain-injury-yes">Yes</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base">Hypertension</Label>
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

                    <div className="space-y-2">
                      <Label className="text-base">Diabetes</Label>
                      <RadioGroup
                        value={formData.diabetes}
                        onValueChange={(value) => handleRadioChange("diabetes", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="diabetes-no" />
                          <Label htmlFor="diabetes-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="diabetes-yes" />
                          <Label htmlFor="diabetes-yes">Yes</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base">Depression</Label>
                      <RadioGroup
                        value={formData.depression}
                        onValueChange={(value) => handleRadioChange("depression", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="depression-no" />
                          <Label htmlFor="depression-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="depression-yes" />
                          <Label htmlFor="depression-yes">Yes</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base">Stroke</Label>
                      <RadioGroup
                        value={formData.stroke}
                        onValueChange={(value) => handleRadioChange("stroke", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="stroke-no" />
                          <Label htmlFor="stroke-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="stroke-yes" />
                          <Label htmlFor="stroke-yes">Yes</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold mb-4">Clinical Measurements</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="systolic_bp">Systolic BP (90-180 mmHg)</Label>
                      <Input
                        id="systolic_bp"
                        name="systolic_bp"
                        type="number"
                        placeholder="Enter systolic blood pressure"
                        value={formData.systolic_bp}
                        onChange={handleInputChange}
                        min="90"
                        max="180"
                        step="1"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="diastolic_bp">Diastolic BP (60-120 mmHg)</Label>
                      <Input
                        id="diastolic_bp"
                        name="diastolic_bp"
                        type="number"
                        placeholder="Enter diastolic blood pressure"
                        value={formData.diastolic_bp}
                        onChange={handleInputChange}
                        min="60"
                        max="120"
                        step="1"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cholesterol_total">Total Cholesterol (150-300 mg/dL)</Label>
                      <Input
                        id="cholesterol_total"
                        name="cholesterol_total"
                        type="number"
                        placeholder="Enter total cholesterol"
                        value={formData.cholesterol_total}
                        onChange={handleInputChange}
                        min="150"
                        max="300"
                        step="1"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cholesterol_ldl">LDL Cholesterol (50-200 mg/dL)</Label>
                      <Input
                        id="cholesterol_ldl"
                        name="cholesterol_ldl"
                        type="number"
                        placeholder="Enter LDL cholesterol"
                        value={formData.cholesterol_ldl}
                        onChange={handleInputChange}
                        min="50"
                        max="200"
                        step="1"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cholesterol_hdl">HDL Cholesterol (20-100 mg/dL)</Label>
                      <Input
                        id="cholesterol_hdl"
                        name="cholesterol_hdl"
                        type="number"
                        placeholder="Enter HDL cholesterol"
                        value={formData.cholesterol_hdl}
                        onChange={handleInputChange}
                        min="20"
                        max="100"
                        step="1"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cholesterol_triglycerides">Triglycerides (50-400 mg/dL)</Label>
                      <Input
                        id="cholesterol_triglycerides"
                        name="cholesterol_triglycerides"
                        type="number"
                        placeholder="Enter triglycerides"
                        value={formData.cholesterol_triglycerides}
                        onChange={handleInputChange}
                        min="50"
                        max="400"
                        step="1"
                        required
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold mb-4">Cognitive and Functional Assessments</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="updrs">UPDRS (Parkinson's Disease Rating: 0-199)</Label>
                      <Input
                        id="updrs"
                        name="updrs"
                        type="number"
                        placeholder="Enter UPDRS score"
                        value={formData.updrs}
                        onChange={handleInputChange}
                        min="0"
                        max="199"
                        step="1"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="moca">MoCA (Cognitive Assessment: 0-30)</Label>
                      <Input
                        id="moca"
                        name="moca"
                        type="number"
                        placeholder="Enter MoCA score"
                        value={formData.moca}
                        onChange={handleInputChange}
                        min="0"
                        max="30"
                        step="1"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="functional_assessment">Functional Assessment (0-10)</Label>
                      <Input
                        id="functional_assessment"
                        name="functional_assessment"
                        type="number"
                        placeholder="Enter functional assessment score"
                        value={formData.functional_assessment}
                        onChange={handleInputChange}
                        min="0"
                        max="10"
                        step="1"
                        required
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold mb-4">Symptoms</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-base">Tremor</Label>
                      <RadioGroup
                        value={formData.tremor}
                        onValueChange={(value) => handleRadioChange("tremor", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="tremor-no" />
                          <Label htmlFor="tremor-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="tremor-yes" />
                          <Label htmlFor="tremor-yes">Yes</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base">Rigidity</Label>
                      <RadioGroup
                        value={formData.rigidity}
                        onValueChange={(value) => handleRadioChange("rigidity", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="rigidity-no" />
                          <Label htmlFor="rigidity-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="rigidity-yes" />
                          <Label htmlFor="rigidity-yes">Yes</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base">Bradykinesia</Label>
                      <RadioGroup
                        value={formData.bradykinesia}
                        onValueChange={(value) => handleRadioChange("bradykinesia", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="bradykinesia-no" />
                          <Label htmlFor="bradykinesia-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="bradykinesia-yes" />
                          <Label htmlFor="bradykinesia-yes">Yes</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base">Postural Instability</Label>
                      <RadioGroup
                        value={formData.postural_instability}
                        onValueChange={(value) => handleRadioChange("postural_instability", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="postural-instability-no" />
                          <Label htmlFor="postural-instability-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="postural-instability-yes" />
                          <Label htmlFor="postural-instability-yes">Yes</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base">Speech Problems</Label>
                      <RadioGroup
                        value={formData.speech_problems}
                        onValueChange={(value) => handleRadioChange("speech_problems", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="speech-problems-no" />
                          <Label htmlFor="speech-problems-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="speech-problems-yes" />
                          <Label htmlFor="speech-problems-yes">Yes</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base">Sleep Disorders</Label>
                      <RadioGroup
                        value={formData.sleep_disorders}
                        onValueChange={(value) => handleRadioChange("sleep_disorders", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="sleep-disorders-no" />
                          <Label htmlFor="sleep-disorders-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="sleep-disorders-yes" />
                          <Label htmlFor="sleep-disorders-yes">Yes</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base">Constipation</Label>
                      <RadioGroup
                        value={formData.constipation}
                        onValueChange={(value) => handleRadioChange("constipation", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="constipation-no" />
                          <Label htmlFor="constipation-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="constipation-yes" />
                          <Label htmlFor="constipation-yes">Yes</Label>
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
                        (result.prediction === 1
                          ? "High Risk of Parkinson's Disease"
                          : "Low Risk of Parkinson's Disease")}
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

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab("form")}>
                      Back to Form
                    </Button>
                    <Button
                      onClick={() => {
                        // Reset form data
                        setFormData({
                          age: "",
                          gender: "0",
                          ethnicity: "0",
                          education_level: "1",
                          bmi: "",
                          smoking: "0",
                          alcohol_consumption: "",
                          physical_activity: "",
                          diet_quality: "",
                          sleep_quality: "",
                          family_history_parkinsons: "0",
                          traumatic_brain_injury: "0",
                          hypertension: "0",
                          diabetes: "0",
                          depression: "0",
                          stroke: "0",
                          systolic_bp: "",
                          diastolic_bp: "",
                          cholesterol_total: "",
                          cholesterol_ldl: "",
                          cholesterol_hdl: "",
                          cholesterol_triglycerides: "",
                          updrs: "",
                          moca: "",
                          functional_assessment: "",
                          tremor: "0",
                          rigidity: "0",
                          bradykinesia: "0",
                          postural_instability: "0",
                          speech_problems: "0",
                          sleep_disorders: "0",
                          constipation: "0",
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
