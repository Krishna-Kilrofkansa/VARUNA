import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import { UserReport } from "@/models/UserReports"

export async function GET() {
  try {
    await dbConnect()

    const reports = await UserReport.find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .lean()

    const hazards = reports
      .filter(report => {
        const hasObjectLocation = report.location?.lat && report.location?.lng
        const hasDirectLocation = (report as any).latitude && (report as any).longitude
        return hasObjectLocation || hasDirectLocation
      })
      .map(report => {
        let lat: number | null = null
        let lng: number | null = null
        let address: string = "Unknown Location"

        if (report.location?.lat && report.location?.lng) {
          lat = report.location.lat
          lng = report.location.lng
          address = report.location.address || "Unknown Location"
        } else if ((report as any).latitude && (report as any).longitude) {
          lat = (report as any).latitude
          lng = (report as any).longitude
          address = (report.location as any) || "Unknown Location"
        }

        return {
          id: report._id.toString(),
          hazardType: report.hazardType || "Unknown",
          severity: (report.severity || "low").toLowerCase(),
          location: { lat, lng, name: address },
          description: report.description || "No description",
          contactName: report.contactName || "N/A",
          contactPhone: report.contactPhone || "N/A",
          verified: report.verified || false,
          status: report.status || "pending",
          createdAt: report.createdAt,
          source: "Citizen",
          // AI Pipeline fields
          probabilityScore: report.probabilityScore ?? null,
          trustScore: report.trustScore ?? null,
          aiLabel: report.aiLabel || null,
          aiExplanation: report.aiExplanation || null,
          socialPostCount: report.socialPostCount ?? 0,
          keywords: report.keywords || [],
        }
      })

    return NextResponse.json({ hazards })
  } catch (error: any) {
    console.error("Error fetching hazards:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH() {
  // Bulk operations handled by /api/reports/[id]
  return NextResponse.json({ message: "Use /api/reports/[id] for individual updates" })
}
