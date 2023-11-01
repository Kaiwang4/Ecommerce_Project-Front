import Link from "next/link";
import styled from "styled-components";
import Center from "./Center";
import { useContext, useState } from "react";
import { CartContext } from "./CartContext";
import BarsIcon from "./icons/Bars";
import SearchIcon from "./icons/SearchIcon";
import { useRouter } from "next/router";

const StyledHeader = styled.header`
    background-color: #222;
    position: sticky;
    top: 0;
    z-index: 10;
`
const Logo = styled(Link)`
    color: #fff;
    text-decoration: none;
    position: relative;
    z-index: 3;
`
const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px 0;
`
const StyledNav = styled.nav`
    display: ${props => props.$mobilenavactive ? 'block' : 'none'};
    gap: 15px;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 70px 20px 20px;
    background-color: #222;
    @media screen and (min-width: 768px) {
        display: flex;
        position: static;
        padding: 0;
    }
`
const NavLink = styled(Link)`
    display: block;
    color: #aaa;
    text-decoration: none;
    min-width: 24px;
    padding: 10px 0;
    @media screen and (min-width: 768px) {
        padding: 0;
    }
`
const NavButton = styled.button`
    background-color: transparent;
    width: 30px;
    height: 30px;
    border: 0;
    color: white;
    cursor: pointer;
    position: relative;
    z-index: 3;
    @media screen and (min-width: 768px) {
        display: none;
    }
`
const SideIcons = styled.div`
    display: flex;
    align-items: center;
    a{
        display: inline-block;
        min-width: 20px;
        color: white;
        svg{
            padding-top: 4px;
            width: 20px;
            height: 20px;
        }
    }
`
export default function Header() {
    const router = useRouter(); 
    const {cartProducts} = useContext(CartContext)
    const [mobilenavactive, setMobilenavactive] = useState(false)
    const handleNavLinkClick = (e, href) => {
        if (router.pathname === href) {
            e.preventDefault();
            router.reload();
        }
    }
    return (
        <StyledHeader>
            <Center>
                <Wrapper>
                    <Logo href={'/'}>Ecommerce</Logo>
                    <StyledNav $mobilenavactive={mobilenavactive}>
                        <NavLink href={'/'} onClick={(e) => handleNavLinkClick(e, '/')}>Home</NavLink>
                        <NavLink href={'/products'} onClick={(e) => handleNavLinkClick(e, '/products')}>All products</NavLink>
                        <NavLink href={'/categories'} onClick={(e) => handleNavLinkClick(e, '/categories')}>Catogories</NavLink>
                        <NavLink href={'/account'} onClick={(e) => handleNavLinkClick(e, '/account')}>Account</NavLink>
                        <NavLink href={'/cart'} id="cart-icon" onClick={(e) => handleNavLinkClick(e, '/cart')}>Cart ({cartProducts.length})</NavLink>
                    </StyledNav>
                    <SideIcons>
                        <Link href={'/search'}>
                            <SearchIcon />
                        </Link>
                        <NavButton onClick={() => setMobilenavactive(prev => !prev)}>
                            <BarsIcon />
                        </NavButton>
                    </SideIcons> 
                </Wrapper>
            </Center>
        </StyledHeader>
    )
}