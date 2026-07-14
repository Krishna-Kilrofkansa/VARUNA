import mongoose, { Schema, Document, model, models } from "mongoose";

export interface ISocialCorpus extends Document {
  text: string;
  location: string;
  locationLat?: number;
  locationLng?: number;
  platform: string;
  author: string;
  timestamp: Date;
  keywords: string[];
  hazardType: string;
  language: string;
  engagement: number;
}

const SocialCorpusSchema = new Schema<ISocialCorpus>({
  text: { type: String, required: true },
  location: { type: String, required: true },
  locationLat: { type: Number },
  locationLng: { type: Number },
  platform: { type: String, default: "twitter" },
  author: { type: String, default: "anonymous" },
  timestamp: { type: Date, default: Date.now },
  keywords: [{ type: String }],
  hazardType: { type: String, required: true },
  language: { type: String, default: "en" },
  engagement: { type: Number, default: 0 },
});

// Full text search index
SocialCorpusSchema.index({ text: "text", location: "text", keywords: "text" });
SocialCorpusSchema.index({ locationLat: 1, locationLng: 1 });
SocialCorpusSchema.index({ hazardType: 1 });

export const SocialCorpus =
  models.socialcorpus || model<ISocialCorpus>("socialcorpus", SocialCorpusSchema);
