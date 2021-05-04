import React, { useEffect, useState } from 'react';
import axios from 'axios';  
import api from '../api';
import ReviewCard from '../reviews/ReviewCard';
import InfiniteCarousel from 'react-leaf-carousel';

function HomeReviews (props) {
    const [reviews, setReviews] = useState()

    useEffect(() => {
        getPosts()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function getPosts() {
        var url = api.reviews        
        axios({
            method: 'GET',
            url: url
        }).then(res => {                                                   
            setReviews(res.data.results)                          
        }).catch(err => {
            console.log(err.message)
        });        
    }

    return (
        <div>
            {reviews ? (
                <InfiniteCarousel
                    breakpoints={[
                        {
                            breakpoint: 768,
                            settings: {                            
                                slidesToShow: 1,                            
                            },
                        },
                        {
                            breakpoint: 1200,
                            settings: {                            
                                slidesToShow: 2,                            
                            },
                        },
                        {
                            breakpoint: 1600,
                            settings: {                            
                                slidesToShow: 3,                            
                            },
                        }
                    ]}
                    dots={false}
                    showSides={true}
                    sidesOpacity={.5}
                    sideSize={.1}
                    slidesToScroll={1}
                    slidesToShow={4}
                    scrollOnDevice={true}
                >
                    {reviews.map(item => {
                        return (
                            <ReviewCard item={item} />
                        )
                    })}
                </InfiniteCarousel>
            ) : <></>}       
        </div>
    )
}

export default HomeReviews;

