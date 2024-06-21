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

  // -------------------- GET -------------------- //
  if (req.method == "GET") {
    try {
      // ------ MONGO SETUP ------ //
      await connectDB();

      // - QUERY PARAMS - //
      const { careerId, active, populate_subjects } = req.query;

      // - MATCH PARAMS - //
      interface Match {
        career?: string | string[];
        active?: boolean;
      }

      const match: Match = {};

      // - FILTRAR POR CARRERA - //
      if (careerId) {
        match["career"] = careerId;
      }

      // - FILTRAR POR ESTADO - //
      if (active && active != "null") {
        match["active"] = active == "true";
      }

      // - OBTENER PLANES DE ESTUDIO - //
      const studyPlans = await StudyPlan.find(match)
        .populate(populate_subjects == "true" ? "subjects" : "")
        .sort({ name: 1 });

      return res.status(200).json({ studyPlans });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  // -------------------- POST -------------------- //
  if (req.method == "POST") {
    try {
      // ------ MONGO SETUP ------ //
      await connectDB();

      // - BODY PARAMS - //
      const { careerId, name, code, period } = req.body;

      // - VALIDACION DE PARAMETROS - //
      if (!careerId || !name || !code) {
        return res.status(400).json({ message: "Faltan parametros" });
      }

      // - VALIDACION DE NOMBRE - //
      const nameExists = await StudyPlan.findOne({
        name: name.trim().toLowerCase(),
      });

      if (nameExists) {
        return res
          .status(400)
          .json({ message: "El nombre que ingresaste ya esta en uso" });
      }

      // - VALIDACION DE CODIGO - //
      const codeExists = await StudyPlan.findOne({
        code: code.trim().toUpperCase(),
      });

      if (codeExists) {
        return res
          .status(400)
          .json({ message: "El codigo que ingresaste ya esta en uso" });
      }

      // - VALIDACION DE PERIODO - //
      if (!period) {
        return res.status(400).json({ message: "Falta el periodo" });
      }

      // - CREACION DE PLAN DE ESTUDIO - //
      const stydyPlan = new StudyPlan({
        career: careerId,
        name: name.trim().toLowerCase(),
        code: code.trim().toUpperCase(),
        periodDenomination: period,
      });

      await stydyPlan.save();

      return res.status(200).json({ message: "Plan de estudio creado" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error });
    }
  }
}
