import { BounceLoader } from "react-spinners";
import styled, {css} from "styled-components";

const fullWidthStyle = css`
    display: block;
    display: flex;
    justify-content: center;
    margin-top: 50px;
`

const borderedStyle = css`
    border: 5px solid blue;
`
const Wrapper = styled.div`
    ${props => props.fullWidth ? fullWidthStyle : borderedStyle}
`

export default function Spinner({fullWidth}) {
    return (
        <Wrapper fullWidth={fullWidth}>
            <BounceLoader speedMultiplier={3} color={"#555"} />
        </Wrapper>
    )
}