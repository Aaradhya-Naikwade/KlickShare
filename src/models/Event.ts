import mongoose, { Schema, models, Model } from "mongoose";
import { IEvent } from "@/types/models";

const EventSchema = new Schema<IEvent>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Event: Model<IEvent> =
  models.Event || mongoose.model<IEvent>("Event", EventSchema);

export default Event;
