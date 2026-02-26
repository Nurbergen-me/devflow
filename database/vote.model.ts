import { model, models, Schema, Types } from "mongoose";

enum ActionType {
  QUESTION = "question",
  ANSWER = "answer",
}

enum VoteType {
  UPVOTE = "upvote",
  DOWNVOTE = "downvote",
}

export interface IVote {
  author: Types.ObjectId;
  actionId: Types.ObjectId;
  actionType: ActionType;
  voteType: VoteType;
}

export interface IVoteDoc extends IVote, Document {}
const VoteSchema = new Schema<IVote>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    actionId: { type: Schema.Types.ObjectId, required: true },
    actionType: { type: String, enum: Object.values(ActionType), required: true },
    voteType: { type: String, enum: Object.values(VoteType), required: true },
  },
  { timestamps: true }
);

const Vote = models?.Vote || model("Vote", VoteSchema);

export default Vote;
