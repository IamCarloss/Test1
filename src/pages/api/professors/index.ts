import Professor from "@/models/schemas/professorSchema";
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
      interface Query {
        classification?: "all" | "a" | "b" | "c" | "d" | "i";
        search?: string;
        active?: "true" | "false";
      }

      const { classification, search, active }: Query = req.query;

      interface Params {
        name?: RegExp;
        classification?: "all" | "a" | "b" | "c" | "d" | "i";
        active?: "true" | "false";
      }

      const params: Params = {};

      // - FILTRO DE CLASIFICACION - //
      if (
        classification == "a" ||
        classification == "b" ||
        classification == "c" ||
        classification == "d" ||
        classification == "i"
      ) {
        params["classification"] = classification;
      }

      // - FILTRO DE BUSQUEDA - //
      if (search && search.trim() != "") {
        params["name"] = new RegExp(search.trim().toLowerCase(), "i");
      }

      // - FILTRO DE MAESTROS ACTIVOS - //
      if (active && (active == "true" || active == "false")) {
        params["active"] = active;
      }

      // --------- GET ALL --------- //
      const professors = await Professor.find(params).sort({ createdAt: -1 });

      return res.status(200).json({ professors: professors });
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
      const { name, rfc, classification } = req.body;

      // --- Validacion de parametros --- //
      // - VALIDACIONES DE NOMBRE - //
      if (!name || name.trim() == "" || name.length > 50) {
        return res.status(400).json({ message: "Error with the name" });
      }

      const nameValidation = await Professor.findOne({
        name: name.toLowerCase(),
      });

      if (nameValidation) {
        return res.status(400).json({
          message: "Ya existe un profesor registrado con el mismo nombre.",
        });
      }

      // - VALIDACIONES DE CLASIFICACION - //
      if (
        classification != "a" &&
        classification != "b" &&
        classification != "c" &&
        classification != "d" &&
        classification != "i"
      ) {
        return res
          .status(400)
          .json({ message: "Error with the classification" });
      }

      // - DB PARAMS - //
      interface Params {
        name: string;
        rfc?: string;
        classification: "a" | "b" | "c" | "d" | "i";
      }

      const profesorQuery: Params = {
        name: name.trim().toLowerCase(),
        classification: classification,
      };

      // - VALIDACION DE RFC - //
      if (rfc && rfc.trim() != "" && rfc.length <= 13) {
        profesorQuery["rfc"] = rfc.trim().toUpperCase();
      }

      // --------- AGREGAR A DB --------- //
      const professor = new Professor(profesorQuery);

      await professor.save();

      return res.status(200).json({ message: "¡Maestro agregado!" });
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
      const { professor_id, name, rfc, classification, active } = req.body;

      // - Validacion de parametros - //
      if (!professor_id) {
        return res.status(400).json({ message: "Error with the teacher_id" });
      }

      // - DB PARAMS - //
      interface Params {
        name?: string;
        rfc?: string;
        classification?: "a" | "b" | "c" | "d" | "i";
        active?: "true" | "false";
      }

      const params: Params = {};

      // - Name Update - //
      if (name && name.trim() != "") {
        params["name"] = name.trim().toLowerCase();
      }

      // - RFC Update - //
      params["rfc"] = rfc ? rfc.trim().toUpperCase() : "";

      // - Classification Update - //
      if (
        classification &&
        (classification == "a" ||
          classification == "b" ||
          classification == "c" ||
          classification == "d" ||
          classification == "i")
      ) {
        params["classification"] = classification;
      }

      // - Active Update - //
      if (
        active &&
        (active == "true" ||
          active == "false" ||
          active == true ||
          active == false)
      ) {
        params["active"] = active;
      }

      // - CAMBIAR EL NOMBRE DEL MAESTRO - //
      await Professor.findByIdAndUpdate(professor_id, params);

      return res.status(200).json({ message: "¡Maestro editado!" });
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

      // - BODY PARAMS - //
      const { teacher_id } = req.body;

      // - Validacion de parametros - //
      if (!teacher_id) {
        return res.status(400).json({ message: "Error with the teacher_id" });
      }

      // - ARCHIVAR MAESTRO - //
      await Professor.findByIdAndUpdate(teacher_id, { active: false });

      return res.status(200).json({ message: "¡Maestro archivado!" });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}
