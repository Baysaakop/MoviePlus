import { Button, Typography, Skeleton, List, Grid } from 'antd'
import React, { useEffect, useState } from 'react'
import axios from 'axios';  
import api from '../api';
import MovieCard1 from '../movie/cards/MovieCard1';
import InfiniteCarousel from 'react-leaf-carousel';

const { useBreakpoint } = Grid

const dummy = [
    {
        name: '1'
    },
    {
        name: '2'
    },
    {
        name: '3'
    },
    {
        name: '4'
    },
    {
        name: '5'
    },
    {
        name: '6'
    }
]

function MoviesRow (props) {
    const screens = useBreakpoint()
    const [movies, setMovies] = useState()

    useEffect(() => {             
        axios({
            method: 'GET',
            url: `${api.movies}?order=${props.type}`
        }).then(res => {                         
            let data = res.data.results                                                                         
            setMovies(data)   
            if (props.getMovieCount) {
                props.getMovieCount(res.data.count)
            }            
        }).catch(err => {
            console.log(err.message)
        });
    }, [props]) 

    function getListNumber () {
        if (screens.xxl) {
            return 6
        } else if (screens.xl) {
            return 5
        } else if (screens.lg) {
            return 4
        } else if (screens.md) {
            return 3
        } else if (screens.sm) {
            return 2
        } else if (screens.xs) {
            return 2
        }
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0' }}>
                <div style={{ borderLeft: '12px solid #8e44ad' }}>                                    
                    <Typography.Title level={4} style={{ margin: '0 0 0 8px' }}>{props.title}</Typography.Title>
                </div>
                <Button type="ghost" href={`/movies?order=${props.type}`}>
                    Бүгд
                </Button>
            </div>
            { movies ? (
                <InfiniteCarousel
                    // breakpoints={[
                    // {
                    //     breakpoint: 768,
                    //     settings: {                            
                    //         slidesToShow: 2,                            
                    //     },
                    // },
                    // {
                    //     breakpoint: 992,
                    //     settings: {                            
                    //         slidesToShow: 3,                            
                    //     },
                    // },
                    // {
                    //     breakpoint: 1200,
                    //     settings: {                            
                    //         slidesToShow: 4,                            
                    //     },
                    // },
                    // {
                    //     breakpoint: 1600,
                    //     settings: {                            
                    //         slidesToShow: 5,                            
                    //     },
                    // },
                    // ]}
                    dots={false}
                    showSides={true}
                    sidesOpacity={.5}
                    sideSize={.1}
                    slidesToScroll={2}
                    slidesToShow={getListNumber()}
                    scrollOnDevice={true}
                >
                    {movies.map(item => {
                        return (
                            <MovieCard1 movie={item} user={props.user} />
                        )
                    })}
                </InfiniteCarousel>
            ) : (
                <List                        
                    grid={{
                        gutter: 16,
                        xs: 2,
                        sm: 2,
                        md: 3,
                        lg: 4,
                        xl: 5,
                        xxl: 6,
                    }}                                      
                    style={{ marginTop: '16px' }}      
                    dataSource={dummy.slice(0, getListNumber())}
                    renderItem={item => (
                        <List.Item>
                            <>                            
                                <Skeleton.Button active size={180} />
                                <Skeleton paragraph={{ rows: 1 }} active />
                            </>                            
                        </List.Item>
                    )}
                />
            )}            
            {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ borderLeft: '12px solid #8e44ad' }}>                                    
                    <Typography.Title level={4} style={{ margin: '0 0 0 8px' }}>{props.title}</Typography.Title>
                </div>
                <Button type="ghost" href={`/movies?order=${props.type}`}>
                    Бүгд
                </Button>
            </div>                         
            <List                        
                grid={{
                    gutter: 16,
                    xs: 2,
                    sm: 2,
                    md: 3,
                    lg: 4,
                    xl: 5,
                    xxl: 6,
                }}                                      
                style={{ marginTop: '16px' }}      
                pagination={{ pageSize: getListNumber() ? getListNumber() : false, size: 'small' }}
                dataSource={movies ? movies.slice(0, getListNumber() * 2) : dummy.slice(0, getListNumber())}
                renderItem={item => (
                    <List.Item>
                        {movies ? (
                            <MovieCard1 movie={item} user={props.user} />
                        ) : (
                            <>                            
                                <Skeleton.Button active size={180} />
                                <Skeleton paragraph={{ rows: 1 }} active />
                            </>
                        )}                            
                    </List.Item>
                )}
            />            */}
        </div>
    )
}

export default MoviesRow