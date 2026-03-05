import {
  ActionResponse,
  ErrorResponse,
  PaginatedSearchParams,
  ITag,
  GetTagQuesionsParams,
  IQuestion,
} from "@/types/global";
import action from "@/lib/handlers/action";
import { GetTagQuestionsSchema, PaginatedSearchParamsSchema } from "@/lib/validations";
import handleError from "@/lib/handlers/error";
import mongoose from "mongoose";
import { ITagDoc } from "@/database/tag.model";
import { Question, Tag } from "@/database";
import { IQuestionDoc } from "@/database/question.model";

export async function getTags(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ tags: ITag[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query, filter } = validationResult.params!;

  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  const filterQuery: mongoose.QueryFilter<ITagDoc> = {};

  if (query) {
    filterQuery.$or = [{ name: { $regex: new RegExp(query, "i") } }];
  }

  let sortCriteria = {};

  switch (filter) {
    case "popular":
      sortCriteria = { questions: -1 };
      break;
    case "recent":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "name":
      sortCriteria = { name: 1 };
      break;
    default:
      sortCriteria = { questions: -1 };
      break;
  }

  try {
    const totalTags = await Tag.countDocuments(filterQuery);
    const tags = await Tag.find(filterQuery).sort(sortCriteria).skip(skip).limit(limit).lean();
    const isNext = totalTags > skip + limit;

    return {
      success: true,
      data: { tags: JSON.parse(JSON.stringify(tags)), isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getTagQuestions(
  params: GetTagQuesionsParams
): Promise<ActionResponse<{ tag: ITag; questions: IQuestion[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: GetTagQuestionsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { tagId, page = 1, pageSize = 10, query } = validationResult.params!;

  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  try {
    const tag = await Tag.findById(tagId);
    if (!tag) throw new Error("Tag not found");

    const filterQuery: mongoose.QueryFilter<IQuestionDoc> = {
      tags: { $in: [tagId] },
    };

    if (query) {
      filterQuery.title = { $regex: new RegExp(query, "i") };
    }

    let sortCriteria = {};
    const totalQuestions = await Question.countDocuments(filterQuery);
    const questions = await Question.find(filterQuery)
      .select("_id title views answers upvotes downvotes author createdAt")
      .populate([
        { path: "tags", select: "name" },
        { path: "author", select: "name image" },
      ])
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit)
      .lean();
    const isNext = totalQuestions > skip + limit;

    return {
      success: true,
      data: {
        tag: JSON.parse(JSON.stringify(tag)),
        questions: JSON.parse(JSON.stringify(questions)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
