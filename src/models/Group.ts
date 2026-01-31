// import mongoose, { Schema, models, Model } from "mongoose";
// import { IGroup } from "@/types/models";

// const GroupSchema = new Schema<IGroup>(
//   {
//     name: { type: String, required: true },
//     description: { type: String },

//     createdBy: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     // MEMBERS ARRAY
//     members: [
//       {
//         user: {
//           type: Schema.Types.ObjectId,
//           ref: "User",
//           required: true,
//         },
//         joinedAt: {
//           type: Date,
//           default: Date.now,
//         },
//       },
//     ],

//     // PHOTOS
//     photos: [{ type: String }],

//     // COVER PHOTO
//     coverPhoto: {
//       type: String,
//       default: "/default-cover.png",
//     },

//     // PUBLIC GROUP?
//     isPublic: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { timestamps: true }
// );

// const Group: Model<IGroup> =
//   (models.Group as Model<IGroup>) ||
//   mongoose.model<IGroup>("Group", GroupSchema);

// export default Group;




/*

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

    // ✅ NEW — GROUP BELONGS TO EVENT
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    // MEMBERS
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
*/
import mongoose, { Schema, models, Model } from "mongoose";
import { IUser, IGroup } from "@/types/models";
import User from "./User"; // ✅ ensures schema is registered

const GroupSchema = new Schema<IGroup>({
  name: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  members: [
    { user: { type: Schema.Types.ObjectId, ref: "User", required: true }, joinedAt: { type: Date, default: Date.now } }
  ],
  photos: [String],
  event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
}, { timestamps: true });

const Group: Model<IGroup> = models.Group || mongoose.model<IGroup>("Group", GroupSchema);
export default Group;
