import { model, models, Schema } from "mongoose";

const professorSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    rfc: { type: String, unique: true },
    classification: { type: String, required: true },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Professor = models.Professor || model("Professor", professorSchema);

export default Professor;
