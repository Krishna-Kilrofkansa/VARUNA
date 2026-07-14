import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, password, phone, adminCode } = await req.json();

    await connectDB();

    // check admin code
    if (adminCode !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Invalid admin security code" }, { status: 403 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      role: "admin", // mark as admin
    });

    await admin.save();

    return NextResponse.json({ message: "Admin created successfully!" }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
