import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, password, phone } = await req.json();

    if (!firstName || !lastName || !email || !password || !phone) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
    });

    return NextResponse.json({ message: "User created", userId: newUser._id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
