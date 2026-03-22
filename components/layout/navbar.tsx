import * as React from "react"
import Link from "next/link"
import { Search, Heart, Camera, Video, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tighter text-metallic">APEX</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/cars" className="hover:text-foreground transition-colors">Database</Link>
            <Link href="/timeline" className="hover:text-foreground transition-colors">Timeline</Link>
            <Link href="/simulator" className="hover:text-foreground transition-colors">Simulator</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:flex items-center">
            <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search cars, specs..."
              className="h-9 w-64 rounded-full border border-white/10 bg-white/5 pl-9 pr-4 text-sm outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all"
            />
          </div>
          
          <Button variant="ghost" size="icon" className="hidden md:flex text-muted-foreground hover:text-foreground">
            <Heart className="h-5 w-5" />
            <span className="sr-only">Dream Garage</span>
          </Button>
          
          <Button variant="outline" size="sm" className="hidden md:flex gap-2 border-white/10 bg-white/5 hover:bg-white/10">
            <Camera className="h-4 w-4" />
            <span>AI Scan</span>
          </Button>

          <Button variant="outline" size="sm" className="hidden md:flex gap-2 border-white/10 bg-white/5 hover:bg-white/10">
            <Video className="h-4 w-4" />
            <span>Audio/Video</span>
          </Button>

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
