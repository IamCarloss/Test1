import StudyPlan from "@/models/schemas/studyPlanSchema";
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

  // ------ ID DEL ENDPOINT ------ //
  const { id } = req.query;

  // -------------------- GET -------------------- //
  if (req.method == "GET") {
    try {
      // ------ MONGO SETUP ------ //
      await connectDB();

      const { populate_subjects } = req.query;

      // - OBTENER PLAN DE ESTUDIO - //
      const studyPlan = await StudyPlan.findById(id).populate(
        populate_subjects == "true" ? "subjects" : ""
      );

      console.log(studyPlan);

      return res.status(200).json({
        studyPlan,
      });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  // -------------------- PUT -------------------- //
  if (req.method == "PUT") {
    try {
      // ------ MONGO SETUP ------ //
      await connectDB();

      // - BODY PARAMS - //
      const { name, code, period, subjects, active } = req.body;

      // - UPDATE PARAMS - //
      interface Update {
        name?: string;
        code?: string;
        periodDenomination?: "semester" | "anual" | "trimester";
        subjects?: string[];
        active?: boolean;
      }

      const update: Update = {};

      // - ACTUALIZACION DE NOMBRE - //
      if (name) {
        // - VALIDACION DE NOMBRE - //
        const nameValidation = await StudyPlan.findOne({
          _id: { $ne: id },
          name: name.trim().toLowerCase(),
        });

        if (nameValidation) {
          return res
            .status(400)
            .json({ message: "Este nombre ya esta en uso!" });
        }

        update["name"] = name.trim().toLowerCase();
      }

      // - ACTUALIZACION DE CODIGO - //
      if (code) {
        // - VALIDACION DE CODIGO - //
        const codeValidation = await StudyPlan.findOne({
          _id: { $ne: id },
          code: code.trim().toUpperCase(),
        });

        if (codeValidation) {
          return res
            .status(400)
            .json({ message: "Este codigo ya esta en uso!" });
        }

        update["code"] = code.trim().toUpperCase();
      }

      // - ACTUALIZACION DE PERIODO - //
      if (period) {
        update["periodDenomination"] = period;
      }

      // - ACTUALIZACION DE ESTADO - //
      if (active) {
        update["active"] = active;
      }

      // ------ ACTUALIZACION DE MATERIAS ------ //
      if (subjects) {
        update["subjects"] = subjects;
      }

      // - ACTUALIZAR PLAN DE ESTUDIO - //
      await StudyPlan.updateOne({ _id: id }, update);

      return res.status(200).json({ message: "Plan de estudio actualizado!" });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  // -------------------- DELETE -------------------- //
  if (req.method == "DELETE") {
    try {
      // ------ MONGO SETUP ------ //
      await connectDB();

      // - ARCHIVAR PLAN DE ESTUDIO - //
      await StudyPlan.updateOne({ _id: id }, { active: false });

      return res.status(200).json({});
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}
