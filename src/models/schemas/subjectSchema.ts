import { model, models, Schema } from "mongoose";

const subjectSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    key: { type: String, required: true, unique: true },
    shortName: String,
    methodology: String,
    description: String,
    period: { type: Number, required: true },
    scheduledHours: { type: Number, required: true },
    credits: Number,
    expertise: String,
    formula: String,
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Subject = models.Subject || model("Subject", subjectSchema);

export default Subject;
