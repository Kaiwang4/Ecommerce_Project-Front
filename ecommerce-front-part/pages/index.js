import Featured from "@/components/Featured";
import Header from "@/components/Header";
import NewProucts from "@/components/NewProducts";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default function HomePage({featuredProduct, newProducts}) {
  // console.log({newProducts});
  return (
    <dev>
      <Header />
      <Featured product={featuredProduct}/>
      <NewProucts products={newProducts} />
    </dev>
  )
}

export async function getServerSideProps() {
  const fearuredProductId = '6511301456d45fa38d275e6a'
  await mongooseConnect()
  const featuredProduct = await Product.findById(fearuredProductId)
  const newProducts = await Product.find({}, null, {sort: {'_id': -1}, limit: 10})
  return {
    props: {
      featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
      newProducts: JSON.parse(JSON.stringify(newProducts)),
    },
  }
}