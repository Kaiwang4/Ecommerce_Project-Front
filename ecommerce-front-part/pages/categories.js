import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductBox from "@/components/ProductBox";
import Title from "@/components/Title";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import Link from "next/link";
import styled from "styled-components";

const CategoryGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    @media screen and (min-width: 768px) {
        grid-template-columns: 1fr 1fr 1fr 1fr;   
    }
`
const CategoryTitle = styled.div`
    display: flex;
    margin-top: 10px;
    magin-bottom: 0;
    align-items: center;
    gap: 15px;
    h2{
        margin-bottom: 10px;
        margin-top: 10px;
    }
    a{
        color: #555;
    }
`
const CategoryWrapper = styled.div`
    margin-bottom: 40px;
`
const ShowAllSquare = styled(Link)`
    display: flex;
    background-color: #ddd;
    height: 160px;
    border-radius: 10px;
    align-items: center;
    justify-content: center;
    color: #555;
    text-decoration: none;
`
export default function CategoriesPage({mainCategories, categoriesProducts}) {
    return (
        <>
            <Header />
            <Center>
                {mainCategories.map(category => (
                    <CategoryWrapper key={category._id}>
                        <CategoryTitle>
                            <h2>{category.name}</h2>
                            <div>
                                <Link href={'/category/'+category._id}>Show all {category.name}</Link>
                            </div>
                        </CategoryTitle>
                        <CategoryGrid>
                            {categoriesProducts[category._id].map(product => (
                                <ProductBox key={product._id} {...product} />
                            ))}
                            <ShowAllSquare href={'/category/'+category._id}>
                                Show all &rarr;
                            </ShowAllSquare>
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