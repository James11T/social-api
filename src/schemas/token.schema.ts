import mongoose, { Schema } from "mongoose";

interface TokenType {
  token: string;
  ip: string;
  user: mongoose.ObjectId;
  lastUsed?: Date;
  createdAt?: Date;
  meta?: {
    device?: "desktop" | "mobile";
    os?: "windows" | "mac" | "linux" | "android" | "ios" | "other";
    location?: string | "unknown";
  };
}

const tokenSchema = new Schema<TokenType>({
  createdAt: {
    type: Date,
    required: true,
    default: () => new Date()
  },
  token: {
    type: String,
    required: true
  },
  ip: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true
  },
  lastUsed: {
    type: Date,
    required: true,
    default: () => new Date()
  },
  meta: {
    device: {
      type: String,
      required: true,
      enum: ["desktop", "mobile"],
      default: "desktop"
    },
    os: {
      type: String,
      required: true,
      enum: ["windows", "mac", "linux", "android", "ios", "other"],
      default: "other"
    },
    location: {
      type: String,
      required: true,
      default: "unknown"
    }
  }
});

const tokenModel = mongoose.model<TokenType>("token", tokenSchema);

export { tokenSchema, tokenModel };
export type { TokenType };
