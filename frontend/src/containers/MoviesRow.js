import { Button, Card, List, Typography, Grid, Skeleton } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';  
import api from '../api';
import moment from 'moment'

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
            return 5
        } else if (screens.xl) {
            return 4
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
    
    function getGenre(genres) {
        let result = ""
        genres.slice(0, 2).forEach(genre => {
            result = result + genre.name + ", "
        })
        return result.slice(0, result.length - 2)
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
            { !movies ? (
                <List                        
                    grid={{
                        gutter: 16,
                        xs: 2,
                        sm: 2,
                        md: 3,
                        lg: 4,
                        xl: 4,
                        xxl: 5,
                    }}                                      
                    style={{ marginTop: '16px' }}                      
                    dataSource={dummy.slice(0, getListNumber())}
                    renderItem={item => (
                        <List.Item>
                            <Skeleton paragraph={{ rows: 8 }} active />
                        </List.Item>
                    )}
                />
            ) : (
                <List                        
                    grid={{
                        gutter: 16,
                        xs: 2,
                        sm: 2,
                        md: 3,
                        lg: 4,
                        xl: 4,
                        xxl: 5,
                    }}                                      
                    style={{ marginTop: '16px' }}      
                    pagination={{ pageSize: getListNumber() ? getListNumber() : false, size: 'small' }}
                    dataSource={movies.slice(0, getListNumber() * 3)}
                    renderItem={item => (
                        <List.Item>
                            <Link to={`/movies/${item.id}`}>
                                <Card hoverable cover={<img alt={item.name} src={item.poster} />} style={{ border: 0 }}>
                                    <Card.Meta title={`${item.name} /${moment(item.releasedate).format("YYYY")}/`} description={getGenre(item.genre)} />
                                </Card>
                            </Link>
                        </List.Item>
                    )}
                />
            )}            
        </div>
    )
}

export default MoviesRow