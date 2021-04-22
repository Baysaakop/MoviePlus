import { LoadingOutlined } from '@ant-design/icons';
import { List, Pagination, Spin } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import api from '../api';
// import MovieCard from './MovieCard';
import MovieCard3 from './MovieCard3';

const indicator = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function MoviesLiked (props) {        
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState()
    const [movies, setMovies] = useState()

    useEffect(() => {        
        getMovies()        
    }, [props.token, props.type, page]) // eslint-disable-line react-hooks/exhaustive-deps

    function getMovies() {
        setLoading(true)        
        let url = ""
        if (props.type === 'likes') {
            url = api.likes
        } else if (props.type === 'checks') {
            url = api.checks
        } else if (props.type === 'watchlists') {
            url = api.watchlists
        }
        axios({
            method: 'GET',
            url: `${url}?token=${props.token}&page=${page}`,            
        })
        .then(res => {
            console.log(res.data)
            setMovies(res.data.results)
            setTotal(res.data.count)
            setLoading(false)
        })
        .catch(err => {
            console.log(err)
            setLoading(false)
        })
    }

    function onPageChange (pageNum, pageSize) {        
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
                            sm: 1,
                            md: 2,
                            lg: 2,
                            xl: 3,
                            xxl: 4,
                        }}                                      
                        style={{ marginTop: '16px' }}                
                        dataSource={movies ? movies : undefined}
                        renderItem={item => (
                            <List.Item>
                                <MovieCard3 movie={item.movie} />
                            </List.Item>
                        )}
                    />
                    <Pagination
                        current={page}
                        total={total}
                        pageSize={24}
                        hideOnSinglePage={true}
                        showSizeChanger={false}
                        showTotal={showTotal}
                        onChange={onPageChange}
                    />
                </>
            )}            
        </div>
    )
}

export default MoviesLiked;