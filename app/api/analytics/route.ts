import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { UserReport } from "@/models/UserReports";

export async function GET() {
  try {
    await dbConnect();

    // Parallel aggregation queries
    const [
      totalReports,
      byHazardType,
      bySeverity,
      byStatus,
      byTrustScore,
      recentTrend,
      topLocations,
      avgScores,
      socialStats,
    ] = await Promise.all([
      // Total reports
      UserReport.countDocuments({}),

      // By hazard type
      UserReport.aggregate([
        { $group: { _id: "$hazardType", count: { $sum: 1 }, avgTrust: { $avg: "$trustScore" } } },
        { $sort: { count: -1 } },
      ]),

      // By severity
      UserReport.aggregate([
        { $group: { _id: "$severity", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // By status
      UserReport.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),

      // Trust score distribution
      UserReport.aggregate([
        {
          $bucket: {
            groupBy: "$trustScore",
            boundaries: [0, 2, 4, 6, 8, 10.1],
            default: "unknown",
            output: { count: { $sum: 1 }, label: { $first: "$aiLabel" } },
          },
        },
      ]),

      // Last 30 days trend
      UserReport.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
            avgTrust: { $avg: "$trustScore" },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // Top locations
      UserReport.aggregate([
        { $match: { "location.address": { $exists: true, $ne: "" } } },
        {
          $group: {
            _id: "$location.address",
            count: { $sum: 1 },
            avgTrust: { $avg: "$trustScore" },
            lat: { $first: "$location.lat" },
            lng: { $first: "$location.lng" },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),

      // Average scores
      UserReport.aggregate([
        {
          $group: {
            _id: null,
            avgProbability: { $avg: "$probabilityScore" },
            avgTrust: { $avg: "$trustScore" },
            avgSocialPosts: { $avg: "$socialPostCount" },
            maxTrust: { $max: "$trustScore" },
          },
        },
      ]),

      // Social mining stats
      UserReport.aggregate([
        {
          $group: {
            _id: null,
            totalSocialPosts: { $sum: "$socialPostCount" },
            reportsWithSocial: {
              $sum: { $cond: [{ $gt: ["$socialPostCount", 0] }, 1, 0] },
            },
          },
        },
      ]),
    ]);

    // High confidence alerts (trust >= 8)
    const highConfidenceAlerts = await UserReport.find({
      trustScore: { $gte: 8 },
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("hazardType aiLabel trustScore probabilityScore location createdAt status socialPostCount")
      .lean();

    return NextResponse.json({
      summary: {
        totalReports,
        avgProbability: avgScores[0]?.avgProbability?.toFixed(1) || 0,
        avgTrust: avgScores[0]?.avgTrust?.toFixed(1) || 0,
        totalSocialPosts: socialStats[0]?.totalSocialPosts || 0,
        reportsWithSocial: socialStats[0]?.reportsWithSocial || 0,
        highConfidenceCount: highConfidenceAlerts.length,
      },
      byHazardType,
      bySeverity,
      byStatus,
      byTrustScore,
      recentTrend,
      topLocations,
      highConfidenceAlerts,
    });
  } catch (error: any) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
