"use server";

import { Answer, Question, Vote } from "@/database";
import { VoteType } from "@/database/vote.model";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import { CreateVoteSchema, HasVotedSchema, UpdateVoteCountSchema } from "@/lib/validations";
import { ActionResponse, ErrorResponse } from "@/types/global";
import mongoose, { ClientSession } from "mongoose";

export async function updateVoteCount(
  params: UpdateVoteCountParams,
  session?: ClientSession
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: UpdateVoteCountSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(ValidationError) as ErrorResponse;
  }

  const { targetId, targetType, voteType, change } = validationResult.params!;

  const voteField = voteType === "upvote" ? "upvotes" : "downvotes";

  try {
    const result =
      targetType === "question"
        ? await Question.findByIdAndUpdate(
            targetId,
            { $inc: { [voteField]: change } },
            { returnDocument: "after", session }
          )
        : await Answer.findByIdAndUpdate(
            targetId,
            { $inc: { [voteField]: change } },
            { returnDocument: "after", session }
          );
    if (!result) return handleError("Failed to update vote count") as ErrorResponse;

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function createVote(params: CreateVoteParams): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: CreateVoteSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(ValidationError) as ErrorResponse;
  }

  const { targetId, targetType, voteType } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  if (!userId) return handleError(new Error("Unauthorized")) as ErrorResponse;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingVote = await Vote.findOne({
      author: userId,
      actionId: targetId,
      actionType: targetType,
    }).session(session);

    if (existingVote) {
      await Vote.deleteOne({ _id: existingVote._id }).session(session);

      if (existingVote.voteType === voteType) {
        await updateVoteCount({ targetId, targetType, voteType, change: -1 }, session);
      } else {
        await updateVoteCount({ targetId, targetType, voteType, change: -1 }, session);
      }
    } else {
      await Vote.create(
        [
          {
            author: userId,
            actionId: targetId,
            actionType: targetType,
            voteType,
          },
        ],
        { session }
      );
      await updateVoteCount({ targetId, targetType, voteType, change: 1 }, session);
    }
    await session.commitTransaction();

    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function hasVoted(params: HasVotedParams): Promise<ActionResponse<HasVotedResponse>> {
  const validationResult = await action({
    params,
    schema: HasVotedSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(ValidationError) as ErrorResponse;
  }

  const { targetId, targetType } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  try {
    const vote = await Vote.findOne({
      author: userId,
      actionId: targetId,
      actionType: targetType,
    });

    if (!vote) return { success: false, data: { hasUpvoted: false, hasDownvoted: false } };

    return {
      success: true,
      data: {
        hasUpvoted: vote.voteType === VoteType.UPVOTE,
        hasDownvoted: vote.voteType === VoteType.DOWNVOTE,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
