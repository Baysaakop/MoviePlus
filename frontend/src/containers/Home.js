import { Grid, Carousel, List, Input, Tooltip, Button, Typography, Row, Col, Table } from 'antd';
import React, { useState, useEffect } from 'react';
import './Home.css';
import axios from 'axios';  
import api from '../api';
import MovieCard from '../movie/MovieCard';
import { CaretRightOutlined, CheckOutlined, LikeOutlined, PlusOutlined, SearchOutlined, StarOutlined } from '@ant-design/icons';

const { useBreakpoint } = Grid;
const { Search } = Input;

function Home (props) {    
    const screens = useBreakpoint();
    const [latest, setLatest] = useState();
    const [toprated, setToprated] = useState();

    useEffect(() => {
        axios({
            method: 'GET',
            url: `${api.movies}/`
        }).then(res => {                              
            setLatest(res.data.results)
        }).catch(err => {
            console.log(err.message)
        });        
        axios({
            method: 'GET',
            url: `${api.movies}?ordering=-score`
        }).then(res => {                                          
            setToprated(res.data.results)
        }).catch(err => {
            console.log(err.message)
        });
    }, [])   

    const onSearch = value => console.log(value);

    function onChange(a, b, c) {
        //console.log(a, b, c);
    }

    function getListNumber() {        
        if (screens.xxl) {
            return 5
        } else if (screens.xl || screens.lg) {
            return 4
        } else if (screens.md) {
            return 3
        } else if (screens.xs || screens.sm) {
            return 2
        }
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Score',
            dataIndex: 'score',
            key: 'score',
        },
        {
            title: 'Views',
            dataIndex: 'views',
            key: 'views',
        },
        {
            title: 'Likes',
            dataIndex: 'likes',
            key: 'likes',
        },
    ];
       

    return (
        <div className="home">            
            { screens.xs ? (
                <div>
                    <Carousel className="carousel" autoplay effect="fade" afterChange={onChange} style={{ zIndex: '1' }}>
                        {latest ? latest.slice(0, 4).map(movie => {
                                return (
                                    <div style={{ height: '50vh' }}>
                                        <img src={movie.landscape} alt="landscape" style={{ width: '100%', height: 'auto', objectFit: 'fill' }} />                                                                                
                                        {/* <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '16px' }}>
                                            <Typography.Title level={1} style={{ color: '#fff' }}>ТА СОНИРХСОН КИНОГОО ХАЙНА УУ</Typography.Title>
                                            <Search placeholder="Кино эсвэл цувралын нэрийг бичнэ үү" onSearch={onSearch} size="large" enterButton={<Button danger type="primary" size="large" icon={<SearchOutlined />} />} allowClear />
                                        </div> */}
                                        <div style={{ background: 'rgba(0, 0, 0, 0.6)', padding: '16px' }}>
                                            <h1 style={{ color: '#f1f1f1' }}>{movie.name} /{movie.releasedate.slice(0, 4)}/</h1>
                                            <p style={{ color: '#f1f1f1' }}>Найруулагч: Christopher Nolan</p>
                                            <Tooltip title="Трэйлэр үзэх">
                                                <Button size="large" type="ghost" shape="circle" icon={<CaretRightOutlined style={{ marginLeft: '2px' }} />} />
                                            </Tooltip>
                                            <Tooltip title="Таалагдсан">
                                                <Button size="large" type="ghost" shape="circle" icon={<LikeOutlined />} />
                                            </Tooltip>
                                            <Tooltip title="Үзсэн">
                                                <Button size="large" type="ghost" shape="circle" icon={<CheckOutlined style={{ marginLeft: '2px' }}  />} />
                                            </Tooltip>
                                            <Tooltip title="Дараа үзэх">
                                                <Button size="large" type="ghost" shape="circle" icon={<PlusOutlined />} />
                                            </Tooltip>
                                            <Tooltip title="Үнэлгээ өгөх">
                                                <Button size="large" type="ghost" shape="circle" icon={<StarOutlined />} />
                                            </Tooltip>
                                        </div> 
                                    </div>
                                );
                            }) : <></>
                        }                
                    </Carousel>
                </div>
            ) : (
                <div>
                    <Carousel className="carousel" autoplay effect="fade" afterChange={onChange} style={{ zIndex: '1' }}>
                        {latest ? latest.slice(0, 4).map(movie => {
                                return (
                                    <div>
                                        <div style={{ margin: 0, padding: 0, width: '100%', height: '70vh', position: 'relative' }}>
                                            <img src={movie.landscape} alt="landscape" style={{ width: '100%', height: 'auto', objectFit: 'fill' }} />                                    
                                            <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, 0%)', padding: '16px' }}>
                                                <Typography.Title level={1} style={{ color: '#fff' }}>СОНИРХСОН КИНОГОО ХАЙНА УУ</Typography.Title>
                                                <Search placeholder="Кино эсвэл цувралын нэрийг бичнэ үү" onSearch={onSearch} size="large" enterButton={<Button danger type="primary" size="large" icon={<SearchOutlined />} />} allowClear />
                                            </div>
                                            <div style={{ position: 'absolute', left: '15%', bottom: '10%', background: 'rgba(0, 0, 0, 0.6)', padding: '16px' }}>
                                                <h1 style={{ color: '#f1f1f1' }}>{movie.name} /{movie.releasedate.slice(0, 4)}/</h1>
                                                <p style={{ color: '#f1f1f1' }}>Найруулагч: Christopher Nolan</p>
                                                <Tooltip title="Трэйлэр үзэх">
                                                    <Button size="large" type="ghost" shape="circle" icon={<CaretRightOutlined style={{ marginLeft: '2px' }} />} />
                                                </Tooltip>
                                                <Tooltip title="Таалагдсан">
                                                    <Button size="large" type="ghost" shape="circle" icon={<LikeOutlined />} />
                                                </Tooltip>
                                                <Tooltip title="Үзсэн">
                                                    <Button size="large" type="ghost" shape="circle" icon={<CheckOutlined style={{ marginLeft: '2px' }}  />} />
                                                </Tooltip>
                                                <Tooltip title="Дараа үзэх">
                                                    <Button size="large" type="ghost" shape="circle" icon={<PlusOutlined />} />
                                                </Tooltip>
                                                <Tooltip title="Үнэлгээ өгөх">
                                                    <Button size="large" type="ghost" shape="circle" icon={<StarOutlined />} />
                                                </Tooltip>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }) : <></>
                        }                
                    </Carousel>                                                                             
                </div>
            )}     
            <Row gutter={[16, 16]} style={{ margin: '16px 15%' }}>
                <Col xs={24} sm={24} md={16}>
                    <div className="latestmovies" style={{ marginTop: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <Typography.Title level={4}>Шинээр нэмэгдсэн</Typography.Title>
                            </div>
                            <div>
                                <Button danger type="primary" href="/movies" shape="round">
                                    Бүгд
                                </Button>
                            </div>
                        </div>
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
                            // pagination={<Pagination size="small" pageSize={5} />}
                            dataSource={latest ? latest.slice(0, getListNumber()) : undefined}
                            renderItem={item => (
                                <List.Item>
                                    <MovieCard item={item} />
                                </List.Item>
                            )}
                        />
                    </div>
                    <div className="topmovies" style={{ marginTop: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <Typography.Title level={4}>Өндөр үнэлгээтэй</Typography.Title>
                            </div>
                            <div>
                                <Button danger type="primary" href="/movies" shape="round">
                                    Бүгд
                                </Button>
                            </div>
                        </div>
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
                            // pagination={{ pageSize: 5 }}
                            dataSource={toprated ? toprated.slice(0, getListNumber()) : undefined}
                            renderItem={item => (
                                <List.Item>
                                    <MovieCard item={item} />
                                </List.Item>
                            )}
                        />
                    </div> 
                </Col>
                <Col xs={24} sm={24} md={8}>
                    <div className="trendmovies" style={{ marginTop: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <div>
                                <Typography.Title level={4}>Энэ сарын тренд</Typography.Title>
                            </div>
                            {/* <div>
                                <Button danger type="primary" href="/movies" shape="round">
                                    Бүгд
                                </Button>
                            </div> */}
                        </div>
                        <Table columns={columns} dataSource={toprated} size="small" style={{ marginTop: '16px' }} />
                    </div> 
                </Col>
            </Row>                     
        </div>
    )
}

export default Home;