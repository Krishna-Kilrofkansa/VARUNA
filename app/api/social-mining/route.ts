import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { SocialCorpus } from "@/models/SocialCorpus";
import { UserReport } from "@/models/UserReports";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { location, keywords, reportId, hazardType, radius = 200 } = body;

    if (!keywords || keywords.length === 0) {
      return NextResponse.json({ matchCount: 0, posts: [] });
    }

    // Build keyword search query
    const keywordRegex = keywords
      .map((k: string) => k.trim())
      .filter(Boolean)
      .join("|");

    const locationTerms = location
      ? location.split(",").map((t: string) => t.trim()).filter(Boolean)
      : [];

    // Full-text search with MongoDB text index
    let query: any = {
      $text: { $search: keywords.join(" ") },
    };

    // If location terms provided, also filter by location
    if (locationTerms.length > 0) {
      const locationRegex = new RegExp(locationTerms.join("|"), "i");
      query = {
        $and: [
          { $text: { $search: keywords.join(" ") } },
          {
            $or: [
              { location: locationRegex },
              { text: locationRegex },
            ],
          },
        ],
      };
    }

    // Also do a hazardType-based search as fallback
    const hazardQuery = hazardType
      ? { hazardType: { $regex: new RegExp(hazardType, "i") } }
      : null;

    let posts: any[] = [];

    // Primary: text search
    try {
      posts = await SocialCorpus.find(query, { score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" } })
        .limit(20)
        .lean();
    } catch {
      // Text index may not be ready yet, fallback to regex
      const regexQuery: any = {
        $or: [
          { text: { $regex: new RegExp(keywordRegex, "i") } },
          { keywords: { $in: keywords } },
        ],
      };
      if (locationTerms.length > 0) {
        regexQuery.location = { $regex: new RegExp(locationTerms.join("|"), "i") };
      }
      posts = await SocialCorpus.find(regexQuery).limit(20).lean();
    }

    // Fallback: hazard type search if nothing found
    if (posts.length === 0 && hazardQuery) {
      posts = await SocialCorpus.find(hazardQuery).limit(10).lean();
    }

    const matchCount = posts.length;
    const topPosts = posts.slice(0, 10).map((p) => ({
      source: p.platform || "social",
      text: p.text,
      location: p.location,
      timestamp: p.timestamp,
      matchScore: p.score || 0.5,
      platform: p.platform,
      author: p.author,
      engagement: p.engagement || 0,
    }));

    // Update report if reportId provided
    if (reportId && matchCount > 0) {
      try {
        const report = await UserReport.findById(reportId);
        if (report) {
          const { computeTrustScore } = await import("@/lib/gemini");
          const newTrustScore = computeTrustScore(report.probabilityScore, matchCount);
          
          await UserReport.findByIdAndUpdate(reportId, {
            socialPostCount: matchCount,
            socialPosts: topPosts,
            trustScore: newTrustScore,
            updatedAt: new Date(),
          });
        }
      } catch (updateErr) {
        console.error("Error updating report with social data:", updateErr);
      }
    }

    return NextResponse.json({
      matchCount,
      posts: topPosts,
      searchTerms: keywords,
      locationFilter: locationTerms,
    });
  } catch (error: any) {
    console.error("Social mining error:", error);
    return NextResponse.json(
      { error: error.message, matchCount: 0, posts: [] },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const location = searchParams.get("location") || "";
    const hazardType = searchParams.get("hazardType") || "";
    const limit = parseInt(searchParams.get("limit") || "20");

    const query: any = {};
    if (hazardType) {
      query.hazardType = { $regex: new RegExp(hazardType, "i") };
    }
    if (location) {
      query.location = { $regex: new RegExp(location, "i") };
    }

    const posts = await SocialCorpus.find(query)
      .sort({ timestamp: -1, engagement: -1 })
      .limit(limit)
      .lean();

    // Get trending keywords
    const trending = await SocialCorpus.aggregate([
      { $unwind: "$keywords" },
      { $group: { _id: "$keywords", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 15 },
    ]);

    // Get platform distribution
    const platforms = await SocialCorpus.aggregate([
      { $group: { _id: "$platform", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Get hazard type distribution
    const hazardDist = await SocialCorpus.aggregate([
      { $group: { _id: "$hazardType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    return NextResponse.json({
      posts,
      trending,
      platforms,
      hazardDist,
      total: await SocialCorpus.countDocuments(query),
    });
  } catch (error: any) {
    console.error("Social GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
