import { model, models, Schema } from "mongoose";
import Career from "./careerSchema";
import Subject from "./subjectSchema";

const studyPlanSchema = new Schema(
  {
    career: { type: Schema.Types.ObjectId, ref: Career, required: true },
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    periodDenomination: { type: String, required: true },
    subjects: [{ type: Schema.Types.ObjectId, ref: Subject }],
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const StudyPlan = models.StudyPlan || model("StudyPlan", studyPlanSchema);

export default StudyPlan;
