import { model, models, Schema } from "mongoose";

const AdminPaySchema = new Schema(
  {
    clasificacion: { type: String, required: true},
    primaria: { type: Number, required: true },
    secundaria: { type: Number, required: true },
    bachillerato: { type: Number, required: true },
    universidad: { type: Number, required: true },
    posgrado: { type: Number, required: true },
    nocturna: { type: Number, required: true },
    virtual: { type: Number, required: true },
    taller: { type: Number, required: true }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const AdminPay = models.AdminPay || model("AdminPay", AdminPaySchema);

export default AdminPay;
