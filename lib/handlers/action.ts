"use server";

import { z, ZodError, ZodSchema } from "zod";
import { UnauthorizedError, ValidationError } from "@/lib/http-errors";
import { Session } from "next-auth";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";

type ActionOptions<T> = {
  params?: T;
  schema?: ZodSchema<T>;
  authorize?: boolean;
};
async function action<T>({ params, schema, authorize }: ActionOptions<T>) {
  if (schema && params) {
    try {
      schema.parse(params);
    } catch (error) {
      if (error instanceof ZodError) {
        return new ValidationError(z.flattenError(error).fieldErrors as Record<string, string[]>);
      } else {
        return new Error("Schema validation error");
      }
    }
  }

  let session: Session | null = null;
  if (authorize) {
    session = await auth();

    if (!session) {
      return new UnauthorizedError();
    }
  }

  await dbConnect();

  return { params, session };
}

export default action;
