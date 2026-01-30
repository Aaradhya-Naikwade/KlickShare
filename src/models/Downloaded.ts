import mongoose, { Schema, models } from "mongoose";

const DownloadedSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    photo: { type: String, required: true },
    group: { type: Schema.Types.ObjectId, ref: "Group", required: true },
  },
  { timestamps: true }
);

export default models.Downloaded ||
  mongoose.model("Downloaded", DownloadedSchema);
