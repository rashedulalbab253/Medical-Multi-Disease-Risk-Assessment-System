import Link from "next/link"
import {
  Activity,
  Brain,
  Droplet,
  MessageSquare,
  HeartPulse,
  Baby,
  Thermometer,
  Waves,
  BabyIcon as Kidney,
  WormIcon as Virus,
  Dna,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"

const diseaseCards = [
  {
    title: "Diabetes Prediction",
    description: "Predict your risk of diabetes based on health metrics and lifestyle factors.",
    content: "Our model analyzes glucose levels, BMI, blood pressure, and other factors to assess your diabetes risk.",
    icon: <Droplet className="h-6 w-6 text-primary" />,
    href: "/diabetes",
  },
  {
    title: "Heart Disease Prediction",
    description: "Evaluate your cardiovascular health and potential heart disease risks.",
    content: "Using cholesterol levels, blood pressure, age, and lifestyle factors to assess heart health risks.",
    icon: <HeartPulse className="h-6 w-6 text-primary" />,
    href: "/heart",
  },
  {
    title: "Student Depression Detection",
    description: "Early detection of depression symptoms for students under academic pressure.",
    content: "Our assessment tool helps identify early signs of depression in students to provide timely support.",
    icon: <Brain className="h-6 w-6 text-primary" />,
    href: "/depression",
  },
  {
    title: "Stroke Risk Prediction",
    description: "Assess your risk of stroke based on health metrics and lifestyle factors.",
    content:
      "Our model evaluates blood pressure, cholesterol, smoking status, and other factors to determine stroke risk.",
    icon: <Activity className="h-6 w-6 text-primary" />,
    href: "/stroke",
  },
  {
    title: "Thyroid Disorder Detection",
    description: "Identify potential thyroid disorders based on symptoms and test results.",
    content: "Our model analyzes thyroid hormone levels and symptoms to detect potential thyroid disorders.",
    icon: <Thermometer className="h-6 w-6 text-primary" />,
    href: "/thyroid",
  },
  {
    title: "Parkinson's Disease Assessment",
    description: "Evaluate risk factors and early signs of Parkinson's disease.",
    content: "Our tool analyzes tremor patterns, movement changes, and other factors to assess Parkinson's risk.",
    icon: <Waves className="h-6 w-6 text-primary" />,
    href: "/parkinsons",
  },
  {
    title: "Kidney Fibrosis Detection",
    description: "Assess risk of kidney fibrosis based on health metrics and test results.",
    content: "Our model evaluates kidney function tests and other health factors to detect potential kidney fibrosis.",
    icon: <Kidney className="h-6 w-6 text-primary" />,
    href: "/kidney",
  },
  {
    title: "Hepatitis Risk Assessment",
    description: "Evaluate risk factors for hepatitis based on health metrics and lifestyle.",
    content: "Our tool analyzes liver function tests and risk factors to assess potential hepatitis risk.",
    icon: <Virus className="h-6 w-6 text-primary" />,
    href: "/hepatitis",
  },
  {
    title: "Upload Report",
    description: "Upload your medical reports for AI analysis and insights.",
    content: "Our AI assistant can analyze your medical reports and provide personalized health insights.",
    icon: <MessageSquare className="h-6 w-6 text-primary" />,
    href: "/FileUploadPage",
  },
]

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Navbar />
      </header>
      <main className="flex-1">
        <section className="container py-12 md:py-16 lg:py-20">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl">
              Health Prediction Services
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
              Advanced AI-powered health prediction tools to help you monitor and understand your health risks.
            </p>
          </div>
          <div className="mx-auto grid max-w-6xl gap-6 py-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {diseaseCards.map((card, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    {card.icon}
                  </div>
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground">{card.content}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={card.href}>Start Assessment</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} HealthPredict. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
