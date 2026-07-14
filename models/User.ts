import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  role: { type: String, enum: ["user", "admin"], default: "user" }
}

const UserSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  phone:     { type: String, required: true },
},
{collection:"auth"}
);


export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
