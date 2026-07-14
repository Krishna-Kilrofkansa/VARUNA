import mongoose, { Schema, Document } from "mongoose";

export interface IAdmin extends Document {
  email: string;
  password: string;
  adminCode: string;
}

const AdminSchema = new Schema<IAdmin>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  adminCode: { type: String, required: true }, // 6-digit code
});

export default mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);
