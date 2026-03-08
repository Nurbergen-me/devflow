import { HydratedDocument, Model, model, models, Schema, Types } from "mongoose";

export interface ICollection {
  author: Types.ObjectId;
  question: Types.ObjectId;
}

export type ICollectionDoc = HydratedDocument<ICollection>;
const CollectionSchema = new Schema<ICollectionDoc>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  },
  { timestamps: true }
);

const Collection: Model<ICollectionDoc> =
  (models?.Collection as Model<ICollectionDoc>) ||
  model<ICollectionDoc>("Collection", CollectionSchema);

export default Collection;
