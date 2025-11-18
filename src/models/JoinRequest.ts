import mongoose, { Schema, models, Model } from "mongoose";
import { IJoinRequest } from "@/types/models";

const JoinRequestSchema = new Schema<IJoinRequest>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    group: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },

    message: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const JoinRequest: Model<IJoinRequest> =
  (models.JoinRequest as Model<IJoinRequest>) ||
  mongoose.model<IJoinRequest>("JoinRequest", JoinRequestSchema);

export default JoinRequest;
