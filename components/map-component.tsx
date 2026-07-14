"use client"
import { useEffect, useRef } from "react"

interface Hazard {
  id: number
  type: string
  severity: string
  location: { lat: number; lng: number; name: string }
  timestamp: string
  source: string
  description: string
  verified: boolean
}

interface MapComponentProps {
  hazards: Hazard[]
  onHazardSelect: (hazard: Hazard) => void
  showHeatmap: boolean
  show3D: boolean
  showCurrents: boolean
}

export default function MapComponent({
  hazards,
  onHazardSelect,
  showHeatmap,
  show3D,
  showCurrents,
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    if (typeof window === "undefined") return

    // Dynamically import Leaflet to avoid SSR issues
    import("leaflet").then((L: any) => {
      if (!mapRef.current || mapInstanceRef.current) return

      // Initialize map centered on India
      const map = L.map(mapRef.current, {
        center: [20.5937, 78.9629], // Center of India
        zoom: 5,
        zoomControl: true,
        attributionControl: false,
      })

      // Add ocean-themed tile layer
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: "© OpenStreetMap contributors © CARTO",
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map)

      // Add custom CSS for ocean theme
      const style = document.createElement("style")
      style.textContent = `
        .leaflet-container {
          background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%);
        }
        .custom-marker {
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.5); }
          50% { box-shadow: 0 0 30px rgba(255, 255, 255, 0.8); }
          100% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.5); }
        }
        .leaflet-popup-content-wrapper {
          background: rgba(30, 58, 138, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          color: white;
        }
        .leaflet-popup-tip {
          background: rgba(30, 58, 138, 0.95);
        }
      `
      document.head.appendChild(style)

      mapInstanceRef.current = map

      // Add water ripple effect on click
      map.on("click", (e: any) => {
        const ripple = L.circle(e.latlng, {
          radius: 1000,
          fillColor: "#3b82f6",
          fillOpacity: 0.3,
          color: "#60a5fa",
          weight: 2,
          opacity: 0.8,
        }).addTo(map)

        // Animate ripple expansion
        let radius = 1000
        const interval = setInterval(() => {
          radius += 2000
          ripple.setRadius(radius)
          ripple.setStyle({
            fillOpacity: Math.max(0, 0.3 - radius / 20000),
            opacity: Math.max(0, 0.8 - radius / 15000),
          })

          if (radius > 50000) {
            clearInterval(interval)
            map.removeLayer(ripple)
          }
        }, 50)
      })
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Update markers when hazards change
  useEffect(() => {
    if (!mapInstanceRef.current || typeof window === "undefined") return

    import("leaflet").then((L: any) => {
      const map = mapInstanceRef.current

      // Clear existing markers
      markersRef.current.forEach((marker) => map.removeLayer(marker))
      markersRef.current = []

      // Add new markers
      hazards.forEach((hazard) => {
        const getSeverityColor = (severity: string) => {
          switch (severity) {
            case "critical":
              return "#ef4444"
            case "high":
              return "#f97316"
            case "medium":
              return "#eab308"
            case "low":
              return "#22c55e"
            default:
              return "#6b7280"
          }
        }

        const marker = L.circleMarker([hazard.location.lat, hazard.location.lng], {
          radius: hazard.severity === "critical" ? 12 : hazard.severity === "high" ? 10 : 8,
          fillColor: getSeverityColor(hazard.severity),
          color: "white",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8,
          className: "custom-marker",
        }).addTo(map)

        // Add popup
        marker.bindPopup(`
          <div class="p-3">
            <h3 class="font-bold text-lg mb-2">${hazard.type}</h3>
            <p class="text-sm mb-2">${hazard.location.name}</p>
            <p class="text-xs text-gray-300 mb-2">${hazard.description}</p>
            <div class="flex justify-between items-center text-xs">
              <span class="px-2 py-1 rounded" style="background: ${getSeverityColor(hazard.severity)}20; color: ${getSeverityColor(hazard.severity)}">
                ${hazard.severity.toUpperCase()}
              </span>
              <span class="text-gray-400">${hazard.timestamp}</span>
            </div>
          </div>
        `)

        marker.on("click", () => {
          onHazardSelect(hazard)
        })

        markersRef.current.push(marker)
      })
    })
  }, [hazards, onHazardSelect])

  return (
    <div className="h-full relative">
      <div ref={mapRef} className="h-full w-full" />

      {/* Ocean current overlay */}
      {showCurrents && (
        <div className="absolute inset-0 pointer-events-none z-[500]">
          <svg className="w-full h-full opacity-30">
            <defs>
              <pattern id="currents" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M0,50 Q25,25 50,50 T100,50" stroke="#60a5fa" strokeWidth="1" fill="none" opacity="0.6">
                  <animate
                    attributeName="stroke-dasharray"
                    values="0,100;50,50;100,0"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </path>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#currents)" />
          </svg>
        </div>
      )}
    </div>
  )
}
