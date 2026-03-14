"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  Activity,
  Heart,
  Droplet,
  Brain,
  Thermometer,
  Waves,
  Scale,
  LineChart,
  CalendarDays,
  FileText,
  Clock,
} from "lucide-react"
import { FloatingChat } from "@/components/floating-chat"

// Mock data for the charts and metrics
const mockHealthData = {
  bmi: 24.2,
  bloodPressure: "120/80",
  glucoseLevel: 95,
  cholesterol: 180,
  heartRate: 72,
  diseaseRisks: {
    diabetes: 15,
    heart: 12,
    stroke: 8,
    depression: 5,
    parkinsons: 3,
    thyroid: 7,
    kidney: 6,
    hepatitis: 4,
  },
  recentAssessments: [
    { id: 1, type: "Diabetes Risk Assessment", date: "2023-04-15", result: "Low Risk" },
    { id: 2, type: "Heart Disease Assessment", date: "2023-04-10", result: "Low Risk" },
    { id: 3, type: "Depression Assessment", date: "2023-03-28", result: "Moderate Risk" },
    { id: 4, type: "Stroke Risk Assessment", date: "2023-03-15", result: "Low Risk" },
  ],
}

export default function ProfilePage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto py-6 flex-1">
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <Card className="w-full md:w-1/3">
            <CardContent className="p-6 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-primary">{user.username.charAt(0).toUpperCase()}</span>
              </div>
              <h2 className="text-2xl font-bold">{user.username}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <Separator className="my-4" />
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="flex flex-col items-center">
                  <div className="text-muted-foreground text-sm">BMI</div>
                  <div className="text-xl font-semibold">{mockHealthData.bmi}</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-muted-foreground text-sm">Blood Pressure</div>
                  <div className="text-xl font-semibold">{mockHealthData.bloodPressure}</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-muted-foreground text-sm">Glucose</div>
                  <div className="text-xl font-semibold">{mockHealthData.glucoseLevel} mg/dL</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-muted-foreground text-sm">Cholesterol</div>
                  <div className="text-xl font-semibold">{mockHealthData.cholesterol} mg/dL</div>
                </div>
              </div>
              <Separator className="my-4" />
              <Button className="w-full" variant="outline">
                Update Health Profile
              </Button>
            </CardContent>
          </Card>

          <Card className="w-full md:w-2/3">
            <CardHeader>
              <CardTitle>Health Dashboard</CardTitle>
              <CardDescription>View your health metrics and risk assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="metrics">Health Metrics</TabsTrigger>
                  <TabsTrigger value="history">Assessment History</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center">
                          <Activity className="h-4 w-4 mr-2" />
                          Disease Risk Overview
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {Object.entries(mockHealthData.diseaseRisks).map(([disease, risk]) => (
                            <div key={disease} className="flex items-center justify-between">
                              <span className="text-sm capitalize">{disease}</span>
                              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${risk > 20 ? "bg-red-500" : risk > 10 ? "bg-amber-500" : "bg-green-500"}`}
                                  style={{ width: `${risk}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground">{risk}%</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center">
                          <CalendarDays className="h-4 w-4 mr-2" />
                          Recent Assessments
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {mockHealthData.recentAssessments.slice(0, 4).map((assessment) => (
                            <div key={assessment.id} className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium">{assessment.type}</p>
                                <p className="text-xs text-muted-foreground">{assessment.date}</p>
                              </div>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  assessment.result.includes("Low")
                                    ? "bg-green-100 text-green-800"
                                    : assessment.result.includes("Moderate")
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {assessment.result}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <LineChart className="h-4 w-4 mr-2" />
                        Health Metrics Visualization
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-64 flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <LineChart className="h-16 w-16 mx-auto mb-2 opacity-50" />
                        <p>Interactive health metrics chart will appear here</p>
                        <p className="text-sm">Track your progress over time</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="metrics" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center">
                          <Scale className="h-4 w-4 mr-2" />
                          Body Metrics
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">BMI</span>
                              <span className="text-sm text-muted-foreground">{mockHealthData.bmi}</span>
                            </div>
                            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  mockHealthData.bmi > 30
                                    ? "bg-red-500"
                                    : mockHealthData.bmi > 25
                                      ? "bg-amber-500"
                                      : mockHealthData.bmi < 18.5
                                        ? "bg-amber-500"
                                        : "bg-green-500"
                                }`}
                                style={{ width: `${(mockHealthData.bmi / 40) * 100}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>Underweight</span>
                              <span>Normal</span>
                              <span>Overweight</span>
                              <span>Obese</span>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">Blood Pressure</span>
                              <span className="text-sm text-muted-foreground">{mockHealthData.bloodPressure} mmHg</span>
                            </div>
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                  <div className="h-full bg-green-500" style={{ width: "80%" }} />
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">Systolic</div>
                              </div>
                              <div className="flex-1">
                                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                  <div className="h-full bg-green-500" style={{ width: "75%" }} />
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">Diastolic</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center">
                          <Droplet className="h-4 w-4 mr-2" />
                          Blood Metrics
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">Glucose Level</span>
                              <span className="text-sm text-muted-foreground">{mockHealthData.glucoseLevel} mg/dL</span>
                            </div>
                            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  mockHealthData.glucoseLevel > 126
                                    ? "bg-red-500"
                                    : mockHealthData.glucoseLevel > 100
                                      ? "bg-amber-500"
                                      : "bg-green-500"
                                }`}
                                style={{ width: `${(mockHealthData.glucoseLevel / 200) * 100}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>Normal</span>
                              <span>Prediabetic</span>
                              <span>Diabetic</span>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">Cholesterol</span>
                              <span className="text-sm text-muted-foreground">{mockHealthData.cholesterol} mg/dL</span>
                            </div>
                            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  mockHealthData.cholesterol > 240
                                    ? "bg-red-500"
                                    : mockHealthData.cholesterol > 200
                                      ? "bg-amber-500"
                                      : "bg-green-500"
                                }`}
                                style={{ width: `${(mockHealthData.cholesterol / 300) * 100}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>Desirable</span>
                              <span>Borderline</span>
                              <span>High</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Heart className="h-4 w-4 mr-2" />
                        Cardiovascular Health
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Resting Heart Rate</span>
                            <span className="text-sm text-muted-foreground">{mockHealthData.heartRate} bpm</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                mockHealthData.heartRate > 100
                                  ? "bg-red-500"
                                  : mockHealthData.heartRate < 60
                                    ? "bg-amber-500"
                                    : "bg-green-500"
                              }`}
                              style={{ width: `${(mockHealthData.heartRate / 120) * 100}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>Bradycardia</span>
                            <span>Normal</span>
                            <span>Tachycardia</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="history">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Assessment History</CardTitle>
                      <CardDescription>Your previous health assessments</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockHealthData.recentAssessments.map((assessment) => (
                          <div
                            key={assessment.id}
                            className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                          >
                            <div className="flex items-start gap-3">
                              <div className="rounded-full p-2 bg-primary/10">
                                {assessment.type.includes("Diabetes") ? (
                                  <Droplet className="h-4 w-4 text-primary" />
                                ) : assessment.type.includes("Heart") ? (
                                  <Heart className="h-4 w-4 text-primary" />
                                ) : assessment.type.includes("Depression") ? (
                                  <Brain className="h-4 w-4 text-primary" />
                                ) : assessment.type.includes("Stroke") ? (
                                  <Activity className="h-4 w-4 text-primary" />
                                ) : assessment.type.includes("Thyroid") ? (
                                  <Thermometer className="h-4 w-4 text-primary" />
                                ) : assessment.type.includes("Parkinson") ? (
                                  <Waves className="h-4 w-4 text-primary" />
                                ) : (
                                  <FileText className="h-4 w-4 text-primary" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{assessment.type}</p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  <span>{assessment.date}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  assessment.result.includes("Low")
                                    ? "bg-green-100 text-green-800"
                                    : assessment.result.includes("Moderate")
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {assessment.result}
                              </span>
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      <FloatingChat />
    </div>
  )
}
