import mongoose, { Schema, models, Model } from "mongoose";
import { IUser } from "@/types/models";

const UserSchema = new Schema<IUser>(
  {
    name: String,
    phone: { type: String, required: true, unique: true },
    email: String,
    role: {
      type: String,
      enum: ["viewer", "photographer", "superadmin"],
      default: "viewer",
    },
    avatar: String,
  },
  { timestamps: true }
);

const User: Model<IUser> =
  (models.User as Model<IUser>) || mongoose.model<IUser>("User", UserSchema);

export default User;
