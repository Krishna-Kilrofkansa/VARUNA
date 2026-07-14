import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password, adminCode } = await req.json();

    if (!email || !password || !adminCode) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // check security code from environment
    if (adminCode !== process.env.ADMIN_SECURITY_CODE) {
      return NextResponse.json({ error: "Invalid security code" }, { status: 401 });
    }

    await dbConnect();

    // find the user in varuna.auth
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // generate admin token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: "admin" },
      process.env.JWT_SECRET || "mysecretkey",
      { expiresIn: "1h" }
    );

    return NextResponse.json({ message: "Admin login successful", token }, { status: 200 });
  } catch (error) {
    console.error("Admin Signin Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
