import { model, models, Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User = models.User || model("User", userSchema);

export default User;
