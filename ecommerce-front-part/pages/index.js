import Featured from "@/components/Featured";
import Header from "@/components/Header";
import NewProucts from "@/components/NewProducts";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { WishedProduct } from "@/models/WishedProduct";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { Setting } from "@/models/Setting";

export default function HomePage({featuredProduct, newProducts, wishedNewProducts}) {
  // console.log({newProducts});
  return (
    <div>
      <Header />
      <Featured product={featuredProduct}/>
      <NewProucts products={newProducts} wishedProducts={wishedNewProducts} />
    </div>
  )
}

export async function getServerSideProps(ctx) {
  await mongooseConnect()
  const featuredProductSetting = await Setting.findOne({name: 'featuredProductId'})
  // const featuredProductSetting = await Setting.where({name:'featuredProductId'}).findOne()

  const featuredProductId = featuredProductSetting.value
  
  const featuredProduct = await Product.findById(featuredProductId)
  const newProducts = await Product.find({}, null, {sort: {'_id': -1}, limit: 10})
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  const wishedNewProducts = session?.user
    ? await WishedProduct.find({
      userEmail: session.user.email,
      product: newProducts.map(p => p._id.toString()),
    }) : []
  return {
    props: {
      featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
      newProducts: JSON.parse(JSON.stringify(newProducts)),
      wishedNewProducts: wishedNewProducts.map(item => item.product.toString()),
    },
  }
}