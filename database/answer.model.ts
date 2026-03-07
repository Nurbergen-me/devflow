import { HydratedDocument, Model, model, models, Schema, Types } from "mongoose";

export interface IAnswer {
  content: string;
  upvotes: number;
  downvotes: number;
  author: Types.ObjectId;
  question: Types.ObjectId;
}

// export interface IAnswerDoc extends IAnswer, Document {}
export type IAnswerDoc = HydratedDocument<IAnswer>;
const AnswerSchema = new Schema<IAnswerDoc>(
  {
    content: { type: String, required: true },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  },
  { timestamps: true }
);

const Answer: Model<IAnswerDoc> =
  (models?.Answer as Model<IAnswerDoc>) || model<IAnswerDoc>("Answer", AnswerSchema);

export default Answer;
