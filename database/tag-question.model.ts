import { HydratedDocument, Model, model, models, Schema, Types } from "mongoose";

export interface TagQuestion {
  tag: Types.ObjectId;
  question: Types.ObjectId;
}

export type TagQuestionDoc = HydratedDocument<TagQuestion>;
const TagQuestionSchema = new Schema<TagQuestionDoc>(
  {
    tag: { type: Schema.Types.ObjectId, ref: "Tag", required: true },
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  },
  { timestamps: true }
);

const TagQuestion: Model<TagQuestionDoc> =
  (models?.TagQuestion as Model<TagQuestionDoc>) ||
  model<TagQuestionDoc>("TagQuestion", TagQuestionSchema);

export default TagQuestion;
