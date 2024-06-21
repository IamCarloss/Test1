import AdminPay from "@/models/schemas/PaySchema";
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

      const { clasificacion } = req.query;

      interface Match {
        clasificacion?: string | string[];
      }

      const match: Match = {};

      if (clasificacion) {
        match["clasificacion"] = clasificacion;
      }

      const pay = await AdminPay.find(match);

      return res.status(200).json({ pay: pay });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  // -------------------- POST -------------------- //
  if (req.method == "POST") {
    try {
      // ------ MONGO SETUP ------ //
      await connectDB();

      const { datos, clasificacion } = req.body;

      const pay = {
        clasificacion: clasificacion,
        primaria: datos.primaria,
        secundaria: datos.secundaria,
        bachillerato: datos.bachillerato,
        universidad: datos.universidad,
        posgrado: datos.posgrado,
        nocturna: datos.nocturna,
        virtual: datos.virtual,
        taller: datos.taller,
      };

      const newPay = new AdminPay(pay);

      await newPay.save();

      return res.status(200).json({ message: "Pago creado exitosamente" });
    } catch (error) {
      console.log("Error al enviar la solicitud:", error);
      return res.status(500).json({ message: error });
    }
  }

  // -------------------- PUT -------------------- //
  if (req.method == "PUT") {
    try {
      // ------ MONGO SETUP ------ //
      await connectDB();
      const { _id, datos, active } = req.body;
      const updatedPay = await AdminPay.findByIdAndUpdate(_id, datos, {
        new: true,
      });
      return res.status(200).json({ success: true, data: updatedPay });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}
