import { model, models, Schema, Types } from "mongoose";

enum Type {
  QUESTION = "question",
  ANSWER = "answer",
}

enum VoteType {
  UPVOTE = "upvote",
  DOWNVOTE = "downvote",
}

export interface IVote {
  author: Types.ObjectId;
  id: Types.ObjectId;
  type: Type;
  voteType: VoteType;
}

const VoteSchema = new Schema<IVote>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    id: { type: Schema.Types.ObjectId, required: true },
    type: { type: String, enum: Object.values(Type), required: true },
    voteType: { type: String, enum: Object.values(VoteType), required: true },
  },
  { timestamps: true }
);

const Vote = models?.vote || model("Vote", VoteSchema);

export default Vote;
