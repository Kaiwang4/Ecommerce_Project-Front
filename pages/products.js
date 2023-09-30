import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductsGrid from "@/components/ProductsGrid";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import styled from "styled-components";
import Title from "@/components/Title";

export default function ProducesPage({products}) {
    return (
        <>
            <Header />
            <Center>
                <Title>All products</Title>
                <ProductsGrid products={products} />
            </Center>
        </>
    )
}

export async function getServerSideProps() {
    await mongooseConnect()
    const products = await Product.find({}, null, {sort: {'_id': -1}})
    // console.log({products});
    return {
        props: {
            products: JSON.parse(JSON.stringify(products)),
        }
    }
}