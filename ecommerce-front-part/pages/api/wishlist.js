import { mongooseConnect } from "@/lib/mongoose";
import { WishedProduct } from "@/models/WishedProduct";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handle(req, res) {
    await mongooseConnect()
    const session = await getServerSession(req, res, authOptions)
    if (req.method === 'POST') {
        const {product} = req.body
        const wishedDoc = session?.user 
        ? await WishedProduct.findOne({userEmail: session.user.email, product}) : []
        if (wishedDoc) {
            await WishedProduct.findOneAndDelete(wishedDoc._id)
            res.json('delete')
        } else {
            await WishedProduct.create({userEmail: session?.user.email, product})
            res.json('create')
        }
    }
    if (req.method === 'GET') {
        res.json(
            await WishedProduct.find({userEmail: session?.user.email}).populate('product')
        )
    }
}