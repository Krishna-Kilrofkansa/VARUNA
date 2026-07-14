// "use client"
// import { useState, useEffect } from "react"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Slider } from "@/components/ui/slider"
// import {
//   MapPin,
//   Waves,
//   Search,
//   Layers,
//   Globe,
//   Clock,
//   Navigation,
//   Settings,
//   RefreshCw,
//   Eye,
//   Share2,
//   LogOut,
//   AlertTriangle,
// } from "lucide-react"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Switch } from "@/components/ui/switch"
// import Link from "next/link"
// import dynamic from "next/dynamic"

// const MapComponent = dynamic(() => import("@/components/map-component"), {
//   ssr: false,
//   loading: () => (
//     <div className="h-full bg-[var(--color-ocean-medium)]/20 relative overflow-hidden flex items-center justify-center">
//       <div className="text-white/60">Loading map...</div>
//     </div>
//   ),
// })

// const hazardCategories = ["All", "Storm", "Waves", "Flooding", "Tsunami", "Cyclone", "Other"]
// const severityLevels = ["All", "Low", "Medium", "High", "Critical"]
// const sourcesFilter = ["All", "Citizen", "Social Media", "Official"]

// export default function MapDashboard() {
//   const [selectedCategory, setSelectedCategory] = useState("All")
//   const [selectedSeverity, setSelectedSeverity] = useState("All")
//   const [selectedSource, setSelectedSource] = useState("All")
//   const [timeRange, setTimeRange] = useState([24])
//   const [searchQuery, setSearchQuery] = useState("")
//   const [showHeatmap, setShowHeatmap] = useState(false)
//   const [show3D, setShow3D] = useState(false)
//   const [showCurrents, setShowCurrents] = useState(false)
//   const [selectedHazard, setSelectedHazard] = useState<any>(null)
//   const [lastUpdate, setLastUpdate] = useState(new Date())
//   const [isRefreshing, setIsRefreshing] = useState(false)
//   const [isMounted, setIsMounted] = useState(false)
//   const [hazards, setHazards] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)

//   // Fetch hazards from API and normalize
//   const fetchHazards = async () => {
//     try {
//       const response = await fetch("/api/hazards")
//       const data = await response.json()

//       const normalized = (data.hazards || []).map((h: any) => {
//         let lat: number | null = null
//         let lng: number | null = null

//         if (h.latitude && h.longitude) {
//           lat = h.latitude
//           lng = h.longitude
//         } else if (h.location?.lat && h.location?.lng) {
//           lat = h.location.lat
//           lng = h.location.lng
//         } else if (typeof h.location === "string") {
//           const [latStr, lngStr] = h.location.split(",").map((v: string) => v.trim())
//           lat = parseFloat(latStr)
//           lng = parseFloat(lngStr)
//         }

//         return {
//           id: h._id,
//           hazardType: h.hazardType || "Unknown",
//           severity: h.severity || "low",
//           description: h.description || "No description",
//           contactName: h.contactName || h.reportedBy || "N/A",
//           contactPhone: h.contactPhone || "N/A",
//           verified: h.verified || false,
//           createdAt: h.createdAt,
//           location: { lat, lng },
//         }
//       })

//       setHazards(normalized)
//     } catch (error) {
//       console.error("Error fetching hazards:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     setIsMounted(true)
//     fetchHazards()
//   }, [])

//   const handleRefresh = async () => {
//     setIsRefreshing(true)
//     await fetchHazards()
//     setLastUpdate(new Date())
//     setIsRefreshing(false)
//   }

//   // Auto-refresh every 10s
//   useEffect(() => {
//     if (!isMounted) return
//     const interval = setInterval(() => {
//       setLastUpdate(new Date())
//     }, 10000)
//     return () => clearInterval(interval)
//   }, [isMounted])

//   const filteredHazards = hazards.filter((hazard) => {
//     if (selectedCategory !== "All" && hazard.hazardType.toLowerCase() !== selectedCategory.toLowerCase())
//       return false
//     if (selectedSeverity !== "All" && hazard.severity.toLowerCase() !== selectedSeverity.toLowerCase())
//       return false
//     if (selectedSource !== "All" && hazard.source !== selectedSource) return false
//     if (searchQuery) {
//       const locStr = `${hazard.location.lat},${hazard.location.lng}`
//       if (!locStr.toLowerCase().includes(searchQuery.toLowerCase())) return false
//     }
//     return true
//   })

//   const getSeverityColor = (severity: string) => {
//     switch (severity) {
//       case "critical":
//         return "bg-red-500"
//       case "high":
//         return "bg-orange-500"
//       case "medium":
//         return "bg-yellow-500"
//       case "low":
//         return "bg-green-500"
//       default:
//         return "bg-gray-500"
//     }
//   }

//   const getSeverityBadgeColor = (severity: string) => {
//     switch (severity) {
//       case "critical":
//         return "bg-red-500/20 text-red-400 border-red-500/30"
//       case "high":
//         return "bg-orange-500/20 text-orange-400 border-orange-500/30"
//       case "medium":
//         return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
//       case "low":
//         return "bg-green-500/20 text-green-400 border-green-500/30"
//       default:
//         return "bg-gray-500/20 text-gray-400 border-gray-500/30"
//     }
//   }

//   const handleViewFullReport = () => {
//     if (selectedHazard) {
//       alert(`Opening full report for ${selectedHazard.hazardType}`)
//     }
//   }

//   const handleShareAlert = () => {
//     if (selectedHazard) {
//       navigator.clipboard.writeText(
//         `Ocean Hazard Alert: ${selectedHazard.hazardType} at Lat:${selectedHazard.location.lat}, Lng:${selectedHazard.location.lng} - ${selectedHazard.description}`
//       )
//       alert("Alert details copied to clipboard!")
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[var(--color-ocean-deep)] via-[var(--color-ocean-medium)] to-[var(--color-ocean-light)]">
//       {/* Header */}
//       <header className="bg-[var(--color-ocean-deep)]/80 backdrop-blur-lg border-b border-white/10 p-4">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <Link
//               href="/"
//               className="w-10 h-10 bg-[var(--color-accent)] rounded-lg flex items-center justify-center pulse-glow"
//             >
//               <Waves className="w-6 h-6 text-white" />
//             </Link>
//             <div>
//               <h1 className="text-2xl font-bold text-white">Ocean Hazard Dashboard</h1>
//               <p className="text-white/60 text-sm flex items-center">
//                 Last updated: {isMounted ? lastUpdate.toLocaleTimeString() : "--:--:--"} IST
//                 <button onClick={handleRefresh} className="ml-2 hover:text-white transition-colors">
//                   <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`} />
//                 </button>
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center space-x-4">
//             <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
//               {filteredHazards.length} Active Hazards
//             </Badge>
//             <Link href="/report/authenticated">
//               <Button className="bg-[var(--color-coral-accent)] hover:bg-[var(--color-coral-accent)]/90 text-white">
//                 <AlertTriangle className="w-4 h-4 mr-2" />
//                 Report Hazard
//               </Button>
//             </Link>
//             <Link href="/dashboard/settings">
//               <Button
//                 variant="outline"
//                 className="border-white/20 text-white hover:bg-white/10 bg-transparent"
//               >
//                 <Settings className="w-4 h-4 mr-2" />
//                 Settings
//               </Button>
//             </Link>
//             <Button
//               variant="outline"
//               className="border-red-500/20 text-red-400 hover:bg-red-500/10 bg-transparent"
//               onClick={() => {
//                 sessionStorage.removeItem("varuna-loaded")
//                 window.location.href = "/"
//               }}
//             >
//               <LogOut className="w-4 h-4 mr-2" />
//               Logout
//             </Button>
//           </div>
//         </div>
//       </header>

//       <div className="flex h-[calc(100vh-80px)]">
//         {/* Sidebar - Filters & Controls */}
//         <div className="w-80 bg-[var(--color-ocean-deep)]/60 backdrop-blur-lg border-r border-white/10 p-6 overflow-y-auto">
//           {/* (filters unchanged, keeping your original code) */}
//         </div>

//         {/* Main Map Area */}
//         <div className="flex-1 relative">
//           <MapComponent
//             hazards={filteredHazards}
//             onHazardSelect={setSelectedHazard}
//             showHeatmap={showHeatmap}
//             show3D={show3D}
//             showCurrents={showCurrents}
//           />

//           {/* Right Panel - Hazard Details */}
//           <div className="w-96 bg-[var(--color-ocean-deep)]/60 backdrop-blur-lg border-l border-white/10 p-6 overflow-y-auto absolute right-0 top-0 bottom-0">
//             {selectedHazard ? (
//               <div className="space-y-6">
//                 <div className="flex items-start justify-between">
//                   <h3 className="text-xl font-bold text-white">{selectedHazard.hazardType}</h3>
//                   <Badge className={getSeverityBadgeColor(selectedHazard.severity)}>
//                     {selectedHazard.severity.toUpperCase()}
//                   </Badge>
//                 </div>

//                 <div className="space-y-4">
//                   <div>
//                     <h4 className="text-white font-medium mb-2">Description</h4>
//                     <p className="text-white/80 text-sm">{selectedHazard.description}</p>
//                   </div>

//                   <div>
//                     <h4 className="text-white font-medium mb-2">Contact</h4>
//                     <p className="text-white/80 text-sm">{selectedHazard.contactName}</p>
//                     <p className="text-white/80 text-sm">{selectedHazard.contactPhone}</p>
//                   </div>

//                   <div>
//                     <h4 className="text-white font-medium mb-2">Date</h4>
//                     <p className="text-white/80 text-sm flex items-center">
//                       <Clock className="w-4 h-4 mr-1" />
//                       {new Date(selectedHazard.createdAt).toLocaleString()}
//                     </p>
//                   </div>

//                   <div>
//                     <h4 className="text-white font-medium mb-2">Location</h4>
//                     <p className="text-white/80 text-sm">
//                       Lat: {selectedHazard.location.lat}
//                       <br />
//                       Lng: {selectedHazard.location.lng}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Button
//                     className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-white"
//                     onClick={handleViewFullReport}
//                   >
//                     <Eye className="w-4 h-4 mr-2" />
//                     View Full Report
//                   </Button>
//                   <Button
//                     variant="outline"
//                     className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
//                     onClick={handleShareAlert}
//                   >
//                     <Share2 className="w-4 h-4 mr-2" />
//                     Share Alert
//                   </Button>
//                 </div>
//               </div>
//             ) : (
//               <div className="text-center py-12">
//                 <MapPin className="w-12 h-12 text-white/40 mx-auto mb-4" />
//                 <h3 className="text-white font-medium mb-2">Select a Hazard</h3>
//                 <p className="text-white/60 text-sm">Click on any marker on the map to view detailed information</p>
//               </div>
//             )}

//             {/* Recent Activity */}
//             <div className="mt-8">
//               <h3 className="text-white font-medium mb-4">Recent Activity</h3>
//               <div className="space-y-3">
//                 {loading ? (
//                   <div className="text-white/60 text-sm">Loading reports...</div>
//                 ) : (
//                   filteredHazards.slice(0, 3).map((hazard) => (
//                     <Card
//                       key={hazard.id}
//                       className="bg-white/5 backdrop-blur-lg border-white/10 p-3 cursor-pointer hover:bg-white/10 transition-colors"
//                       onClick={() => setSelectedHazard(hazard)}
//                     >
//                       <div className="flex items-start space-x-3">
//                         <div
//                           className={`w-3 h-3 rounded-full ${getSeverityColor(hazard.severity)} mt-1 flex-shrink-0`}
//                         ></div>
//                         <div className="flex-1 min-w-0">
//                           <p className="text-white text-sm font-medium truncate">{hazard.hazardType}</p>
//                           <p className="text-white/60 text-xs truncate">
//                             Lat: {hazard.location.lat}, Lng: {hazard.location.lng}
//                           </p>
//                           <p className="text-white/40 text-xs">
//                             {new Date(hazard.createdAt).toLocaleString()}
//                           </p>
//                         </div>
//                       </div>
//                     </Card>
//                   ))
//                 )}
//                 {!loading && filteredHazards.length === 0 && (
//                   <div className="text-white/60 text-sm">No hazard reports found</div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { MapPin, Waves, Search, Layers, Globe, Clock, Navigation, Settings, RefreshCw, Eye, Share2, LogOut, AlertTriangle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import dynamic from "next/dynamic"

const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="h-full bg-[var(--color-ocean-medium)]/20 relative overflow-hidden flex items-center justify-center">
      <div className="text-white/60">Loading map...</div>
    </div>
  ),
})

const hazardCategories = ["All", "Storm", "Waves", "Flooding", "Tsunami", "Cyclone", "Other"]
const severityLevels = ["All", "Low", "Medium", "High", "Critical"]
const sourcesFilter = ["All", "Citizen", "Social Media", "Official"]

export default function MapDashboard() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedSeverity, setSelectedSeverity] = useState("All")
  const [selectedSource, setSelectedSource] = useState("All")
  const [timeRange, setTimeRange] = useState([24])
  const [searchQuery, setSearchQuery] = useState("")
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [show3D, setShow3D] = useState(false)
  const [showCurrents, setShowCurrents] = useState(false)
  const [selectedHazard, setSelectedHazard] = useState<any>(null)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [hazards, setHazards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch hazards from API
  const fetchHazards = async () => {
    try {
      const response = await fetch('/api/hazards')
      const data = await response.json()
      setHazards(data.hazards || [])
    } catch (error) {
      console.error('Error fetching hazards:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setIsMounted(true)
    fetchHazards()
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchHazards()
    setLastUpdate(new Date())
    setIsRefreshing(false)
  }

  // Auto-refresh every 10 seconds
  useEffect(() => {
    if (!isMounted) return
    const interval = setInterval(() => {
      setLastUpdate(new Date())
    }, 10000)
    return () => clearInterval(interval)
  }, [isMounted])

  const filteredHazards = hazards.filter((hazard) => {
    if (selectedCategory !== "All" && hazard.type !== selectedCategory) return false
    if (selectedSeverity !== "All" && hazard.severity !== selectedSeverity.toLowerCase()) return false
    if (selectedSource !== "All" && hazard.source !== selectedSource) return false
    if (searchQuery && !hazard.location.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const handleViewFullReport = () => {
    if (selectedHazard) {
      alert(`Opening full report for ${selectedHazard.type} at ${selectedHazard.location.name}`)
    }
  }

  const handleShareAlert = () => {
    if (selectedHazard) {
      navigator.clipboard.writeText(
        `Ocean Hazard Alert: ${selectedHazard.type} at ${selectedHazard.location.name} - ${selectedHazard.description}`,
      )
      alert("Alert details copied to clipboard!")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-ocean-deep)] via-[var(--color-ocean-medium)] to-[var(--color-ocean-light)]">
      {/* Header */}
      <header className="bg-[var(--color-ocean-deep)]/80 backdrop-blur-lg border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="w-10 h-10 bg-[var(--color-accent)] rounded-lg flex items-center justify-center pulse-glow"
            >
              <Waves className="w-6 h-6 text-white" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Ocean Hazard Dashboard</h1>
              <p className="text-white/60 text-sm flex items-center">
                Last updated: {isMounted ? lastUpdate.toLocaleTimeString() : '--:--:--'} IST
                <button onClick={handleRefresh} className="ml-2 hover:text-white transition-colors">
                  <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`} />
                </button>
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              {filteredHazards.length} Active Hazards
            </Badge>
            <Link href="/report/authenticated">
              <Button
                className="bg-[var(--color-coral-accent)] hover:bg-[var(--color-coral-accent)]/90 text-white"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Report Hazard
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </Link>
            <Button
              variant="outline"
              className="border-red-500/20 text-red-400 hover:bg-red-500/10 bg-transparent"
              onClick={() => {
                sessionStorage.removeItem('varuna-loaded')
                window.location.href = '/'
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar - Filters & Controls */}
        <div className="w-80 bg-[var(--color-ocean-deep)]/60 backdrop-blur-lg border-r border-white/10 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Search */}
            <div>
              <label className="text-white text-sm font-medium mb-2 block">Search Location</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                <Input
                  placeholder="Search by location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
              </div>
            </div>

            {/* Hazard Categories */}
            <div>
              <label className="text-white text-sm font-medium mb-3 block">Hazard Categories</label>
              <div className="grid grid-cols-2 gap-2">
                {hazardCategories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={
                      selectedCategory === category
                        ? "bg-[var(--color-accent)] text-white"
                        : "border-white/20 text-white hover:bg-white/10 bg-transparent"
                    }
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Severity Filter */}
            <div>
              <label className="text-white text-sm font-medium mb-2 block">Severity Level</label>
              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {severityLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Source Filter */}
            <div>
              <label className="text-white text-sm font-medium mb-2 block">Data Source</label>
              <Select value={selectedSource} onValueChange={setSelectedSource}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sourcesFilter.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Time Range */}
            <div>
              <label className="text-white text-sm font-medium mb-2 block">Time Range: Last {timeRange[0]} hours</label>
              <Slider value={timeRange} onValueChange={setTimeRange} max={168} min={1} step={1} className="w-full" />
            </div>

            {/* Map Options */}
            <div className="space-y-4">
              <h3 className="text-white font-medium">Map Options</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">Heatmap View</span>
                  <Switch checked={showHeatmap} onCheckedChange={setShowHeatmap} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">3D Globe Mode</span>
                  <Switch checked={show3D} onCheckedChange={setShow3D} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">Ocean Currents</span>
                  <Switch checked={showCurrents} onCheckedChange={setShowCurrents} />
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-4">
              <h3 className="text-white font-medium mb-3">Quick Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-white/80">
                  <span>Critical Alerts:</span>
                  <span className="text-red-400 font-medium">
                    {filteredHazards.filter((h) => h.severity === "critical").length}
                  </span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span>Verified Reports:</span>
                  <span className="text-green-400 font-medium">{filteredHazards.filter((h) => h.verified).length}</span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span>Citizen Reports:</span>
                  <span className="text-blue-400 font-medium">
                    {filteredHazards.filter((h) => h.source === "Citizen").length}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Main Map Area */}
        <div className="flex-1 relative">
          <MapComponent
            hazards={filteredHazards}
            onHazardSelect={setSelectedHazard}
            showHeatmap={showHeatmap}
            show3D={show3D}
            showCurrents={showCurrents}
          />

          {/* Map Controls */}
          <div className="absolute top-4 right-4 space-y-2 z-[1000]">
            <Button
              size="sm"
              className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20"
              onClick={() => alert("Layer controls opened")}
            >
              <Layers className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20"
              onClick={() => setShow3D(!show3D)}
            >
              <Globe className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20"
              onClick={() => alert("Navigation tools opened")}
            >
              <Navigation className="w-4 h-4" />
            </Button>
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-4 z-[1000]">
            <h4 className="text-white font-medium mb-2">Severity Levels</h4>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-white/80 text-sm">Critical</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-white/80 text-sm">High</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-white/80 text-sm">Medium</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-white/80 text-sm">Low</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Hazard Details */}
        <div className="w-96 bg-[var(--color-ocean-deep)]/60 backdrop-blur-lg border-l border-white/10 p-6 overflow-y-auto">
          {selectedHazard ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedHazard.type}</h3>
                  <p className="text-white/60">{selectedHazard.location.name}</p>
                </div>
                <Badge className={getSeverityBadgeColor(selectedHazard.severity)}>
                  {selectedHazard.severity.toUpperCase()}
                </Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-medium mb-2">Description</h4>
                  <p className="text-white/80 text-sm">{selectedHazard.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-white font-medium mb-1">Source</h4>
                    <p className="text-white/80 text-sm">{selectedHazard.source}</p>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Status</h4>
                    <Badge
                      className={
                        selectedHazard.verified ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                      }
                    >
                      {selectedHazard.verified ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-1">Reported</h4>
                  <p className="text-white/80 text-sm flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {selectedHazard.timestamp}
                  </p>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-2">Location</h4>
                  <p className="text-white/80 text-sm">
                    Lat: {selectedHazard.location.lat}°N
                    <br />
                    Lng: {selectedHazard.location.lng}°E
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-white"
                  onClick={handleViewFullReport}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Full Report
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
                  onClick={handleShareAlert}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Alert
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <h3 className="text-white font-medium mb-2">Select a Hazard</h3>
              <p className="text-white/60 text-sm">Click on any marker on the map to view detailed information</p>
            </div>
          )}

          {/* Recent Activity */}
          <div className="mt-8">
            <h3 className="text-white font-medium mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {loading ? (
                <div className="text-white/60 text-sm">Loading reports...</div>
              ) : filteredHazards.slice(0, 3).map((hazard) => (
                <Card
                  key={hazard.id}
                  className="bg-white/5 backdrop-blur-lg border-white/10 p-3 cursor-pointer hover:bg-white/10 transition-colors"
                  onClick={() => setSelectedHazard(hazard)}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${getSeverityColor(hazard.severity)} mt-1 flex-shrink-0`}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{hazard.type}</p>
                      <p className="text-white/60 text-xs truncate">{hazard.location.name}</p>
                      <p className="text-white/40 text-xs">{hazard.timestamp}</p>
                    </div>
                  </div>
                </Card>
              ))}
              {!loading && filteredHazards.length === 0 && (
                <div className="text-white/60 text-sm">No hazard reports found</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}