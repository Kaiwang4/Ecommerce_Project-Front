import Button from "@/components/Button";
import Center from "@/components/Center";
import Header from "@/components/Header";
import WhiteBox from "@/components/WhiteBox";
import { primary } from "@/lib/colors";
import {signIn, signOut, useSession} from "next-auth/react"
import { RevealWrapper } from "next-reveal";
import styled from "styled-components";
import { useEffect, useState } from "react"
import Input from "@/components/Input"
import axios from "axios";
import Spinner from "@/components/Spinner";
import ProductBox from "@/components/ProductBox";
import Tabs from "@/components/Tabs";
import SingleOrder from "@/components/SingleOrder";
import { withSwal } from "react-sweetalert2";

const ColsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1.2fr .8fr;
    gap: 40px;
    margin: 40px 0;
    p{
        margin: 10px;
    }
`

const CityHolder = styled.div`
    display: flex;
    gap: 5px;
`

const WishedProductsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
`
function AccountPage({swal}) {
    const { data: session } = useSession()
    // console.log("----???-------", process.env.NEXT_PUBLIC_BASE_URL);
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [city, setCity] = useState('')
    const [postalCode, setPostalCode] = useState('')
    const [streetAddress, setStreetAddress] = useState('')
    const [country, setCountry] = useState('')
    const [loaded, setLoaded] = useState(true)
    const [wishedProducts, setWishedProducts] = useState([])
    const [activeTab, setActiveTab] = useState('Orders')
    const [orders, setOrders] = useState([])

    async function logOut() {
        await signOut({
            // callbackUrl: process.env.NEXT_PUBLIC_BASE_URL,
        })
    }
    async function login() {
        await signIn('google')
    }

    function saveAddress() {
        const data = {name, email, city, streetAddress, postalCode, country}
        axios.put('/api/address', data).catch(err => {
            swal.fire({
                title: 'Error!',
                text: err.response?.data?.message || 'An error occurred',
                icon: 'error',
            });
        }).finally(() => {
            swal.fire({
                title: 'Details save successfully!',
                icon: 'success',
            });
        })
    }
    useEffect(() => {
        if (!session) {
            return
        }

        setLoaded(false)
        Promise.all([
            axios.get('/api/address'),
            axios.get('/api/wishlist'),
            axios.get('/api/order')
        ]).then(([addressResponse, wishlistResponse, orderResponse]) => {
            // Update Address Infomation
            if (addressResponse.data) {
                // Update Address Information
                const { name, email, city, postalCode, streetAddress, country } = addressResponse.data;
                setName(name);
                setEmail(email);
                setCity(city);
                setPostalCode(postalCode);
                setStreetAddress(streetAddress);
                setCountry(country);
            } else {
                setName('');
                setEmail('');
                setCity('');
                setPostalCode('');
                setStreetAddress('');
                setCountry('');
            }
            
            // Update Wishlist Information
            setWishedProducts(wishlistResponse.data.map(wp => wp.product));
            setOrders(orderResponse.data)
    
            // Set Loaded
            setLoaded(true);
        }).catch(error => {
            console.error("Error fetching data: ", error);
            setLoaded(true);
        });
    }, [session])
    function productRemovedFromWishlist(idToRemove) {
        setWishedProducts(prev => [...prev.filter(p => p._id.toString() !== idToRemove)])
    }
    return (
        <>
            <Header />
            <Center>
                <ColsWrapper>
                    <div>
                        <RevealWrapper delay={0}> 
                            <WhiteBox>
                                <Tabs 
                                    tabs={['Orders', 'Wishlist']} 
                                    active={activeTab} 
                                    onChange={setActiveTab}/>
                                {activeTab == 'Orders' && (
                                    <>
                                        {!loaded && (
                                            <Spinner fullWidth={true} />
                                        )}
                                        {loaded && (
                                            <div>
                                                {!session && (
                                                    <p>Login to see your orders</p>
                                                )}
                                                {session && orders.length === 0 && (
                                                    <p>Your order is empty</p>   
                                                )}
                                                {session && orders.length > 0 && orders.map(order => (
                                                    <SingleOrder key={order._id} {...order} />
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                                {activeTab === 'Wishlist' && (
                                    <>
                                        {!loaded && (
                                            <Spinner fullWidth={true} />
                                        )}
                                        {loaded && (
                                            <>
                                                {wishedProducts.length === 0 && (
                                                    <>
                                                        {session && (
                                                            <p>Your wishlist is empty</p>
                                                        )}
                                                        {!session && (
                                                            <p>Login to add products to your wishlist</p>
                                                        )}
                                                    </>
                                                )}        
                                                <WishedProductsGrid>
                                                    {wishedProducts.length > 0 && wishedProducts.map(wp => (
                                                        <ProductBox key={wp._id} {...wp} wished onRemoveFromWishlist={productRemovedFromWishlist} />
                                                    ))}
                                                </WishedProductsGrid>                 
                                            </>                     
                                        )} 
                                    </>
                                )}                    
                            </WhiteBox>
                        </RevealWrapper>                                          
                    </div>
                    <div>
                        <RevealWrapper delay={100}> 
                            <WhiteBox>
                                <h2>{session ? 'Account details' : 'Login'}</h2>
                                {!loaded && (
                                    <Spinner fullWidth={true} />
                                )}
                                {loaded && session && (
                                    <>
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
                                        <Button black={1} block={1} onClick={saveAddress}>Save</Button>
                                        <hr />
                                    </>
                                )}
                                {session && (
                                <Button 
                                primary={primary}
                                onClick={logOut}
                                >Logout</Button>
                                )}
                                {!session && (
                                    <Button
                                    primary={primary}
                                    onClick={login}
                                    >Login with Google</Button>
                                )}
                            </WhiteBox>
                        </RevealWrapper>
                    </div>
                </ColsWrapper>
            </Center>
        </>
    )
}

export default withSwal(({swal}) => (
    <AccountPage swal={swal} />
))