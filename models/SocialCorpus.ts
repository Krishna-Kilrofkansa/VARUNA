import mongoose, { Schema, Document, model, models } from "mongoose";

export interface ISocialCorpus extends Document {
  text: string;
  location: string;
  locationLat?: number | null;
  locationLng?: number | null;
  platform: string;
  author: string;
  timestamp: Date;
  keywords: string[];
  hazardType: string;
  language: string;
  engagement: number;
  // Reddit-specific fields
  redditId?: string;
  upvoteRatio?: number;
  url?: string;
  subreddit?: string;
  numComments?: number;
}

const SocialCorpusSchema = new Schema<ISocialCorpus>({
  text: { type: String, required: true },
  location: { type: String, required: true },
  locationLat: { type: Number, default: null },
  locationLng: { type: Number, default: null },
  platform: { type: String, default: "twitter" },
  author: { type: String, default: "anonymous" },
  timestamp: { type: Date, default: Date.now },
  keywords: [{ type: String }],
  hazardType: { type: String, required: true },
  language: { type: String, default: "en" },
  engagement: { type: Number, default: 0 },
  // Reddit-specific
  redditId: { type: String, sparse: true, unique: true },
  upvoteRatio: { type: Number },
  url: { type: String },
  subreddit: { type: String },
  numComments: { type: Number },
});

// Full text search index
SocialCorpusSchema.index({ text: "text", location: "text", keywords: "text" });
SocialCorpusSchema.index({ locationLat: 1, locationLng: 1 });
SocialCorpusSchema.index({ hazardType: 1 });
SocialCorpusSchema.index({ platform: 1 });
SocialCorpusSchema.index({ redditId: 1 }, { sparse: true, unique: true });

export const SocialCorpus =
  models.socialcorpus || model<ISocialCorpus>("socialcorpus", SocialCorpusSchema);
