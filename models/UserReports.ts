import mongoose, { Schema, Document, model, models } from "mongoose";

export interface ISocialPost {
  source: string;
  text: string;
  location: string;
  timestamp: Date;
  matchScore: number;
  platform?: string;
}

export interface IUserReport extends Document {
  hazardType: string;
  severity: string;
  description: string;
  contactName: string;
  contactPhone: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  } | null;
  files: string[];
  // AI Pipeline Fields
  probabilityScore: number;    // 0–10, from Gemini
  trustScore: number;          // 0–10, combined score
  aiLabel: string;             // e.g. "cyclone", "tsunami", "oil_spill"
  aiExplanation: string;       // LLM reasoning
  keywords: string[];          // extracted keywords for social mining
  // Social Mining Fields
  socialPostCount: number;     // number of matching social posts
  socialPosts: ISocialPost[];  // top matching posts
  // Status
  status: "pending" | "verified" | "dismissed";
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SocialPostSchema = new Schema<ISocialPost>({
  source: { type: String },
  text: { type: String },
  location: { type: String },
  timestamp: { type: Date },
  matchScore: { type: Number },
  platform: { type: String },
});

const UserReportSchema = new Schema<IUserReport>(
  {
    hazardType: { type: String, required: true },
    severity: { type: String, required: true },
    description: { type: String, required: true },
    contactName: { type: String, default: "Anonymous" },
    contactPhone: { type: String, default: "" },
    location: {
      lat: { type: Number },
      lng: { type: Number },
      address: { type: String },
    },
    files: [{ type: String }],
    // AI Pipeline
    probabilityScore: { type: Number, default: 0 },
    trustScore: { type: Number, default: 0 },
    aiLabel: { type: String, default: "unknown" },
    aiExplanation: { type: String, default: "" },
    keywords: [{ type: String }],
    // Social Mining
    socialPostCount: { type: Number, default: 0 },
    socialPosts: [SocialPostSchema],
    // Status
    status: {
      type: String,
      enum: ["pending", "verified", "dismissed"],
      default: "pending",
    },
    verified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Text index for efficient searching
UserReportSchema.index({ description: "text", aiLabel: "text", keywords: "text" });
UserReportSchema.index({ "location.lat": 1, "location.lng": 1 });
UserReportSchema.index({ status: 1, trustScore: -1 });

export const UserReport =
  models.userreports ||
  model<IUserReport>("userreports", UserReportSchema);
