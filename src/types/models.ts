import { Types } from "mongoose";

// ------------------ USER ------------------
// export interface IUser {
//   _id: Types.ObjectId;
//   name?: string;
//   phone: string;
//   email?: string;
//   role?: "viewer" | "photographer" | "superadmin";
//   avatar?: string;
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// ------------------ USER ------------------
export interface IUser {
  _id: Types.ObjectId;
  name?: string;
  phone: string;
  email?: string;
  companyName?: string;  // ✅ Added this line
  role?: "viewer" | "photographer" | "superadmin";
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}


// ------------------ GROUP MEMBER ------------------
export interface IGroupMember {
  user: Types.ObjectId;
  joinedAt: Date;
}

// ------------------ GROUP ------------------
export interface IGroup {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  createdBy: Types.ObjectId;
  members: IGroupMember[];
  photos: string[];
  coverPhoto?: string;
  isPublic: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// ------------------ JOIN REQUEST ------------------
export interface IJoinRequest {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  group: Types.ObjectId;
  message?: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: Date;
  updatedAt?: Date;
}
