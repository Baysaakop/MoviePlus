import { LoadingOutlined } from '@ant-design/icons';
import { List, Pagination, Spin } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import api from '../api';
import MovieCard1 from './cards/MovieCard1';

const indicator = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function MoviesLiked (props) {        
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState()
    const [movies, setMovies] = useState()

    useEffect(() => {        
        getMovies()        
    }, [props.token, props.user, props.state, page]) // eslint-disable-line react-hooks/exhaustive-deps

    function getMovies() {
        setLoading(true)        
        let url = api.movies + "?user=" + props.user.id + "&state=" + props.state
        axios({
            method: 'GET',
            url: `${url}&page=${page}`,            
        })
        .then(res => {
            setMovies(res.data.results)
            setTotal(res.data.count)
            props.setCount(res.data.count)
            setLoading(false)
        })
        .catch(err => {
            console.log(err)
            setLoading(false)
        })
    }

    function onPageChange (pageNum) {        
        setPage(pageNum)
    }

    function showTotal(total) {
        return `Нийт ${total} кино:`;
    }

    return (
        <div>            
            { loading ? (
                <div style={{ width: '100%', height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Spin indicator={indicator} tip="Ачааллаж байна..." />
                </div>
            ) : (
                <>
                    <List                        
                        grid={{
                            gutter: 16,
                            xs: 2,
                            sm: 2,
                            md: 4,
                            lg: 4,
                            xl: 5,
                            xxl: 5,
                        }}                                      
                        style={{ marginTop: '16px' }}                
                        dataSource={movies ? movies : undefined}
                        renderItem={item => (
                            <List.Item>
                                <MovieCard1 movie={item} user={props.user} />                                
                            </List.Item>
                        )}
                    />
                    <Pagination
                        current={page}
                        total={total}
                        pageSize={20}
                        hideOnSinglePage={true}
                        showSizeChanger={false}
                        showTotal={showTotal}
                        onChange={onPageChange}
                        size="small"
                    />
                </>
            )}            
        </div>
    )
}

export default MoviesLiked;