import { NextResponse } from "next/server";

import { NotFoundError } from "@humanfs/core";
import { UserSchema } from "@/lib/validations";
import handleError from "@/lib/handlers/error";
import { APIErrorResponse } from "@/types/global";
import User from "@/database/user.model";
import { ValidationError } from "@/lib/http-errors";
import { z } from "zod";
import dbConnect from "@/lib/mongoose";

export async function POST(request: Request) {
  const { email } = await request.json();

  try {
    await dbConnect();

    const validatedEmail = UserSchema.partial().safeParse({ email });

    if (!validatedEmail.success)
      throw new ValidationError(z.flattenError(validatedEmail.error).fieldErrors);

    const user = await User.findOne({ email });
    if (!user) throw new NotFoundError("User");

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
