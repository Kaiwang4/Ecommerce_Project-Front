import styled from "styled-components"
import { ButtonStyle } from "./Button"
import { primary } from "@/lib/colors"
import { useContext, useEffect, useRef, useState } from "react"
import { CartContext } from "./CartContext"

const FlyingButtonWrapper = styled.div`
    position: relative;
    button{
        ${ButtonStyle};
        ${props => props.main ? `
            background-color: ${primary};
            color: white;
        ` : `
            background-color: transparent;
            border: 1px solid ${primary};
            color: ${primary};
        `}   
        ${props => props.white === 1 && `
            background-color: white;
            border: 1px solid white;
        `}
    }
    @keyframes fly{
        100%{
            display: none;
            top: 0;
            left: 90%;
            opacity: 0;
            max-width: 25px;
            max-height: 25px;
        }
    }
    img{
        display: none;
        max-width: 50px;
        max-height: 50px;
        opacity: 1;
        position: fixed;
        z-index: 5;
        animation: fly 1s;
        border-radius: 10px;
    }
`

export default function FlyingButton(props) {
    const {addProduct} = useContext(CartContext)
    const imgRef = useRef()
    function sendImageToCart(e) {
        imgRef.current.style.display = 'inline-block'
        imgRef.current.style.left = (e.clientX - 25) + 'px'
        imgRef.current.style.top = (e.clientY - 25) + 'px'
        setTimeout(() => {
            imgRef.current.style.display = 'none'
        }, 1000)
    }
    useEffect(() => {
        const interval = setInterval(() => {
            const reveal = imgRef.current.closest('div[data-sr-id]')
            if (reveal?.style.opacity === '1') {
                reveal.style.transform = 'none'
            }
        }, 100)

        return () => clearInterval(interval)
    }, [])
    return (
        <>
            <FlyingButtonWrapper 
                white={props.white} 
                main={props.main} 
                onClick={() => addProduct(props._id)}
            >
                <img src={props.src} ref={imgRef} alt=""/>
                <button onClick={e => sendImageToCart(e)} {...props} />
            </FlyingButtonWrapper>
        </>   
    )
}