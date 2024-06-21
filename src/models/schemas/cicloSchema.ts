import { model, models, Schema } from "mongoose";

const CicloSchema = new Schema(
  {
    periodo: { type: Number, required: true},
    descripcion: { type: String, required: true, unique: true },
    denomPeriodo: { type: String, required: true },
    codigoCorto: { type: String, required: true,unique: true },
    fechaIni: { type: Date, required: true },
    fechaTer: { type: Date, required: true },
    
    
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Ciclos = models.Ciclos || model("Ciclos", CicloSchema);

export default Ciclos;
