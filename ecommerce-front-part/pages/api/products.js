import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handle(req, res) {
    await mongooseConnect()
    const {categories, sort, ...filters} = req.query
    const [sortField, sortOrder] = sort.split('-')
    const productsQuery = {
        // category: categories.split(','),
        category: { $in: categories.split(',') },
    }
    if (Object.keys(filters).length > 0) {
        Object.keys(filters).forEach(key => {
            productsQuery[`properties.${key}`] = filters[key];
        });
    }
    console.log('Constructed Query:', productsQuery);  // Debug: Print constructed query
    const foundProducts = await Product.find(productsQuery, null, {sort:{[sortField]: sortOrder==='asc' ? 1 : -1}});
    console.log('Found Products:', foundProducts);  // Debug: Print found products
    res.json(foundProducts)
}