"use client"

import * as React from "react"
import { useDropzone } from "react-dropzone"
import { UploadCloud, Loader2, CheckCircle2, AlertCircle, Search } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AIAnalysisResult } from "@/lib/types"

export function ImageAnalysisModule() {
  const [file, setFile] = React.useState<File | null>(null)
  const [preview, setPreview] = React.useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [result, setResult] = React.useState<AIAnalysisResult | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    const selected = acceptedFiles[0]
    if (selected) {
      setFile(selected)
      setPreview(URL.createObjectURL(selected))
      setResult(null)
      setError(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1
  })

  const analyzeImage = async () => {
    if (!file) return

    setIsAnalyzing(true)
    setProgress(0)
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(p => Math.min(p + 15, 90))
    }, 500)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/analyze/image', {
        method: 'POST',
        body: formData
      })

      if (!res.ok) throw new Error('Analysis failed')
      
      const data = await res.json()
      clearInterval(interval)
      setProgress(100)
      
      setTimeout(() => {
        setResult(data)
        setIsAnalyzing(false)
      }, 500)

    } catch (err) {
      clearInterval(interval)
      setError("Failed to analyze image. Please try again.")
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-metallic">Pro-Grade Vision Analysis</h2>
        <p className="text-muted-foreground">Upload a vehicle photo. Our AI will identify the make, model, and verify specs via live web search.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Upload Zone */}
        <Card className="border-white/10 bg-black/40 backdrop-blur-md overflow-hidden relative">
          {!preview ? (
            <div 
              {...getRootProps()} 
              className={`h-80 flex flex-col items-center justify-center p-6 border-2 border-dashed transition-colors cursor-pointer
                ${isDragActive ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-white/20'}`}
            >
              <input {...getInputProps()} />
              <UploadCloud className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm font-medium text-center">Drag & drop a car photo here, or click to select</p>
              <p className="text-xs text-muted-foreground mt-2">Supports JPG, PNG, WEBP</p>
            </div>
          ) : (
            <div className="relative h-80 w-full">
              <Image src={preview} alt="Preview" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Button variant="secondary" onClick={() => { setFile(null); setPreview(null); setResult(null); }}>
                  Change Image
                </Button>
              </div>
              
              {/* Scanning Overlay */}
              <AnimatePresence>
                {isAnalyzing && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-6"
                  >
                    <motion.div 
                      className="w-full h-1 bg-primary/50 absolute top-0 left-0 shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                    <p className="text-sm font-medium text-white mb-2">Analyzing vehicle geometry...</p>
                    <Progress value={progress} className="w-full max-w-xs" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </Card>

        {/* Results Panel */}
        <Card className="border-white/10 bg-black/40 backdrop-blur-md p-6 flex flex-col justify-center min-h-[20rem]">
          {!preview && !result && !error && (
            <div className="text-center text-muted-foreground">
              <p>Upload an image to see analysis results.</p>
            </div>
          )}
          
          {preview && !result && !isAnalyzing && !error && (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">Image ready for analysis.</p>
              <Button onClick={analyzeImage} className="w-full bg-white text-black hover:bg-white/90">
                Run AI Analysis
              </Button>
            </div>
          )}

          {error && (
            <div className="text-center space-y-4 text-destructive">
              <AlertCircle className="h-12 w-12 mx-auto" />
              <p>{error}</p>
              <Button variant="outline" onClick={() => setError(null)}>Try Again</Button>
            </div>
          )}

          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold text-white">{result.make} {result.model}</h3>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    {(result.confidence * 100).toFixed(0)}% Match
                  </span>
                </div>
                <p className="text-muted-foreground">Estimated Year: {result.year}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-xs text-muted-foreground uppercase">Horsepower</p>
                  <p className="text-lg font-semibold text-silver">{result.keySpecs.horsepower || 'N/A'} HP</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-xs text-muted-foreground uppercase">0-60 mph</p>
                  <p className="text-lg font-semibold text-silver">{result.keySpecs.zeroToSixty || 'N/A'}s</p>
                </div>
              </div>

              {result.searchVerification?.verified && (
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-xs text-blue-400 font-medium mb-1 flex items-center gap-2">
                    <Search className="h-3 w-3" />
                    Live Web Verification
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {result.searchVerification.summary}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </Card>
      </div>
    </div>
  )
}
