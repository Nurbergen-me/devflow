import { model, models, Schema, Model } from "mongoose";
import { HydratedDocument } from "mongoose";

export interface IUser {
  name: string;
  username: string;
  email: string;
  bio?: string;
  image?: string;
  location?: string;
  portfolio?: string;
  reputation?: number;
}

// export interface IUserDoc extends IUser, Document {}
export type IUserDoc = HydratedDocument<IUser>;
const UserSchema = new Schema<IUserDoc>(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    bio: { type: String },
    image: { type: String },
    location: { type: String },
    portfolio: { type: String },
    reputation: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User: Model<IUserDoc> =
  (models?.User as Model<IUserDoc>) || model<IUserDoc>("User", UserSchema);

export default User;
