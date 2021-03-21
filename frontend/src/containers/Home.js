import { Carousel, List, Typography, Input } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';  
import api from '../api';
import MovieCard from '../movie/MovieCard';

const { Search } = Input;

function Home (props) {    
    const [data, setData] = useState();

    useEffect(() => {
        axios({
            method: 'GET',
            url: `${api.movies}/`
        }).then(res => {            
            console.log(res.data.results)            
            setData(res.data.results)
        }).catch(err => {
            console.log(err.message)
        })        
    }, [])   

    const onSearch = value => console.log(value);

    function onChange(a, b, c) {
        console.log(a, b, c);
    }

    return (
        <div>
            <div style={{ margin: '24px 15%' }}>
                <Typography.Title level={3}>Та хүссэн киноныхоо нэрийг бичиж хайна уу.</Typography.Title>
                <Search placeholder="Киноны нэрээр хайх" onSearch={onSearch} size="large" enterButton allowClear />
            </div>            
            <Carousel autoplay effect="fade" afterChange={onChange} style={{ zIndex: '1' }}>
                <div>
                    <List
                        grid={{ gutter: 16, column: 6 }}
                        style={{ margin: '0 15%', padding: '24px 0' }}
                        dataSource={data ? data.slice(0, 6) : undefined}
                        renderItem={item => (
                            <List.Item>
                                <MovieCard item={item} />
                            </List.Item>
                        )}
                    />
                </div>
                <div>
                    <div>
                        <List
                            grid={{ gutter: 16, column: 6 }}
                            style={{ margin: '0 15%', padding: '24px 0' }}
                            dataSource={data ? data.slice(6, 12) : undefined}
                            renderItem={item => (
                                <List.Item>
                                    <MovieCard item={item} />
                                </List.Item>
                            )}
                        />
                    </div>
                </div>                
            </Carousel>           
        </div>
    )
}

export default Home;