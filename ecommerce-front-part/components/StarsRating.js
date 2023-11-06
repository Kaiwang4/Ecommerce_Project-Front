import styled from "styled-components";
import StarOutline from "./icons/StarOutlineIcon";
import { useEffect, useState } from "react";
import StarSolid from "./icons/StarSolidIcon";
import { primary } from "@/lib/colors";

const StarsWrapper = styled.div`
    display: inline-flex;
    gap: 1px;
    align-items: center;
`
const StarWrapper = styled.button`
    ${props => props.size === 'md' && `
        height: 1.4rem;
        width: 1.4rem;
    `}
    ${props => props.size === 'sm' && `
        height: 1rem;
        width: 1rem;
    `}
    ${props => !props.disabled && `
        cursor: pointer;
    `}
    padding: 0;
    border: 0;
    display: inline-block;
    background-color: transparent;
    color: ${primary}
` 
export default function StarsRating({
    size='md',
    defaultStar=0, onChange=()=>{}, disabled
}) {
    const [clicked, setClicked] = useState(defaultStar)
    useEffect(() => {
        // console.log('defaultStar changed:', defaultStar); 
        setClicked(defaultStar);
    }, [defaultStar])
    // useEffect(() => {
    //     // console.log('clicked state:', clicked); // 跟踪clicked状态的变化
    // }, [clicked]);
    const stars = [1, 2, 3, 4, 5]
    function clickStar(star) {
        if (disabled) {
            return
        }

        if (star === clicked) {
            setClicked(0);
            onChange(0);
        } else {
            setClicked(star);
            onChange(star);
        }
    }
    return (
        <StarsWrapper>
            {stars.map(star => (
                <StarWrapper disabled={disabled} size={size} key={star} onClick={() => clickStar(star)}>{clicked >= star ? <StarSolid /> : <StarOutline />}</StarWrapper>                    
            ))}
        </StarsWrapper>
    )
}