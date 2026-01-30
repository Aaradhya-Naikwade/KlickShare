import mongoose, { Schema, models, Model } from "mongoose";
import { IGroup } from "@/types/models";

const GroupSchema = new Schema<IGroup>(
  {
    name: { type: String, required: true },
    description: { type: String },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // MEMBERS ARRAY
    members: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // PHOTOS
    photos: [{ type: String }],

    // COVER PHOTO
    coverPhoto: {
      type: String,
      default: "/default-cover.png",
    },

    // PUBLIC GROUP?
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Group: Model<IGroup> =
  (models.Group as Model<IGroup>) ||
  mongoose.model<IGroup>("Group", GroupSchema);

export default Group;
