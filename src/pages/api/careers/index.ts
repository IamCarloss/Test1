import Career from "@/models/schemas/careerSchema";
import connectDB from "@/utils/MongoDB/dbConnection";
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // ------ MIDDLEWARE ------ //
  // - Validacion de ruta protegida - //
  const token = await getToken({ req });

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // -------------------- GET -------------------- //
  if (req.method == "GET") {
    try {
      // ------ MONGO SETUP ------ //
      await connectDB();

      // ----- QUERY PARAMS ----- //
      const { active, academicLevel, filter, search } = req.query;

      // - INTERFACES - //
      interface IMatch {
        active?: boolean;
        academicLevel?:
          | "all"
          | "primaria"
          | "secundaria"
          | "bachillerato"
          | "universidad"
          | "posgrado"
          | "nocturna"
          | "virtual"
          | "taller";
        name?: RegExp;
        careerCode?: RegExp;
      }

      // - FIND QUERY - //
      const match: IMatch = {};

      // - BUSCAR POR STATUS DE CARRERA - //
      if (active != undefined) {
        match["active"] = active == "true" ? true : false;
      }

      // - BUSCAR POR NIVEL ACADEMICO - //
      if (
        academicLevel &&
        (academicLevel == "primaria" ||
          academicLevel == "secundaria" ||
          academicLevel == "bachillerato" ||
          academicLevel == "universidad" ||
          academicLevel == "posgrado" ||
          academicLevel == "nocturna" ||
          academicLevel == "virtual" ||
          academicLevel == "taller")
      ) {
        match["academicLevel"] = academicLevel;
      }

      // - BUSCAR POR FILTRO - //
      if (search) {
        const regex = new RegExp(search.toString(), "i");

        if (filter == "careerCode") {
          // - BUSCAR POR CODIGO DE CARRERA - //
          match["careerCode"] = regex;
        } else {
          // - BUSCAR POR NOMBRE DE CARRERA - //
          match["name"] = regex;
        }
      }

      // - OBTENER CARRERAS - //
      const careers = await Career.find(match).sort({ name: 1 });

      return res.status(200).json({ message: "Succes", careers });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  // -------------------- POST -------------------- //
  if (req.method == "POST") {
    try {
      // ------ MONGO SETUP ------ //
      await connectDB();

      // ----- BODY PARAMS ----- //
      const { name, careerCode, academicLevel } = req.body;

      // - VALIDACIONES - //
      if (!name || !careerCode || !academicLevel) {
        return res
          .status(400)
          .json({ message: "Todos los campos son requeridos." });
      }

      // - VALIDAR NOMBRE DE CARRERA - //
      const nameValidation = await Career.findOne({
        name: name.toLowerCase(),
        academicLevel,
      });

      if (nameValidation) {
        return res.status(400).json({
          message:
            "El nombre de la carrera ya existe para el nivel academico seleccionado.",
        });
      }

      // - VALIDAR CODIGO DE CARRERA - //
      const codeValidation = await Career.findOne({ careerCode });

      if (codeValidation) {
        return res
          .status(400)
          .json({ message: "El codigo de la carrera ya existe." });
      }

      // - GUARDAR EN BD - //
      const newCareer = await Career.create({
        name: name.toLowerCase(),
        careerCode,
        academicLevel,
      });

      await newCareer.save();

      return res.status(200).json({});
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error });
    }
  }

  // -------------------- PUT -------------------- //
  if (req.method == "PUT") {
    try {
      // ------ MONGO SETUP ------ //
      await connectDB();

      const { _id, name, careerCode, academicLevel, active } = req.body;

      // - VALIDACIONES - //
      if (!_id) {
        return res.status(400).json({ message: "ID de la carrera requerido." });
      }

      interface IUpdate {
        name?: string;
        careerCode?: string;
        academicLevel?:
          | "primaria"
          | "secundaria"
          | "bachillerato"
          | "universidad"
          | "posgrado"
          | "nocturna"
          | "virtual"
          | "taller";
        active?: boolean;
      }

      const update: IUpdate = {};

      // - VALIDAR NOMBRE DE CARRERA - //
      if (name) {
        const nameValidation = await Career.findOne({
          _id: { $ne: _id },
          name: name.trim().toLowerCase(),
          academicLevel,
        });

        if (nameValidation) {
          return res.status(400).json({
            message:
              "El nombre de la carrera ya existe para el nivel academico seleccionado.",
          });
        }

        update["name"] = name.trim().toLowerCase();
      }

      // - VALIDAR CODIGO DE CARRERA - //
      if (careerCode) {
        const codeValidation = await Career.findOne({
          _id: { $ne: _id },
          careerCode,
        });

        if (codeValidation) {
          return res
            .status(400)
            .json({ message: "El codigo de la carrera ya existe." });
        }

        update["careerCode"] = careerCode;
      }

      // - VALIDAR NIVEL ACADEMICO - //
      if (
        academicLevel &&
        (academicLevel == "primaria" ||
          academicLevel == "secundaria" ||
          academicLevel == "bachillerato" ||
          academicLevel == "universidad" ||
          academicLevel == "posgrado" ||
          academicLevel == "nocturna" ||
          academicLevel == "virtual" ||
          academicLevel == "taller")
      ) {
        update["academicLevel"] = academicLevel;
      }

      // - VALIDAR ESTADO DE LA CARRERA - //
      if (active != undefined && typeof active == "boolean") {
        update["active"] = active;
      }

      // - ACTUALIZAR EN BD - //
      await Career.findByIdAndUpdate(_id, update);

      return res.status(200).json({ message: "Carrera actualizada." });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error });
    }
  }

  // -------------------- DELETE -------------------- //
  if (req.method == "DELETE") {
    try {
      // ------ MONGO SETUP ------ //
      await connectDB();

      // ----- BODY PARAMS ----- //
      const { _id } = req.body;

      // - DELETE CAREER - //
      await Career.updateOne({ _id }, { active: false });

      return res.status(200).json({ message: "Carrera archivada." });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}
