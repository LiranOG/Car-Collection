"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { ArrowRight, Sparkles, Database, Activity } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CarCard } from "@/components/ui/car-card"
import { ImageAnalysisModule } from "@/components/modules/image-analysis"
import { VideoAudioAnalysisModule } from "@/components/modules/video-analysis"
import { Car } from "@/lib/types"

// Mock data for the initial view
const MOCK_CARS: Car[] = [
  {
    id: "1",
    make: "Porsche",
    model: "911 GT3 RS",
    year: 2024,
    price: 241300,
    engine: "4.0L Flat-6",
    horsepower: 518,
    torque: 342,
    zeroToSixty: 3.0,
    topSpeed: 184,
    weight: 3268,
    imageUrl: "https://picsum.photos/seed/porsche911/800/600",
    tags: ["Track", "NA", "RWD"]
  },
  {
    id: "2",
    make: "Aston Martin",
    model: "Valkyrie",
    year: 2023,
    price: 3200000,
    engine: "6.5L V12 Hybrid",
    horsepower: 1140,
    torque: 664,
    zeroToSixty: 2.5,
    topSpeed: 250,
    weight: 2271,
    imageUrl: "https://picsum.photos/seed/astonvalkyrie/800/600",
    tags: ["Hypercar", "Hybrid", "V12"]
  },
  {
    id: "3",
    make: "Ferrari",
    model: "SF90 Stradale",
    year: 2024,
    price: 524000,
    engine: "4.0L V8 Twin-Turbo Hybrid",
    horsepower: 986,
    torque: 590,
    zeroToSixty: 2.0,
    topSpeed: 211,
    weight: 3461,
    imageUrl: "https://picsum.photos/seed/ferrarisf90/800/600",
    tags: ["Supercar", "Hybrid", "AWD"]
  }
]

export default function HomePage() {
  const [activeTab, setActiveTab] = React.useState<'database' | 'vision' | 'acoustic'>('database')

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-background z-10" />
          {/* Abstract 3D-like background pattern */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="container relative z-20 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-silver mb-4">
              <Sparkles className="h-4 w-4" />
              <span>Powered by Gemini 3.1 Pro</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-metallic">
              The Apex of Automotive Intelligence
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-light">
              Experience the world's most advanced supercar database. Featuring predictive matching, acoustic engine recognition, and real-time performance simulation.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button size="lg" className="bg-white text-black hover:bg-white/90" onClick={() => setActiveTab('database')}>
                Explore Database <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 bg-black/50 hover:bg-white/10" onClick={() => setActiveTab('vision')}>
                Try AI Vision
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Module Navigation */}
      <section className="border-y border-white/5 bg-black/20 sticky top-16 z-40 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto hide-scrollbar">
            <button 
              onClick={() => setActiveTab('database')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${activeTab === 'database' ? 'border-primary text-white' : 'border-transparent text-muted-foreground hover:text-white'}`}
            >
              <Database className="h-4 w-4" /> Featured Vehicles
            </button>
            <button 
              onClick={() => setActiveTab('vision')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${activeTab === 'vision' ? 'border-primary text-white' : 'border-transparent text-muted-foreground hover:text-white'}`}
            >
              <Sparkles className="h-4 w-4" /> Pro-Grade Vision
            </button>
            <button 
              onClick={() => setActiveTab('acoustic')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${activeTab === 'acoustic' ? 'border-primary text-white' : 'border-transparent text-muted-foreground hover:text-white'}`}
            >
              <Activity className="h-4 w-4" /> Acoustic Recognition
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="flex-1 py-12 container mx-auto px-4">
        <AnimatePresence mode="wait">
          {activeTab === 'database' && (
            <motion.div
              key="database"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {MOCK_CARS.map(car => (
                <CarCard key={car.id} car={car} />
              ))}
            </motion.div>
          )}

          {activeTab === 'vision' && (
            <motion.div
              key="vision"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ImageAnalysisModule />
            </motion.div>
          )}

          {activeTab === 'acoustic' && (
            <motion.div
              key="acoustic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <VideoAudioAnalysisModule />
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  )
}
