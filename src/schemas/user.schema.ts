import mongoose, { Schema } from "mongoose";
import { validateEmail } from "../utils/validation";

interface UserType {
  userId: string;
  avatar: string;
  about: string;
  email: string;
  passwordHash: string;
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
  }
});

const userModel = mongoose.model<UserType>("user", userSchema);

export { UserType, userSchema, userModel };
