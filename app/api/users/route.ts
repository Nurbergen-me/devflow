import handleError from "@/lib/handlers/error";
import { APIErrorResponse } from "@/types/global";
import dbConnect from "@/lib/mongoose";
import User from "@/database/user.model";
import { NextResponse } from "next/server";
import { UserSchema } from "@/lib/validations";
import { z } from "zod";
import { RequestError, ValidationError } from "@/lib/http-errors";

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find();
    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    const validatedData = UserSchema.safeParse(body);

    if (!validatedData.success) {
      throw new ValidationError(z.flattenError(validatedData.error).fieldErrors);
    }

    const { email, username } = validatedData.data;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser?.email === email) {
      throw new RequestError(409, "User with this email already exists");
    }
    if (existingUser?.username === username) {
      throw new RequestError(409, "Username already taken");
    }

    const user = await User.create(validatedData.data);

    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
