import { HydratedDocument, Model, model, models, Schema, Types } from "mongoose";

export const InteractionActionEnum = [
  "views",
  "upvote",
  "downvote",
  "bookmark",
  "post",
  "edit",
  "delete",
  "search",
] as const;

enum InteractionAction {
  views = "views",
  upvote = "upvote",
  downvote = "downvote",
  bookmark = "bookmark",
  post = "post",
  edit = "edit",
  delete = "delete",
  search = "search",
}

enum ActionType {
  QUESTION = "question",
  ANSWER = "answer",
}

export interface IInteraction {
  user: Types.ObjectId;
  action: string;
  actionId: Types.ObjectId;
  actionType: ActionType;
}

export type IInteractionDoc = HydratedDocument<IInteraction>;
const InteractionSchema = new Schema<IInteractionDoc>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, enum: InteractionActionEnum, required: true },
    actionId: { type: Schema.Types.ObjectId, required: true },
    actionType: { type: String, enum: Object.values(ActionType), required: true },
  },
  { timestamps: true }
);

const Interaction: Model<IInteractionDoc> =
  (models?.Interaction as Model<IInteractionDoc>) ||
  model<IInteractionDoc>("Interaction", InteractionSchema);

export default Interaction;
