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
  blood_pressure: string
  specific_gravity: string
  albumin: string
  sugar: string
  red_blood_cells: string
  pus_cell: string
  pus_cell_clumps: string
  bacteria: string
  blood_glucose_random: string
  blood_urea: string
  serum_creatinine: string
  sodium: string
  potassium: string
  haemoglobin: string
  packed_cell_volume: string
  white_blood_cell_count: string
  red_blood_cell_count: string
  hypertension: string
  diabetes_mellitus: string
  coronary_artery_disease: string
  appetite: string
  peda_edema: string
  aanemia: string
}

interface PredictionResult {
  prediction: number
  risk_status?: string
  probability?: number
}

export default function KidneyPage() {
  const [activeTab, setActiveTab] = useState("form")
  const [isLoading, setIsLoading] = useState(false)
  const [isSummaryLoading, setIsSummaryLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<FormData>({
    age: "",
    blood_pressure: "",
    specific_gravity: "",
    albumin: "1", // Default to 1
    sugar: "0", // Default to 0
    red_blood_cells: "0", // Default to normal
    pus_cell: "0", // Default to normal
    pus_cell_clumps: "0", // Default to not present
    bacteria: "0", // Default to not present
    blood_glucose_random: "",
    blood_urea: "",
    serum_creatinine: "",
    sodium: "",
    potassium: "",
    haemoglobin: "",
    packed_cell_volume: "",
    white_blood_cell_count: "",
    red_blood_cell_count: "",
    hypertension: "0", // Default to No
    diabetes_mellitus: "0", // Default to No
    coronary_artery_disease: "0", // Default to No
    appetite: "0", // Default to No
    peda_edema: "0", // Default to No
    aanemia: "0", // Default to No
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
    const {
      age,
      blood_pressure,
      specific_gravity,
      blood_glucose_random,
      blood_urea,
      serum_creatinine,
      sodium,
      potassium,
      haemoglobin,
      packed_cell_volume,
      white_blood_cell_count,
      red_blood_cell_count,
    } = formData

    if (!age || isNaN(Number(age)) || Number(age) <= 0 || Number(age) > 120) {
      setError("Please enter a valid age between 1 and 120")
      return false
    }

    if (
      !blood_pressure ||
      isNaN(Number(blood_pressure)) ||
      Number(blood_pressure) < 50 ||
      Number(blood_pressure) > 200
    ) {
      setError("Please enter a valid blood pressure between 50 and 200")
      return false
    }

    if (
      !specific_gravity ||
      isNaN(Number(specific_gravity)) ||
      Number(specific_gravity) < 1.005 ||
      Number(specific_gravity) > 1.025
    ) {
      setError("Please enter a valid specific gravity between 1.005 and 1.025")
      return false
    }

    if (!blood_glucose_random || isNaN(Number(blood_glucose_random))) {
      setError("Please enter a valid blood glucose random value")
      return false
    }

    if (!blood_urea || isNaN(Number(blood_urea))) {
      setError("Please enter a valid blood urea value")
      return false
    }

    if (!serum_creatinine || isNaN(Number(serum_creatinine))) {
      setError("Please enter a valid serum creatinine value")
      return false
    }

    if (!sodium || isNaN(Number(sodium))) {
      setError("Please enter a valid sodium value")
      return false
    }

    if (!potassium || isNaN(Number(potassium))) {
      setError("Please enter a valid potassium value")
      return false
    }

    if (!haemoglobin || isNaN(Number(haemoglobin))) {
      setError("Please enter a valid haemoglobin value")
      return false
    }

    if (!packed_cell_volume || isNaN(Number(packed_cell_volume))) {
      setError("Please enter a valid packed cell volume value")
      return false
    }

    if (!white_blood_cell_count || isNaN(Number(white_blood_cell_count))) {
      setError("Please enter a valid white blood cell count value")
      return false
    }

    if (!red_blood_cell_count || isNaN(Number(red_blood_cell_count))) {
      setError("Please enter a valid red blood cell count value")
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
        blood_pressure: Number.parseFloat(formData.blood_pressure),
        specific_gravity: Number.parseFloat(formData.specific_gravity),
        albumin: Number.parseInt(formData.albumin),
        sugar: Number.parseInt(formData.sugar),
        red_blood_cells: Number.parseInt(formData.red_blood_cells),
        pus_cell: Number.parseInt(formData.pus_cell),
        pus_cell_clumps: Number.parseInt(formData.pus_cell_clumps),
        bacteria: Number.parseInt(formData.bacteria),
        blood_glucose_random: Number.parseFloat(formData.blood_glucose_random),
        blood_urea: Number.parseFloat(formData.blood_urea),
        serum_creatinine: Number.parseFloat(formData.serum_creatinine),
        sodium: Number.parseFloat(formData.sodium),
        potassium: Number.parseFloat(formData.potassium),
        haemoglobin: Number.parseFloat(formData.haemoglobin),
        packed_cell_volume: Number.parseFloat(formData.packed_cell_volume),
        white_blood_cell_count: Number.parseFloat(formData.white_blood_cell_count),
        red_blood_cell_count: Number.parseFloat(formData.red_blood_cell_count),
        hypertension: Number.parseInt(formData.hypertension),
        diabetes_mellitus: Number.parseInt(formData.diabetes_mellitus),
        coronary_artery_disease: Number.parseInt(formData.coronary_artery_disease),
        appetite: Number.parseInt(formData.appetite),
        peda_edema: Number.parseInt(formData.peda_edema),
        aanemia: Number.parseInt(formData.aanemia),
      }

      const summaryResponse = await fetch("/api/ai-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          disease: "kidney",
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
        blood_pressure: Number.parseFloat(formData.blood_pressure),
        specific_gravity: Number.parseFloat(formData.specific_gravity),
        albumin: Number.parseInt(formData.albumin),
        sugar: Number.parseInt(formData.sugar),
        red_blood_cells: Number.parseInt(formData.red_blood_cells),
        pus_cell: Number.parseInt(formData.pus_cell),
        pus_cell_clumps: Number.parseInt(formData.pus_cell_clumps),
        bacteria: Number.parseInt(formData.bacteria),
        blood_glucose_random: Number.parseFloat(formData.blood_glucose_random),
        blood_urea: Number.parseFloat(formData.blood_urea),
        serum_creatinine: Number.parseFloat(formData.serum_creatinine),
        sodium: Number.parseFloat(formData.sodium),
        potassium: Number.parseFloat(formData.potassium),
        haemoglobin: Number.parseFloat(formData.haemoglobin),
        packed_cell_volume: Number.parseFloat(formData.packed_cell_volume),
        white_blood_cell_count: Number.parseFloat(formData.white_blood_cell_count),
        red_blood_cell_count: Number.parseFloat(formData.red_blood_cell_count),
        hypertension: Number.parseInt(formData.hypertension),
        diabetes_mellitus: Number.parseInt(formData.diabetes_mellitus),
        coronary_artery_disease: Number.parseInt(formData.coronary_artery_disease),
        appetite: Number.parseInt(formData.appetite),
        peda_edema: Number.parseInt(formData.peda_edema),
        aanemia: Number.parseInt(formData.aanemia),
      }
      console.log("Submitting form with data:", apiData)

      const predictionResponse = await fetch("http://localhost:8000/predict/kidney", {
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
        <h1 className="text-3xl font-bold mb-6">Kidney Disease Risk Assessment</h1>

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

                    <div className="space-y-2">
                      <Label htmlFor="blood_pressure">Blood Pressure</Label>
                      <Input
                        id="blood_pressure"
                        name="blood_pressure"
                        type="number"
                        placeholder="Enter blood pressure"
                        value={formData.blood_pressure}
                        onChange={handleInputChange}
                        min="50"
                        max="200"
                        step="1"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="specific_gravity">Specific Gravity (1.005-1.025)</Label>
                      <Input
                        id="specific_gravity"
                        name="specific_gravity"
                        type="number"
                        placeholder="Enter specific gravity"
                        value={formData.specific_gravity}
                        onChange={handleInputChange}
                        min="1.005"
                        max="1.025"
                        step="0.001"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="albumin">Albumin (1-5 range)</Label>
                      <Select value={formData.albumin} onValueChange={(value) => handleSelectChange("albumin", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sugar">Sugar (0-5 scale)</Label>
                      <Select value={formData.sugar} onValueChange={(value) => handleSelectChange("sugar", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0</SelectItem>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Red Blood Cells</Label>
                      <RadioGroup
                        value={formData.red_blood_cells}
                        onValueChange={(value) => handleRadioChange("red_blood_cells", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="rbc-normal" />
                          <Label htmlFor="rbc-normal">Normal</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="rbc-abnormal" />
                          <Label htmlFor="rbc-abnormal">Abnormal</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-base font-medium">Pus Cell</Label>
                      <RadioGroup
                        value={formData.pus_cell}
                        onValueChange={(value) => handleRadioChange("pus_cell", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="pus-cell-normal" />
                          <Label htmlFor="pus-cell-normal">Normal</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="pus-cell-abnormal" />
                          <Label htmlFor="pus-cell-abnormal">Abnormal</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Pus Cell Clumps</Label>
                      <RadioGroup
                        value={formData.pus_cell_clumps}
                        onValueChange={(value) => handleRadioChange("pus_cell_clumps", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="pus-clumps-not-present" />
                          <Label htmlFor="pus-clumps-not-present">Not Present</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="pus-clumps-present" />
                          <Label htmlFor="pus-clumps-present">Present</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-base font-medium">Bacteria</Label>
                      <RadioGroup
                        value={formData.bacteria}
                        onValueChange={(value) => handleRadioChange("bacteria", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="bacteria-not-present" />
                          <Label htmlFor="bacteria-not-present">Not Present</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="bacteria-present" />
                          <Label htmlFor="bacteria-present">Present</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="blood_glucose_random">Blood Glucose Random</Label>
                      <Input
                        id="blood_glucose_random"
                        name="blood_glucose_random"
                        type="number"
                        placeholder="Enter blood glucose random"
                        value={formData.blood_glucose_random}
                        onChange={handleInputChange}
                        step="0.1"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="blood_urea">Blood Urea</Label>
                      <Input
                        id="blood_urea"
                        name="blood_urea"
                        type="number"
                        placeholder="Enter blood urea"
                        value={formData.blood_urea}
                        onChange={handleInputChange}
                        step="0.1"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="serum_creatinine">Serum Creatinine</Label>
                      <Input
                        id="serum_creatinine"
                        name="serum_creatinine"
                        type="number"
                        placeholder="Enter serum creatinine"
                        value={formData.serum_creatinine}
                        onChange={handleInputChange}
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sodium">Sodium</Label>
                      <Input
                        id="sodium"
                        name="sodium"
                        type="number"
                        placeholder="Enter sodium level"
                        value={formData.sodium}
                        onChange={handleInputChange}
                        step="0.1"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="potassium">Potassium</Label>
                      <Input
                        id="potassium"
                        name="potassium"
                        type="number"
                        placeholder="Enter potassium level"
                        value={formData.potassium}
                        onChange={handleInputChange}
                        step="0.1"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="haemoglobin">Haemoglobin</Label>
                      <Input
                        id="haemoglobin"
                        name="haemoglobin"
                        type="number"
                        placeholder="Enter haemoglobin level"
                        value={formData.haemoglobin}
                        onChange={handleInputChange}
                        step="0.1"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="packed_cell_volume">Packed Cell Volume</Label>
                      <Input
                        id="packed_cell_volume"
                        name="packed_cell_volume"
                        type="number"
                        placeholder="Enter packed cell volume"
                        value={formData.packed_cell_volume}
                        onChange={handleInputChange}
                        step="0.1"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="white_blood_cell_count">White Blood Cell Count</Label>
                      <Input
                        id="white_blood_cell_count"
                        name="white_blood_cell_count"
                        type="number"
                        placeholder="Enter white blood cell count"
                        value={formData.white_blood_cell_count}
                        onChange={handleInputChange}
                        step="0.1"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="red_blood_cell_count">Red Blood Cell Count</Label>
                      <Input
                        id="red_blood_cell_count"
                        name="red_blood_cell_count"
                        type="number"
                        placeholder="Enter red blood cell count"
                        value={formData.red_blood_cell_count}
                        onChange={handleInputChange}
                        step="0.1"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-base font-medium">Hypertension</Label>
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
                      <Label className="text-base font-medium">Diabetes Mellitus</Label>
                      <RadioGroup
                        value={formData.diabetes_mellitus}
                        onValueChange={(value) => handleRadioChange("diabetes_mellitus", value)}
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

                    <div>
                      <Label className="text-base font-medium">Coronary Artery Disease</Label>
                      <RadioGroup
                        value={formData.coronary_artery_disease}
                        onValueChange={(value) => handleRadioChange("coronary_artery_disease", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="cad-no" />
                          <Label htmlFor="cad-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="cad-yes" />
                          <Label htmlFor="cad-yes">Yes</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-base font-medium">Appetite</Label>
                      <RadioGroup
                        value={formData.appetite}
                        onValueChange={(value) => handleRadioChange("appetite", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="appetite-poor" />
                          <Label htmlFor="appetite-poor">Poor</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="appetite-good" />
                          <Label htmlFor="appetite-good">Good</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Pedal Edema</Label>
                      <RadioGroup
                        value={formData.peda_edema}
                        onValueChange={(value) => handleRadioChange("peda_edema", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="pedal-edema-no" />
                          <Label htmlFor="pedal-edema-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="pedal-edema-yes" />
                          <Label htmlFor="pedal-edema-yes">Yes</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Anemia</Label>
                      <RadioGroup
                        value={formData.aanemia}
                        onValueChange={(value) => handleRadioChange("aanemia", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="anemia-no" />
                          <Label htmlFor="anemia-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="anemia-yes" />
                          <Label htmlFor="anemia-yes">Yes</Label>
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
                        (result.prediction === 1 ? "High Risk of Kidney Disease" : "Low Risk of Kidney Disease")}
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="font-medium">Age:</p>
                        <p className="text-muted-foreground">{formData.age} years</p>
                      </div>
                      <div>
                        <p className="font-medium">Blood Pressure:</p>
                        <p className="text-muted-foreground">{formData.blood_pressure}</p>
                      </div>
                      <div>
                        <p className="font-medium">Specific Gravity:</p>
                        <p className="text-muted-foreground">{formData.specific_gravity}</p>
                      </div>
                      <div>
                        <p className="font-medium">Albumin:</p>
                        <p className="text-muted-foreground">{formData.albumin}</p>
                      </div>
                      <div>
                        <p className="font-medium">Sugar:</p>
                        <p className="text-muted-foreground">{formData.sugar}</p>
                      </div>
                      <div>
                        <p className="font-medium">Red Blood Cells:</p>
                        <p className="text-muted-foreground">
                          {formData.red_blood_cells === "0" ? "Normal" : "Abnormal"}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Pus Cell:</p>
                        <p className="text-muted-foreground">{formData.pus_cell === "0" ? "Normal" : "Abnormal"}</p>
                      </div>
                      <div>
                        <p className="font-medium">Pus Cell Clumps:</p>
                        <p className="text-muted-foreground">
                          {formData.pus_cell_clumps === "0" ? "Not Present" : "Present"}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Bacteria:</p>
                        <p className="text-muted-foreground">{formData.bacteria === "0" ? "Not Present" : "Present"}</p>
                      </div>
                      <div>
                        <p className="font-medium">Blood Glucose Random:</p>
                        <p className="text-muted-foreground">{formData.blood_glucose_random}</p>
                      </div>
                      <div>
                        <p className="font-medium">Blood Urea:</p>
                        <p className="text-muted-foreground">{formData.blood_urea}</p>
                      </div>
                      <div>
                        <p className="font-medium">Serum Creatinine:</p>
                        <p className="text-muted-foreground">{formData.serum_creatinine}</p>
                      </div>
                      <div>
                        <p className="font-medium">Sodium:</p>
                        <p className="text-muted-foreground">{formData.sodium}</p>
                      </div>
                      <div>
                        <p className="font-medium">Potassium:</p>
                        <p className="text-muted-foreground">{formData.potassium}</p>
                      </div>
                      <div>
                        <p className="font-medium">Haemoglobin:</p>
                        <p className="text-muted-foreground">{formData.haemoglobin}</p>
                      </div>
                      <div>
                        <p className="font-medium">Packed Cell Volume:</p>
                        <p className="text-muted-foreground">{formData.packed_cell_volume}</p>
                      </div>
                      <div>
                        <p className="font-medium">White Blood Cell Count:</p>
                        <p className="text-muted-foreground">{formData.white_blood_cell_count}</p>
                      </div>
                      <div>
                        <p className="font-medium">Red Blood Cell Count:</p>
                        <p className="text-muted-foreground">{formData.red_blood_cell_count}</p>
                      </div>
                      <div>
                        <p className="font-medium">Hypertension:</p>
                        <p className="text-muted-foreground">{formData.hypertension === "1" ? "Yes" : "No"}</p>
                      </div>
                      <div>
                        <p className="font-medium">Diabetes Mellitus:</p>
                        <p className="text-muted-foreground">{formData.diabetes_mellitus === "1" ? "Yes" : "No"}</p>
                      </div>
                      <div>
                        <p className="font-medium">Coronary Artery Disease:</p>
                        <p className="text-muted-foreground">
                          {formData.coronary_artery_disease === "1" ? "Yes" : "No"}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Appetite:</p>
                        <p className="text-muted-foreground">{formData.appetite === "1" ? "Good" : "Poor"}</p>
                      </div>
                      <div>
                        <p className="font-medium">Pedal Edema:</p>
                        <p className="text-muted-foreground">{formData.peda_edema === "1" ? "Yes" : "No"}</p>
                      </div>
                      <div>
                        <p className="font-medium">Anemia:</p>
                        <p className="text-muted-foreground">{formData.aanemia === "1" ? "Yes" : "No"}</p>
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
                          blood_pressure: "",
                          specific_gravity: "",
                          albumin: "1",
                          sugar: "0",
                          red_blood_cells: "0",
                          pus_cell: "0",
                          pus_cell_clumps: "0",
                          bacteria: "0",
                          blood_glucose_random: "",
                          blood_urea: "",
                          serum_creatinine: "",
                          sodium: "",
                          potassium: "",
                          haemoglobin: "",
                          packed_cell_volume: "",
                          white_blood_cell_count: "",
                          red_blood_cell_count: "",
                          hypertension: "0",
                          diabetes_mellitus: "0",
                          coronary_artery_disease: "0",
                          appetite: "0",
                          peda_edema: "0",
                          aanemia: "0",
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
