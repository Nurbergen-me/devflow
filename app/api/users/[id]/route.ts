import { NotFoundError } from "@/lib/http-errors";
import handleError from "@/lib/handlers/error";
import { APIErrorResponse } from "@/types/global";
import dbConnect from "@/lib/mongoose";
import User from "@/database/user.model";
import { NextResponse } from "next/server";
import { UserSchema } from "@/lib/validations";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) throw new NotFoundError("User");

  try {
    await dbConnect();
    const user = await User.findById(id);

    if (!user) throw new NotFoundError("User");

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) throw new NotFoundError("User");

  try {
    await dbConnect();
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new NotFoundError("User");

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) throw new NotFoundError("User");

  try {
    await dbConnect();
    const body = await request.json();
    const validatedData = UserSchema.partial().parse(body);

    const updateUser = await User.findByIdAndUpdate(id, validatedData, { returnDocument: "after" });

    return NextResponse.json({ success: true, data: updateUser }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
