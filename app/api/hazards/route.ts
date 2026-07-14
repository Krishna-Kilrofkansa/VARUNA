import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import { UserReport } from "@/models/UserReports"

export async function GET() {
  try {
    await dbConnect()
    
    const reports = await UserReport.find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()

    const hazards = reports
      .filter(report => {
        // Handle both location formats
        const hasObjectLocation = report.location?.lat && report.location?.lng
        const hasDirectLocation = report.latitude && report.longitude
        return hasObjectLocation || hasDirectLocation
      })
      .map(report => {
        // Extract location data based on format
        let lat, lng, address
        
        if (report.location?.lat && report.location?.lng) {
          // Format 1: location object with lat/lng
          lat = report.location.lat
          lng = report.location.lng
          address = report.location.address || "Unknown Location"
        } else if (report.latitude && report.longitude) {
          // Format 2: direct latitude/longitude fields
          lat = report.latitude
          lng = report.longitude
          address = report.location || "Unknown Location"
        }
        
        return {
          id: report._id.toString(),
          type: report.hazardType,
          severity: report.severity.toLowerCase(),
          location: {
            lat: lat,
            lng: lng,
            name: address
          },
          timestamp: new Date(report.createdAt).toLocaleString(),
          source: "Citizen",
          description: report.description,
          verified: report.verified || false
        }
      })
    
    console.log('Valid hazards after filtering:', hazards.length)
    return NextResponse.json({ hazards })
  } catch (error) {
    console.error("Error fetching hazards:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}