import { HydratedDocument, Model, model, models, Schema, Types } from "mongoose";

interface IQuestion {
  title: string;
  content: string;
  tags: Types.ObjectId[];
  views: number;
  answers: number;
  upvotes: number;
  downvotes: number;
  author: Types.ObjectId;
}

// export interface IQuestionDoc extends IQuestion, Document {}
export type IQuestionDoc = HydratedDocument<IQuestion>;
const QuestionSchema = new Schema<IQuestionDoc>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    views: { type: Number, default: 0 },
    answers: { type: Number, default: 0 },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Question: Model<IQuestionDoc> =
  (models.Question as Model<IQuestionDoc>) || model<IQuestionDoc>("Question", QuestionSchema);

export default Question;
