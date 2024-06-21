import { model, models, Schema } from "mongoose";

const careerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    careerCode: {
      type: String,
      required: true,
      unique: true,
    },
    academicLevel: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Career = models.Career || model("Career", careerSchema);

export default Career;
