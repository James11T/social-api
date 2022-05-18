import mongoose, { Schema } from "mongoose";
import { validateEmail } from "../validation/data";

interface FriendType {
  userId: string;
  status?: "friend" | "pendingInbound" | "pendingOutbound";
}

interface ResetToken {
  token: string;
  expires: Date;
}

interface UserType {
  userId: string;
  avatar?: string;
  about?: string;
  email: {
    value: string;
    verified?: boolean;
    token?: string;
  };
  passwordHash: string;
  otp?: {
    status?: "disabled" | "pending" | "enabled";
    secret?: string;
    enabledAt?: Date;
  };
  friends?: FriendType[];
  resetTokens?: ResetToken[];
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
    value: {
      type: String,
      required: true,
      trim: true,
      validate: [validateEmail, "Invalid email"]
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false
    },
    token: {
      type: String,
      required: false
    }
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
  otp: {
    status: {
      type: String,
      required: true,
      enum: ["disabled", "pending", "enabled"],
      default: "disabled"
    },
    secret: {
      type: String,
      required: false,
      default: ""
    },
    enabledAt: {
      type: Date,
      required: false,
      default: null
    }
  },
  resetTokens: [
    {
      token: {
        type: String,
        required: true
      },
      expires: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 1000 * 60 * 60)
      }
    }
  ]
});

const userModel = mongoose.model<UserType>("user", userSchema);

const isUserIDTaken = async (userId: string) => {
  return (await userModel.findOne({ userId })) !== null;
};

export { userSchema, userModel, isUserIDTaken };
export type { UserType, FriendType };
