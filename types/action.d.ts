import { IInteractionDoc, InteractionActionEnum } from "@/database/interaction.model";
import { PaginatedSearchParams } from "@/types/global";
import mongoose from "mongoose";

interface SignInWithOAuthParams {
  provider: "github" | "google";
  providerAccountId: string;
  user: {
    email: string;
    name: string;
    image: string;
    username: string;
  };
}

interface AuthCredentials {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface CreateQuestionParams {
  title: string;
  content: string;
  tags: string[];
}

interface EditQuestionParams extends CreateQuestionParams {
  questionId: string;
}

interface GetQuestionParams {
  questionId: string;
  increment?: boolean;
}

interface CreateAnswerParams extends GetQuestionParams {
  content: string;
}

interface CreateVoteParams {
  targetId: string;
  targetType: "question" | "answer";
  voteType: "upvote" | "downvote";
}

interface UpdateVoteCountParams extends CreateVoteParams {
  change: 1 | -1;
}

type HasVotedParams = Pick<CreateVoteParams, "targetId" | "targetType">;

interface HasVotedResponse {
  hasUpvoted: boolean;
  hasDownvoted: boolean;
}

interface CollectionBaseParams {
  questionId: string;
}

interface GetUserParams {
  userId: string;
}

interface GetUserQuestionsParams extends Omit<PaginatedSearchParams, "filter" | "query" | "sort"> {
  userId: string;
}

interface GetUserAnswersParams extends PaginatedSearchParams {
  userId: string;
}

interface GetUserTopTagsParams {
  userId: string;
}

interface DeleteQuestionParams {
  questionId: string;
}

interface DeleteAnswerParams {
  answerId: string;
}

interface CreateInteractionParams {
  authorId: string;
  actionId: string;
  actionTarget: "question" | "answer";
  action: InteractionActionEnum;
}

interface UpdateReputationParams {
  interaction: IInteractionDoc;
  session: mongoose.ClientSession;
  performerId: string;
  authorId: string;
}
