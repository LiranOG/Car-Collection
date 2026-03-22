"use client"

import * as React from "react"
import Image from "next/image"
import { Heart } from "lucide-react"
import { motion } from "motion/react"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts"

import { Car } from "@/lib/types"
import { useGarageStore } from "@/lib/store"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface CarCardProps {
  car: Car
}

export function CarCard({ car }: CarCardProps) {
  const { savedCarIds, addCar, removeCar } = useGarageStore()
  const isSaved = savedCarIds.includes(car.id)

  const toggleSave = () => {
    if (isSaved) removeCar(car.id)
    else addCar(car.id)
  }

  const performanceData = [
    { subject: 'Speed', A: car.topSpeed / 3, fullMark: 100 },
    { subject: 'Accel', A: 100 - (car.zeroToSixty * 10), fullMark: 100 },
    { subject: 'Power', A: car.horsepower / 15, fullMark: 100 },
    { subject: 'Handling', A: 85, fullMark: 100 }, // Mocked handling stat
  ]

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="overflow-hidden border-white/5 bg-black/40 backdrop-blur-sm group">
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={car.imageUrl}
            alt={`${car.make} ${car.model}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-white hover:bg-white/20 backdrop-blur-md rounded-full"
            onClick={toggleSave}
          >
            <Heart className={`h-5 w-5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <div className="absolute bottom-3 left-4">
            <p className="text-xs font-medium text-white/70 uppercase tracking-wider">{car.make}</p>
            <h3 className="text-xl font-bold text-white leading-tight">{car.model}</h3>
          </div>
        </div>
        
        <CardContent className="p-4 grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Engine</p>
              <p className="text-sm font-medium text-silver">{car.engine}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Power</p>
              <p className="text-sm font-medium text-silver">{car.horsepower} HP</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">0-60 mph</p>
              <p className="text-sm font-medium text-silver">{car.zeroToSixty}s</p>
            </div>
          </div>
          
          <div className="h-24 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
                <Radar name="Performance" dataKey="A" stroke="#bf953f" fill="#bf953f" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
