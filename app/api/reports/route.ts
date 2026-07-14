import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { UserReport } from "@/models/UserReports";
import { analyzeReport, computeTrustScore } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const {
      hazardType,
      severity,
      description,
      contactName,
      contactPhone,
      location,
      files,
    } = body;

    if (!description || !hazardType || !severity) {
      return NextResponse.json(
        { message: "Missing required fields: hazardType, severity, description" },
        { status: 400 }
      );
    }

    // ── STEP 1: LLM Analysis via Gemini ──────────────────────────────────────
    const locationStr =
      location?.address ||
      (location?.lat && location?.lng
        ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
        : "India Coast");

    let aiResult;
    try {
      aiResult = await analyzeReport(description, hazardType, locationStr);
    } catch (aiError) {
      console.error("AI analysis failed, using fallback:", aiError);
      aiResult = {
        probabilityScore: 3,
        aiLabel: hazardType || "unknown",
        aiExplanation: "Automated analysis unavailable. Report saved for manual review.",
        keywords: [hazardType, ...(description.split(" ").slice(0, 5))],
        severity: "low" as const,
        isOceanHazard: true,
      };
    }

    // ── STEP 2: Save initial report to DB ───────────────────────────────────
    const newReport = new UserReport({
      hazardType,
      severity,
      description,
      contactName: contactName || "Anonymous",
      contactPhone: contactPhone || "",
      location,
      files: files || [],
      probabilityScore: aiResult.probabilityScore,
      trustScore: aiResult.probabilityScore * 0.6, // initial trust = 60% of prob
      aiLabel: aiResult.aiLabel,
      aiExplanation: aiResult.aiExplanation,
      keywords: aiResult.keywords,
      socialPostCount: 0,
      socialPosts: [],
      status: "pending",
    });

    await newReport.save();

    // ── STEP 3 & 4: Social Media Mining (async, updates report) ──────────────
    let socialData = { matchCount: 0, posts: [] };
    try {
      // Build social mining request
      const miningPayload = {
        location: locationStr,
        keywords: aiResult.keywords,
        reportId: newReport._id.toString(),
        hazardType: aiResult.aiLabel,
      };

      // Call internal social mining
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const socialResponse = await fetch(`${baseUrl}/api/social-mining`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(miningPayload),
      });

      if (socialResponse.ok) {
        socialData = await socialResponse.json();
      }
    } catch (socialError) {
      console.error("Social mining error (non-fatal):", socialError);
      // Try direct DB query as fallback
      try {
        const { SocialCorpus } = await import("@/models/SocialCorpus");
        const keywordRegex = new RegExp(aiResult.keywords.slice(0, 3).join("|"), "i");
        const posts = await SocialCorpus.find({
          $or: [
            { text: keywordRegex },
            { hazardType: new RegExp(aiResult.aiLabel, "i") },
          ]
        }).limit(10).lean();
        
        socialData = {
          matchCount: posts.length,
          posts: posts.map(p => ({
            source: p.platform,
            text: p.text,
            location: p.location,
            timestamp: p.timestamp,
            matchScore: 0.5,
          })),
        };
      } catch {}
    }

    // ── STEP 5: Compute final Trust Score & update ──────────────────────────
    const finalTrustScore = computeTrustScore(
      aiResult.probabilityScore,
      socialData.matchCount
    );

    await UserReport.findByIdAndUpdate(newReport._id, {
      trustScore: finalTrustScore,
      socialPostCount: socialData.matchCount,
      socialPosts: (socialData.posts || []).slice(0, 5),
    });

    // Auto-verify if high confidence
    if (finalTrustScore >= 8) {
      await UserReport.findByIdAndUpdate(newReport._id, {
        status: "verified",
        verified: true,
      });
    }

    // ── STEP 5: Return combined result to user ────────────────────────────────
    const trustLabel =
      finalTrustScore >= 8
        ? { label: "HIGH CONFIDENCE", color: "#ef4444", action: "Alert dispatched to coastal authorities" }
        : finalTrustScore >= 5
        ? { label: "MEDIUM CONFIDENCE", color: "#f97316", action: "Queued for expert review" }
        : { label: "LOW CONFIDENCE", color: "#eab308", action: "Saved for pattern analysis" };

    return NextResponse.json(
      {
        success: true,
        reportId: newReport._id.toString(),
        // Core pipeline result
        probabilityScore: aiResult.probabilityScore,
        trustScore: finalTrustScore,
        aiLabel: aiResult.aiLabel,
        aiExplanation: aiResult.aiExplanation,
        socialPostCount: socialData.matchCount,
        socialPosts: (socialData.posts || []).slice(0, 3),
        trustLabel,
        // Friendly message
        message:
          finalTrustScore >= 8
            ? `High confidence hazard detected (score: ${finalTrustScore}/10). ${socialData.matchCount} social posts corroborate this event. Alerts dispatched.`
            : finalTrustScore >= 5
            ? `Moderate confidence (score: ${finalTrustScore}/10). ${socialData.matchCount} related social posts found. Queued for review.`
            : `Report received (score: ${finalTrustScore}/10). ${socialData.matchCount} related social posts found. Saved for analysis.`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Report submission error:", error);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const status = searchParams.get("status");

    const query: any = {};
    if (status) query.status = status;

    const reports = await UserReport.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ reports });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
