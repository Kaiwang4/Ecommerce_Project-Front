import Button from "@/components/Button"
import { CartContext } from "@/components/CartContext"
import Center from "@/components/Center"
import Header from "@/components/Header"
import Table from "@/components/Table"
import axios from "axios"
import { useContext, useEffect, useState } from "react"
import styled from "styled-components"
import Input from "@/components/Input"

const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    @media screen and (min-width: 768px) {
        grid-template-columns: 1.2fr 0.8fr;
    }
    gap: 40px;
    margin-top: 40px;
`

const Box = styled.div`
    background-color: #fff;
    border-radius: 10px;
    padding: 30px;
`
const ProductInfoCell = styled.td`
    padding: 10px 0;
`
const ProductImageBox = styled.div`
    width: 70px;
    height: 100px;
    padding: 2px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    img{
        max-width: 60px;
        max-height: 60px;
    }
    @media screen and (min-width: 768px) {
        width: 100px;
        height: 100px;
        padding: 10px;
        img{
            max-width: 80px;
            max-height: 80px;
        }
    } 
`
const QuantityLabel = styled.span`
    padding: 0 15px;
    display: block;
    @media screen and (min-width: 768px) {
        display: inline-block;
        padding: 0 10px;
    }
`
const CityHolder = styled.div`
    display: flex;
    gap: 5px;
`
export default function CartPage() {
    const {cartProducts, addProduct, removeProduct, clearCart} = useContext(CartContext)
    const [products, setProducts] = useState([])
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [city, setCity] = useState('')
    const [postalCode, setPostalCode] = useState('')
    const [streetAddress, setStreetAddress] = useState('')
    const [country, setCountry] = useState('')
    const [isSuccess, setIsSuccess] = useState(false)

    const apiBaseUrl = typeof window !== 'undefined' ? 'http://10.89.96.33:3001' : ''
    // const apiBaseUrl = `${window.location.protocol}//${window.location.hostname}:4000`
    
    useEffect(() => {
        if (cartProducts.length > 0) {
            axios.post(`${apiBaseUrl}/api/cart`, {ids: cartProducts}).then(response => {
                setProducts(response.data)
            })
        } else {
            setProducts([])
        }
    }, [cartProducts, apiBaseUrl]) 
    useEffect(() => {
        if (typeof window !== 'undefined' && window.location.href.includes('success')) {
            setIsSuccess(true)
            clearCart()
        }
    }, [])
    function moreOfThisProduct(id) {
        addProduct(id)
    }   
    function lessOfThisProduct(id) {
        removeProduct(id)
    }
    async function goToPayment() {
        const currentBaseUrl = typeof window !== 'undefined' ? window.location.origin : ''
        const successUrl = `${currentBaseUrl}/cart?success=1`
        const cancelUrl = `${currentBaseUrl}/cart?canceled=1`
        const response = await axios.post(`${apiBaseUrl}/api/checkout`, {
            name, email, city, postalCode, streetAddress, country, cartProducts, successUrl, cancelUrl})
        if (response.data.url) {
            window.location = response.data.url
        }
    }
    if (isSuccess) {
        return (
            <>
                <Header />
                <Center>
                    <ColumnsWrapper>
                        <Box>
                            <h1>Thanks for your order!</h1>
                            <p>We will emial you when your order will be sent.</p>
                        </Box>
                    </ColumnsWrapper> 
                </Center>
            </>
        )
    }
    let total = 0
    for (const productId of cartProducts) {
        const price = products.find(p => p._id === productId)?.price || 0
        total += price
    }
    return (
        <>
            <Header />
            <Center>
                <ColumnsWrapper>
                    <Box>
                        <h2>Cart</h2>
                        {!cartProducts?.length && (
                            <div>Your cart is empty</div>
                        )}    
                        {products?.length > 0 && (                   
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                    </tr> 
                                </thead>
                                <tbody>
                                    {products.map(product => (
                                        <tr>
                                            <ProductInfoCell>
                                                <ProductImageBox>
                                                    <img src={product.images[0]} alt=""/>
                                                </ProductImageBox>
                                                {product.title}
                                            </ProductInfoCell>
                                            <td>
                                                <Button onClick={() => lessOfThisProduct(product._id)}>-</Button>
                                                <QuantityLabel>
                                                    {cartProducts.filter(id => id == product._id).length}
                                                </QuantityLabel>                
                                                <Button onClick={() => moreOfThisProduct(product._id)}>+</Button>
                                            </td>
                                            <td>${cartProducts.filter(id => id == product._id).length * product.price}</td>
                                        </tr>
                                    ))}  
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>${total}</td>
                                    </tr>                                  
                                </tbody>
                            </Table>
                        )} 
                    </Box>
                    {!!cartProducts?.length && (
                        <Box>
                        <h2>Order information</h2>
                        <Input type="text" 
                            placeholder="Name" 
                            value={name} 
                            name="name"
                            onChange={e => setName(e.target.value)} />
                        <Input type="text" 
                            placeholder="Email" 
                            value={email} 
                            name="email"
                            onChange={e => setEmail(e.target.value)}/>
                        <CityHolder>
                            <Input type="text" 
                                placeholder="City" 
                                value={city} 
                                name="city"
                                onChange={e => setCity(e.target.value)}/>
                            <Input type="text" 
                                placeholder="Postal Code" 
                                value={postalCode} 
                                name="postalCode"
                                onChange={e => setPostalCode(e.target.value)}/>
                        </CityHolder>                        
                        <Input type="text" 
                            placeholder="Street Address" 
                            value={streetAddress} 
                            name="streetAddress"
                            onChange={e => setStreetAddress(e.target.value)}/>
                        <Input type="text" 
                            placeholder="Country" 
                            value={country} 
                            name="country"
                            onChange={e => setCountry(e.target.value)}/>
                        <Button black block onClick={goToPayment}>Continue to payment</Button>
                    </Box>
                    )}
                </ColumnsWrapper>
            </Center>
        </>
    )
}