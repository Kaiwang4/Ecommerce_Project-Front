import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductBox from "@/components/ProductBox";
import Title from "@/components/Title";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import styled from "styled-components";

const CategoryGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    @media screen and (min-width: 768px) {
        grid-template-columns: 1fr 1fr 1fr 1fr;   
    }
`
const CategoryTitle = styled.h2`
    margin-top: 40px;
    magin-bottom: 10px;
`
const CategoryWrapper = styled.div`
    margin-bottom: 40px;
`
export default function CategoriesPage({mainCategories, categoriesProducts}) {
    return (
        <>
            <Header />
            <Center>
                {mainCategories.map(category => (
                    <CategoryWrapper key={category._id}>
                        <CategoryTitle>{category.name}</CategoryTitle>
                        <CategoryGrid>
                            {categoriesProducts[category._id].map(product => (
                                <ProductBox {...product} />
                            ))}
                        </CategoryGrid>
                    </CategoryWrapper>
                ))}
            </Center>
        </>
    )
}

export async function getServerSideProps() {
    const categories = await Category.find()
    const mainCategories = categories.filter(category => !category.parent)
    const categoriesProducts = {}
    for (const category of mainCategories) {
        const mainCatId = category._id.toString()
        const childCatIds = categories
        .filter(c => c?.parent?.toString() === mainCatId)
        .map(c => c._id.toString())
        const categoriesIds = [mainCatId, ...childCatIds]
        const products = await Product.find({category: categoriesIds}, null, {limit: 3, sort: {'_id': -1}})
        categoriesProducts[category._id] = products
    }
    return {
        props: {
            mainCategories: JSON.parse(JSON.stringify(mainCategories)),
            categoriesProducts: JSON.parse(JSON.stringify(categoriesProducts))
        }
    }
}