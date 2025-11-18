import mongoose, { Schema, models, Model } from "mongoose";

const NotificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    body: {
      type: String,
      required: true,
    },

    link: {
      type: String,
      default: "",
    },

    // Extra dynamic data (IMPORTANT for join-requests, groupId, photoId etc.)
    data: {
      type: Object,
      default: {},
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Notification: Model<any> =
  (models.Notification as Model<any>) ||
  mongoose.model("Notification", NotificationSchema);

export default Notification;
