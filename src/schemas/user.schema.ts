import mongoose, { Schema } from "mongoose";
import type { Document } from "mongoose";
import { validateEmail } from "../utils/validation";

interface FriendType {
  userId: string;
  status?: "friend" | "pendingInbound" | "pendingOutbound";
}

interface TokenType {
  token: string;
  ip: string;
  userId: string;
  lastUsed?: Date;
  createdAt?: Date;
  meta?: {
    device?: "desktop" | "mobile";
    os?: "windows" | "mac" | "linux" | "android" | "ios" | "other";
    location?: string | "unknown";
  };
}

interface UserType extends Document {
  userId: string;
  avatar?: string;
  about?: string;
  email: string;
  passwordHash: string;
  opt?: {
    status?: "disabled" | "pending" | "enabled";
    secret?: string;
    enabledAt?: Date;
  };
  friends: FriendType[];
}

const userSchema = new Schema<UserType>({
  userId: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minLength: 3,
    maxLength: 32
  },
  avatar: {
    type: String,
    required: true,
    trim: true,
    default: "default_avatar.png"
  },
  about: {
    type: String,
    trim: true,
    maxlength: 512,
    default: ""
  },
  email: {
    type: String,
    required: true,
    trim: true,
    validate: [validateEmail, "Invalid email"]
  },
  passwordHash: {
    type: String,
    required: true
  },
  friends: [
    {
      userId: {
        type: String,
        required: true
      },
      status: {
        type: String,
        required: true,
        enum: ["friend", "pendingInbound", "pendingOutbound"],
        default: "friend"
      }
    }
  ],
  opt: {
    status: {
      type: String,
      required: true,
      enum: ["disabled", "pending", "enabled"],
      default: "disabled"
    },
    secret: {
      type: String,
      required: true,
      default: ""
    },
    enabledAt: {
      type: Date,
      required: false,
      default: null
    }
  }
});

const userModel = mongoose.model<UserType>("user", userSchema);

export { userSchema, userModel };
export type { UserType, FriendType, TokenType };
