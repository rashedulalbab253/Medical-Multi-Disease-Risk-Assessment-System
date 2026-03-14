"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export default function FileUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [analysis, setAnalysis] = useState("")
  const [activeTab, setActiveTab] = useState("upload")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError("")
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
  
    if (!file) {
      setError("Please select a PDF file to upload.")
      return
    }
  
    setIsLoading(true)
    setError("")
    setAnalysis("")
  
    const formData = new FormData()
    formData.append("file", file)
  
    try {
      const response = await fetch("http://localhost:8000/analyze-pdf", {
        method: "POST",
        body: formData,
      })
  
      const data = await response.json()
  
      if (!response.ok) {
        throw new Error(data.detail || "Failed to analyze the PDF. Try again.")
      }
  
      setAnalysis(data.analysis)
      setActiveTab("results")
    } catch (err: any) {
      console.error(err)
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showBackButton />
      <div className="container mx-auto max-w-3xl py-6 flex-1">
        <h1 className="text-3xl font-bold mb-6">Medical Document Analysis</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload PDF</TabsTrigger>
            <TabsTrigger value="results" disabled={!analysis}>
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <Card className="p-6">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleUpload} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="file">Select Medical PDF</Label>
                  <Input
                    id="file"
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Upload & Analyze"
                  )}
                </Button>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="results">
            <Card className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">AI Analysis Result</h2>
              {isLoading ? (
                <div className="flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : analysis ? (
                <pre className="whitespace-pre-wrap text-muted-foreground">{analysis}</pre>
              ) : (
                <p>No analysis available. Please upload a PDF to get started.</p>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("upload")}>
                  Upload Another
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
