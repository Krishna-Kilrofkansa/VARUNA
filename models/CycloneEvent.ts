import mongoose, { Schema, Document, model, models } from "mongoose";

export interface ICycloneEvent extends Document {
  name: string;
  year: number;
  basin: string;
  category: string;
  maxWindKnots: number;
  minPressureMb: number;
  startLat: number;
  startLng: number;
  affectedCoast: string[];
  season: string;
  duration: number; // days
  source: string;
}

const CycloneEventSchema = new Schema<ICycloneEvent>({
  name: { type: String, required: true },
  year: { type: Number, required: true },
  basin: { type: String, default: "NI" },
  category: { type: String },
  maxWindKnots: { type: Number },
  minPressureMb: { type: Number },
  startLat: { type: Number },
  startLng: { type: Number },
  affectedCoast: [{ type: String }],
  season: { type: String },
  duration: { type: Number },
  source: { type: String, default: "IBTrACS-NOAA" },
});

CycloneEventSchema.index({ year: 1 });
CycloneEventSchema.index({ startLat: 1, startLng: 1 });

export const CycloneEvent =
  models.cycloneevents || model<ICycloneEvent>("cycloneevents", CycloneEventSchema);
