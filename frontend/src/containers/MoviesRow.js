import { Button, List, Typography, Grid, Skeleton } from 'antd'
import React, { useEffect, useState } from 'react'
import axios from 'axios';  
import api from '../api';
import MovieCard1 from '../movie/cards/MovieCard1';

const { useBreakpoint } = Grid

const dummy = [
    {
        title: 'Test'
    },
    {
        title: 'Test'
    },
    {
        title: 'Test'
    },
    {
        title: 'Test'
    },
    {
        title: 'Test'
    },
    {
        title: 'Test'
    },
    {
        title: 'Test'
    },
    {
        title: 'Test'
    },
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
        }).catch(err => {
            console.log(err.message)
        });
    }, [props.type])    

    function getListNumber() {        
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                dataSource={movies ? movies.slice(0, getListNumber() * 3) : dummy.slice(0, getListNumber())}
                renderItem={item => (
                    <List.Item>
                        {movies ? (
                            <MovieCard1 item={item} />
                        ) : (
                            <Skeleton paragraph={{ rows: 8 }} active />
                        )}                            
                    </List.Item>
                )}
            />           
        </div>
    )
}

export default MoviesRow