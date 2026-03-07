import { Model, model, models, Schema, Types } from "mongoose";

enum ActionType {
  QUESTION = "question",
  ANSWER = "answer",
}

export const VoteType = {
  UPVOTE: "upvote",
  DOWNVOTE: "downvote",
} as const;

export type VoteType = (typeof VoteType)[keyof typeof VoteType];

export interface IVote {
  author: Types.ObjectId;
  actionId: Types.ObjectId;
  actionType: ActionType;
  voteType: VoteType;
}

export interface IVoteDoc extends IVote, Document {}
const VoteSchema = new Schema<IVoteDoc>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    actionId: { type: Schema.Types.ObjectId, required: true },
    actionType: { type: String, enum: Object.values(ActionType), required: true },
    voteType: { type: String, enum: Object.values(VoteType), required: true },
  },
  { timestamps: true }
);

const Vote: Model<IVoteDoc> =
  (models?.Vote as Model<IVoteDoc>) || model<IVoteDoc>("Vote", VoteSchema);

export default Vote;
