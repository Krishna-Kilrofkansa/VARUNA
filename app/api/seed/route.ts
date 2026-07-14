import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { SocialCorpus } from "@/models/SocialCorpus";
import { CycloneEvent } from "@/models/CycloneEvent";
import { SOCIAL_CORPUS_DATA, CYCLONE_DATA } from "@/lib/datasets";

export async function POST() {
  try {
    await dbConnect();

    // Wipe and reseed
    await SocialCorpus.deleteMany({});
    await CycloneEvent.deleteMany({});

    // Seed social corpus
    const socialDocs = await SocialCorpus.insertMany(SOCIAL_CORPUS_DATA);

    // Seed cyclones
    const cycloneDocs = await CycloneEvent.insertMany(
      CYCLONE_DATA.map((c) => ({ ...c, basin: "NI", source: "IBTrACS-NOAA", duration: 5 }))
    );

    // Create text indexes (safe to run multiple times)
    try {
      await SocialCorpus.collection.createIndex(
        { text: "text", location: "text", keywords: "text" },
        { name: "social_text_idx" }
      );
    } catch {}

    return NextResponse.json({
      success: true,
      message: "Datasets seeded successfully",
      socialPosts: socialDocs.length,
      cyclones: cycloneDocs.length,
    });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const socialCount = await SocialCorpus.countDocuments();
    const cycloneCount = await CycloneEvent.countDocuments();
    return NextResponse.json({ socialCount, cycloneCount, seeded: socialCount > 0 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
