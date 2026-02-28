import { NextResponse } from "next/server";

import { NotFoundError } from "@humanfs/core";
import { AccountSchema } from "@/lib/validations";
import handleError from "@/lib/handlers/error";
import { APIErrorResponse } from "@/types/global";
import Account from "@/database/user.model";
import { ValidationError } from "@/lib/http-errors";
import { z } from "zod";
import dbConnect from "@/lib/mongoose";

export async function POST(request: Request) {
  const { providerAccountId } = await request.json();

  try {
    await dbConnect();

    const validatedData = AccountSchema.partial().safeParse({ providerAccountId });

    if (!validatedData.success)
      throw new ValidationError(z.flattenError(validatedData.error).fieldErrors);

    const account = await Account.findOne({ providerAccountId });
    if (!account) throw new NotFoundError("Account");

    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
