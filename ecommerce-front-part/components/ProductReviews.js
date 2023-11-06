import styled from "styled-components"
import Input from "./Input"
import WhiteBox from "./WhiteBox"
import StarsRating from "./StarsRating"
import Textarea from "./Textarea"
import Button from "./Button"
import { primary } from "@/lib/colors"
import { useEffect, useState } from "react"
import axios from "axios"
import Spinner from "./Spinner"
import { withSwal } from "react-sweetalert2"

const Title = styled.h2`
    font-size: 1.2rem;
    margin-bottom: 5px;
`
const Subtitle = styled.h3`
    font-size: 1rem;
    margin-top: 5px;
`
const ColsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
    margin-bottom: 40px;
    @media screen and (min-width: 768px) {
        grid-template-columns: 1fr 1fr;
    }
`
const ReviewWrapper = styled.div`
    margin-bottom: 10px;
    border-top: 1px solid #eee;
    pading: 10px 0;
    h3{
        margin: 3px 0;
        font-size: 1rem;
        color: #555;
    }
    p{
        margin: 0;
        font-size: .7rem;
        line-height: 1rem;
        color: #777;
    }
`
const ReviewHeader = styled.div`
    display: flex;
    justify-content: space-between;
    time{
        font-size: 12px;
        font-weight: bold;
        color: #aaa;
    }
`
function ProductReviews({product, swal}) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [stars, setStars] = useState(0)
    const [reviews, setReviews] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    function submitReview() {
        const data = {title, description, stars, product: product._id}
        axios.post('/api/reviews', data).then(res => {
            // console.log('Before reset:', { title, description, stars });
            setTitle('')
            setDescription('')
            setStars(0)
            // console.log('After reset:', { title: '', description: '', stars: 0 }); 
        }).catch(err => {
            swal.fire({
                title: 'Error!',
                text: err.response?.data?.message || 'An error occurred',
                icon: 'error',
            });
        }).finally(() => {
            swal.fire({
                title: 'Review posted successfully!',
                icon: 'success',
            });
            loadReviews()
        })
    }
    useEffect(() => {
        loadReviews()
    }, [])
    function loadReviews() {
        setIsLoading(true)
        axios.get(`/api/reviews?product=${product._id}`).then(res => {
            setReviews(res.data)
        }).catch(error => {
            console.error('There was an error fetching the reviews', error);
            swal.fire({
            title: 'Error!',
            text: 'There was an error fetching the reviews',
            icon: 'error',
            });
        }).finally(() => {
            setIsLoading(false);
        });
    }
    return (
        <div>
            <Title>Reviews</Title>
            <ColsWrapper>
                <div>
                    <WhiteBox>
                        <Subtitle>Add review</Subtitle>
                        <div>
                            <StarsRating onChange={setStars} defaultStar={stars}/>
                        </div>
                        <Input 
                            value={title} 
                            onChange={e => setTitle(e.target.value)} 
                            placeholder="Title" />  
                        <Textarea 
                            value={description} 
                            onChange={e => setDescription(e.target.value)} 
                            placeholder="Please share about your experience"/>       
                        <div>
                            <Button primary={primary} onClick={submitReview}>Submit</Button>
                        </div>         
                    </WhiteBox>
                </div>   
                <div>
                    <WhiteBox>
                        <Subtitle>All reviews</Subtitle>
                        {isLoading && (
                            <Spinner fullWidth={true} />
                        )}
                        {!isLoading && (
                            <>
                                { reviews.length === 0 && (
                                    <p>There is no reviews : &#40;</p>
                                )}
                                { reviews.length > 0 && reviews.map(review => (
                                    <ReviewWrapper key={review._id}>
                                        <ReviewHeader>
                                            <StarsRating size={'sm'} disabled={true} defaultStar={review.stars} />
                                            <time>{(new Date(review.createdAt)).toLocaleString('sv-SE')}</time>
                                        </ReviewHeader> 
                                        <h3>{review.title}</h3>      
                                        <p>{review.description}</p> 
                                    </ReviewWrapper>
                                ))}
                            </>
                        )}
                    </WhiteBox>
                </div>                      
            </ColsWrapper>
        </div>
    )
}

export default withSwal(ProductReviews)