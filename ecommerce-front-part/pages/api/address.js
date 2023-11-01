import { mongooseConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { Address } from "@/models/Address";

export default async function handle(req, res) {
    try {
        await mongooseConnect();
        const { user } = await getServerSession(req, res, authOptions);
        if (req.method === 'PUT') {
      
            if (!user || !user.email) {
              throw new Error("User session not found or email is missing.");
            }
          
            const address = await Address.findOne({ userEmail: user.email });
            if (address) {
              res.json(await Address.findByIdAndUpdate(address._id, req.body));
            } else {
              res.json(await Address.create({ userEmail: user.email, ...req.body }));
            }
        }
        if (req.method === 'GET') {
            const address = await Address.findOne({ userEmail: user.email });
            res.json(address)
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }      
}