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

      // - Manejar aqui la logica del metodo GET - //

      return res.status(200).json({});
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  // -------------------- POST -------------------- //
  if (req.method == "POST") {
    try {
      // ------ MONGO SETUP ------ //
      await connectDB();

      // - Manejar aqui la logica del metodo POST - //

      return res.status(200).json({});
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  // -------------------- PUT -------------------- //
  if (req.method == "PUT") {
    try {
      // ------ MONGO SETUP ------ //
      await connectDB();

      // - Manejar aqui la logica del metodo PUT - //

      return res.status(200).json({});
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  // -------------------- DELETE -------------------- //
  if (req.method == "DELETE") {
    try {
      // ------ MONGO SETUP ------ //
      await connectDB();

      // - Manejar aqui la logica del metodo DELETE - //

      return res.status(200).json({});
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}
