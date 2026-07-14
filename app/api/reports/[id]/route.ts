import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { UserReport } from "@/models/UserReports";

// PATCH /api/reports/[id] — verify or dismiss a report (admin action)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const body = await req.json();
    const { status, verified } = body;

    const updated = await UserReport.findByIdAndUpdate(
      params.id,
      { status, verified: status === "verified", updatedAt: new Date() },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, report: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const report = await UserReport.findById(params.id).lean();
    if (!report) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ report });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
