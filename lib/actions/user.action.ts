"use server";

import { Answer, Question, User } from "@/database";
import { IUserDoc } from "@/database/user.model";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { GetUserSchema, PaginatedSearchParamsSchema } from "@/lib/validations";
import { ActionResponse, ErrorResponse, IUser, PaginatedSearchParams } from "@/types/global";
import mongoose from "mongoose";

export async function getUsers(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ users: IUser[]; isNext: boolean }>> {
  const validatedResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query, filter } = validatedResult.params!;

  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  let sortCriteria = {};

  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "popular":
      sortCriteria = { reputation: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  const filterQuery: mongoose.QueryFilter<IUserDoc> = {};

  if (query) {
    filterQuery.$or = [
      { name: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
    ];
  }

  try {
    const totalUsers = await User.countDocuments(filterQuery);
    const users = await User.find(filterQuery).sort(sortCriteria).skip(skip).limit(limit);

    const isNext = totalUsers > skip + limit;

    return { success: true, data: { users: JSON.parse(JSON.stringify(users)), isNext } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUser(params: {
  userId: string;
}): Promise<ActionResponse<{ user: IUser; totalQuestions: number; totalAnswers: number }>> {
  const validatedResult = await action({
    params,
    schema: GetUserSchema,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const { userId } = validatedResult.params!;

  try {
    const user = await User.findById(userId);
    if (!user) return handleError(new Error("User not found")) as ErrorResponse;

    const totalQuestions = await Question.countDocuments({ author: userId });
    const totalAnswers = await Answer.countDocuments({ author: userId });

    return {
      success: true,
      data: { user: JSON.parse(JSON.stringify(user)), totalQuestions, totalAnswers },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
