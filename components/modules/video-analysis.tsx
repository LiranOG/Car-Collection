"use client"

import * as React from "react"
import { useDropzone } from "react-dropzone"
import { UploadCloud, Loader2, Music, CheckCircle2, AlertCircle, Play, Pause } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AIAnalysisResult } from "@/lib/types"

export function VideoAudioAnalysisModule() {
  const [file, setFile] = React.useState<File | null>(null)
  const [preview, setPreview] = React.useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [result, setResult] = React.useState<AIAnalysisResult | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const videoRef = React.useRef<HTMLVideoElement>(null)

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
    accept: { 'video/*': [], 'audio/*': [] },
    maxFiles: 1
  })

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause()
      else videoRef.current.play()
      setIsPlaying(!isPlaying)
    }
  }

  const analyzeMedia = async () => {
    if (!file) return

    setIsAnalyzing(true)
    setProgress(0)
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(p => Math.min(p + 10, 90))
    }, 800)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/analyze/video', {
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
      setError("Failed to analyze media. Please try again.")
      setIsAnalyzing(false)
    }
  }

  // Fake waveform bars
  const bars = Array.from({ length: 40 }).map((_, i) => (
    <motion.div
      key={i}
      className="w-1.5 bg-primary/80 rounded-full mx-[1px]"
      animate={{
        height: isAnalyzing ? [10, Math.random() * 60 + 20, 10] : 10,
      }}
      transition={{
        duration: 0.5 + Math.random() * 0.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: i * 0.05,
      }}
    />
  ))

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-metallic">Acoustic Engine Recognition</h2>
        <p className="text-muted-foreground">Upload a video or audio clip. Our AI analyzes the exhaust note and engine frequency to identify the vehicle.</p>
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
              <Music className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm font-medium text-center">Drag & drop a video/audio file here</p>
              <p className="text-xs text-muted-foreground mt-2">Supports MP4, WEBM, MP3, WAV</p>
            </div>
          ) : (
            <div className="relative h-80 w-full bg-black flex flex-col">
              {file?.type.startsWith('video') ? (
                <video 
                  ref={videoRef} 
                  src={preview} 
                  className="w-full h-full object-contain" 
                  onEnded={() => setIsPlaying(false)}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <Music className="h-16 w-16 text-muted-foreground opacity-50" />
                  <audio ref={videoRef as any} src={preview} onEnded={() => setIsPlaying(false)} />
                </div>
              )}
              
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <Button variant="secondary" size="icon" onClick={togglePlay} className="rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border-none text-white">
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-1" />}
                </Button>
                <Button variant="outline" size="sm" onClick={() => { setFile(null); setPreview(null); setResult(null); }} className="bg-black/50 border-white/20">
                  Change File
                </Button>
              </div>
              
              {/* Scanning Overlay */}
              <AnimatePresence>
                {isAnalyzing && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 backdrop-blur-sm"
                  >
                    <div className="flex items-end justify-center h-24 mb-8 overflow-hidden">
                      {bars}
                    </div>
                    <p className="text-sm font-medium text-white mb-2 font-mono tracking-widest uppercase">Extracting Acoustic Signature...</p>
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
              <p>Upload media to begin acoustic analysis.</p>
            </div>
          )}
          
          {preview && !result && !isAnalyzing && !error && (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">Media ready for acoustic extraction.</p>
              <Button onClick={analyzeMedia} className="w-full bg-white text-black hover:bg-white/90">
                Analyze Exhaust Note
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
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
                  <p className="text-xs text-muted-foreground uppercase">Engine Architecture</p>
                  <p className="text-lg font-semibold text-silver">{result.engineType || 'Unknown'}</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-xs text-muted-foreground uppercase">Est. Peak RPM</p>
                  <p className="text-lg font-semibold text-silver">{result.estimatedRPM ? `${result.estimatedRPM} RPM` : 'N/A'}</p>
                </div>
              </div>

              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-xs text-primary font-medium mb-2 uppercase tracking-wider">Acoustic Profile</p>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Low Frequency (Bass)</span>
                  <span>High Frequency (Pitch)</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-primary" 
                    style={{ width: `${(result.estimatedRPM || 5000) / 100}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </Card>
      </div>
    </div>
  )
}
