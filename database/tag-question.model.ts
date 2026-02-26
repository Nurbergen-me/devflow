import { model, models, Schema, Types } from "mongoose";

export interface TagQuestion {
  tag: Types.ObjectId;
  question: Types.ObjectId;
}

export interface TagQuestionDoc extends TagQuestion, Document {}
const TagQuestionSchema = new Schema(
  {
    tag: { type: Schema.Types.ObjectId, ref: "Tag", required: true },
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  },
  { timestamps: true }
);

const TagQuestion = models?.TagQuestion || model("TagQuestion", TagQuestionSchema);

export default TagQuestion;
