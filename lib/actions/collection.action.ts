"use server";

import ROUTES from "@/constants/routes";
import { Collection, Question } from "@/database";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { CollectionBaseSchema, PaginatedSearchParamsSchema } from "@/lib/validations";
import { CollectionBaseParams } from "@/types/action";
import {
  ActionResponse,
  ErrorResponse,
  ICollection,
  IQuestion,
  PaginatedSearchParams,
} from "@/types/global";
import mongoose, { PipelineStage } from "mongoose";
import { revalidatePath } from "next/cache";

export async function toggleSaveQuestion(
  params: CollectionBaseParams
): Promise<ActionResponse<{ saved: boolean }>> {
  const validationResult = await action({
    params,
    schema: CollectionBaseSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  try {
    const question = await Question.exists({ _id: questionId });
    if (!question) throw new Error("Question not found");

    const collection = await Collection.findOne({
      author: userId,
      question: questionId,
    });

    if (collection) {
      await Collection.deleteOne({ _id: collection._id });
    } else {
      await Collection.create({ author: userId, question: questionId });
    }

    revalidatePath(ROUTES.QUESTION(questionId));

    return { success: true, data: { saved: !collection } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function hasSavedQuestion(
  params: CollectionBaseParams
): Promise<ActionResponse<{ saved: boolean }>> {
  const validationResult = await action({
    params,
    schema: CollectionBaseSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  try {
    const collection = await Collection.exists({ question: questionId, author: userId });

    return { success: true, data: { saved: !!collection } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getSavedQuestions(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ collection: ICollection[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, filter, query } = params;
  const userId = validationResult?.session?.user?.id;

  const skip = (page - 1) * pageSize;
  const limit = pageSize;

  const sortOptions: Record<string, Record<string, 1 | -1>> = {
    mostrecent: { "question.createdAt": -1 },
    oldest: { "question.createdAt": 1 },
    mostupvoted: { "question.upvotes": -1 },
    mostviewed: { "question.views": -1 },
    mostanswered: { "question.answers": -1 },
  };

  const sortCriteria = sortOptions[filter as string] || sortOptions.mostrecent;

  try {
    const basePipeline: PipelineStage[] = [
      { $match: { author: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "questions",
          localField: "question",
          foreignField: "_id",
          as: "question",
        },
      },
      { $unwind: "$question" },
      {
        $lookup: {
          from: "users",
          localField: "question.author",
          foreignField: "_id",
          as: "question.author",
        },
      },
      { $unwind: "$question.author" },
      {
        $lookup: {
          from: "tags",
          localField: "question.tags",
          foreignField: "_id",
          as: "question.tags",
        },
      },
    ];

    if (query) {
      basePipeline.push({
        $match: {
          $or: [
            { "question.title": { $regex: query, $options: "i" } },
            { "question.content": { $regex: query, $options: "i" } },
          ],
        },
      });
    }

    const [result] = await Collection.aggregate([
      ...basePipeline,
      {
        $facet: {
          data: [
            { $sort: sortCriteria },
            { $skip: skip },
            { $limit: limit },
            { $project: { question: 1, author: 1 } },
          ],
          count: [{ $count: "count" }],
        },
      },
    ]);

    const questions = result.data;
    const totalCount = result.count[0]?.count || 0;

    const isNext = totalCount > skip + questions.length;

    return { success: true, data: { collection: JSON.parse(JSON.stringify(questions)), isNext } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
