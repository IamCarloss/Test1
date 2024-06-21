import connectDB from "@/utils/MongoDB/dbConnection";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // ------ MONGO SETUP ------ //
    await connectDB();

    // --------- HASHING --------- //
    // const hashing = bcrypt.hash("contraseña123!", 10, async (err, hash) => {
    //   if (err) throw err;

    //   // --------- USER CREATION --------- //
    //   const user = new User({
    //     username: "nominas@ual.com.mx",
    //     passwordHash: hash,
    //   });

    //   try {
    //     await user.save();
    //   } catch (error: any) {
    //     console.log(error);
    //   }
    // });

    // await Promise.all([hashing]);

    return res.status(200).json({ message: "System initialized" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
}
