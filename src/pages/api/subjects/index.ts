import Subject from "@/models/schemas/subjectSchema";
import connectDB from "@/utils/MongoDB/dbConnection";
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // ------ MIDDLEWARE ------ //
  // - Validacion de ruta protegida - //
  const token = getToken({ req });

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // -------------------- GET -------------------- //
  if (req.method == "GET") {
    try {
      // ------ MONGO SETUP ------ //
      await connectDB();

      // - QUERY PARAMS - //
      interface Query {
        search?: string;
        active?: "true" | "false";
        filter?: "name" | "key";
      }

      const { active, search, filter, period }: Query = req.query;

      interface Params {
        name?: RegExp;
        key?: RegExp;
        period?: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
        active?: "true" | "false";
      }

      const params: Params = {};

      // - FILTRO DE BUSQUEDA - //
      if (search && search.trim() != "") {
        if (filter === "name") {
          params["name"] = new RegExp(search.trim().toLowerCase(), "i");
        } else if (filter === "key") {
          params["key"] = new RegExp(search.trim().toUpperCase(), "i");
        }
      }

      // - FILTRO DE PERIODO - //
      if (
        period &&
        (period == "1" ||
          period == "2" ||
          period == "3" ||
          period == "4" ||
          period == "5" ||
          period == "6" ||
          period == "7" ||
          period == "8" ||
          period == "9")
      ) {
        params["period"] = parseInt(period);
      }

      // - FILTRO DE MATERIAS ACTIVAS - //
      if (active && (active == "true" || active == "false")) {
        params["active"] = active;
      }

      // --------- GET ALL --------- //
      const subjects = await Subject.find(params).sort({ createdAt: -1 });

      return res.status(200).json({ subjects });
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
      const {
        name,
        key,
        shortName,
        methodology,
        description,
        period,
        scheduledHours,
        credits,
        expertise,
        formula,
      } = req.body;

      // - Validacion de parametros - //
      //--VALIDACIONES DE NOMBRE--//
      if (!name || name.trim() == "") {
        return res.status(400).json({ message: "Error with the name" });
      }

      const nameValidation = await Subject.findOne({
        name: name.toLowerCase(),
      });

      if (nameValidation) {
        return res.status(400).json({
          message: "Ya existe una materia registrada con el mismo nombre",
        });
      }

      //--VALIDACIONES DE CLAVE--//
      if (!key || key.trim() == "") {
        return res.status(401).json({ message: "Error with the key" });
      }

      const keyValidation = await Subject.findOne({
        key: key.toUpperCase(),
      });

      if (keyValidation) {
        return res.status(401).json({
          message: "Ya existe una materia registrada con la misma clave",
        });
      }

      //--DB PARAMS--//
      interface Params {
        name: string;
        key: string;
        shortName: string;
        methodology?: string;
        description?: string;
        period: number;
        scheduledHours: string;
        credits?: string;
        expertise?: string;
        formula?: string;
      }

      const subjectQuery: Params = {
        name: name.toLowerCase(),
        key: key.toUpperCase(),
        shortName,
        methodology,
        description,
        period,
        scheduledHours,
        credits,
        expertise,
        formula,
      };

      // --------- AGREGAR A DB --------- //
      const subject = new Subject(subjectQuery);

      await subject.save();

      return res.status(200).json({ message: "¡Materia agregada!" });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  // -------------------- PUT -------------------- //
  if (req.method === "PUT") {
    try {
      // ------ MONGO SETUP ------ //
      await connectDB();

      // - BODY PARAMS - //
      const {
        subject_id,
        name,
        key,
        shortName,
        methodology,
        description,
        period,
        scheduledHours,
        credits,
        expertise,
        formula,
        active,
      } = req.body;

      // - Validacion de parametros - //
      if (!subject_id) {
        return res.status(400).json({ message: "Error with the subject_id" });
      }

      // - DB PARAMS - //
      interface Params {
        name?: string;
        key?: string;
        shortName?: string;
        methodology?: string;
        description?: string;
        period?: number | null;
        scheduledHours?: number | null;
        credits?: number | null;
        expertise?: string;
        formula?: string;
        active?: boolean;
      }

      const params: Params = {};

      // - Name Update - //
      if (name && name.trim() !== "") {
        params["name"] = name.trim().toLowerCase();
      }

      // - Key Update - //
      if (key && key.trim() !== "") {
        params["key"] = key.trim().toUpperCase();
      }

      // - ShortName Update - //
      if (shortName && shortName.trim() !== "") {
        params["shortName"] = shortName.trim();
      }

      // - Methodology Update - //
      if (methodology && methodology.trim() !== "") {
        params["methodology"] = methodology.trim();
      }

      // - Description Update - //
      if (description && description.trim() !== "") {
        params["description"] = description.trim();
      }

      // - Period Update - //
      if (period !== undefined) {
        params["period"] = period;
      }

      // - ScheduledHours Update - //
      if (scheduledHours !== undefined) {
        params["scheduledHours"] = scheduledHours;
      }

      // - Credits Update - //
      if (credits !== undefined) {
        params["credits"] = credits;
      }

      // - Expertise Update - //
      if (expertise && expertise.trim() !== "") {
        params["expertise"] = expertise.trim();
      }

      // - Formula Update - //
      if (formula && formula.trim() !== "") {
        params["formula"] = formula.trim();
      }

      // - Active Update - //
      if (active !== undefined) {
        params["active"] = active.toString() === "true";
      }

      // - Update Subject - //
      const updatedSubject = await Subject.findByIdAndUpdate(
        subject_id,
        params,
        { new: true }
      );

      if (!updatedSubject) {
        return res.status(404).json({ message: "Subject not found" });
      }

      return res
        .status(200)
        .json({ message: "¡Materia actualizada!", subject: updatedSubject });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // -------------------- DELETE -------------------- //
  if (req.method == "DELETE") {
    try {
      // ------ MONGO SETUP ------ //
      await connectDB();

      // - BODY PARAMS - //
      const { subject_id } = req.body;

      // - Validacion de parametros - //
      if (!subject_id) {
        return res.status(400).json({ message: "Error with the subject_id" });
      }

      // - ARCHIVAR MATERIA - //
      await Subject.findByIdAndUpdate(subject_id, { active: false });

      return res.status(200).json({ message: "¡Materia archivada!" });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}
