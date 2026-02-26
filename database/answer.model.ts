import { model, models, Schema, Types } from "mongoose";

export interface IAnswer {
  content: string;
  upvotes: number;
  downvotes: number;
  author: Types.ObjectId;
  question: Types.ObjectId;
}

const AnswerSchema = new Schema<IAnswer>(
  {
    content: { type: String, required: true },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  },
  { timestamps: true }
);

const Answer = models?.answer || model<IAnswer>("Answer", AnswerSchema);

export default Answer;
