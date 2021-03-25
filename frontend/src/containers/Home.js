import { Grid, Carousel, List, Input, Tooltip, Button, Typography, Row, Col } from 'antd';
import React, { useState, useEffect } from 'react';
import './Home.css';
import axios from 'axios';  
import api from '../api';
import MovieCard from '../movie/MovieCard';
import { CaretRightOutlined, CheckOutlined, LikeOutlined, PlusOutlined, StarOutlined } from '@ant-design/icons';
import MovieTrendTable from '../movie/MovieTrendTable';
import GenreTag from '../components/GenreTag';

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
            return 4
        } else if (screens.xl || screens.lg || screens.md) {
            return 3
        } else if (screens.sm) {
            return 2
        } else if (screens.xs) {
            return 1
        }
    }       

    return (
        <div className="home">            
            { screens.xs ? (
                <div>
                    <Carousel className="carousel" autoplay effect="fade" afterChange={onChange} style={{ zIndex: '1' }}>
                        {latest ? latest.slice(0, 4).map(movie => {
                                return (
                                    <a href={`/movies/${movie.id}`}>
                                        <div style={{ margin: 0, padding: 0, width: '100%', height: '25vh' }}>
                                            <img src={movie.landscape} alt="landscape" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />     
                                        </div>                                                                           
                                        <div style={{ background: 'rgba(0, 0, 0, 0.6)', padding: '16px', width: '100%', height: '25vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <div>
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
                                    </a>
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
                                    <a href={`/movies/${movie.id}`}>
                                        <div style={{ margin: 0, padding: 0, width: '100%', height: '70vh', position: 'relative' }}>
                                            <img src={movie.landscape} alt="landscape" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: '0.2', backgroundColor: '#000' }} />                                    
                                            <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, 0%)', padding: '16px' }}>
                                                <Typography.Title level={2} style={{ color: '#fff' }}>СОНИРХСОН КИНОГОО ХАЙНА УУ</Typography.Title>
                                                {/* <Search placeholder="Кино эсвэл цувралын нэрийг бичнэ үү" onSearch={onSearch} size="large" enterButton={<Button danger type="primary" size="large" icon={<SearchOutlined />} />} allowClear /> */}
                                                <Search placeholder="Кино эсвэл цувралын нэрийг бичнэ үү" onSearch={onSearch} size="large" enterButton />
                                            </div>
                                            <div style={{ position: 'absolute', left: '15%', bottom: '5%', padding: '16px' }}>
                                                <Typography.Title level={2} style={{ marginBottom: 0 }}>{movie.name}</Typography.Title>
                                                {/* <p style={{ color: '#f1f1f1' }}>Найруулагч: Christopher Nolan</p> */}
                                                <div className="info">
                                                    <Typography.Text type="secondary">Ангилал: {movie.rating.name} |</Typography.Text>
                                                    <Typography.Text type="secondary"> Хугацаа: {movie.duration} мин |</Typography.Text>
                                                    <Typography.Text type="secondary"> Нээлт: {movie.releasedate}</Typography.Text>
                                                </div>
                                                <div className="genre" style={{ marginTop: '8px' }}>
                                                    {movie.genre.map(g => {
                                                        return (                                                
                                                            <GenreTag genre={g.name} />
                                                        )                                            
                                                    })}
                                                </div>
                                                <div className="actions" style={{ marginTop: '16px' }}>                                        
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
                                                {/* <div className="rating" style={{ marginTop: '16px' }}>
                                                    <Statistic title="Үнэлгээ" value={movie.score} prefix={<StarFilled style={{ color: 'gold' }} />} suffix={<span>/100 <span style={{ fontSize: '16px' }}>({movie.score_count} үнэлгээнээс)</span></span>} />                                        
                                                </div>                                            */}
                                            </div>
                                        </div>
                                    </a>
                                );
                            }) : <></>
                        }                
                    </Carousel>                                                                             
                </div>
            )}     
            <Row gutter={[16, 16]} style={{ margin: `16px 15%` }}>
                <Col xs={24} sm={24} md={24} lg={16}>
                    <div className="latestmovies" style={{ marginTop: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <Typography.Title level={4} style={{ margin: 0 }}>Шинээр нэмэгдсэн</Typography.Title>
                            </div>
                            <div>
                                <Button type="primary" href="/movies">
                                    Бүгд
                                </Button>
                            </div>
                        </div>
                        <List                        
                            grid={{
                                gutter: 16,
                                xs: 1,
                                sm: 2,
                                md: 3,
                                lg: 3,
                                xl: 3,
                                xxl: 4,
                            }}                                      
                            style={{ marginTop: '16px' }}
                            pagination={{ pageSize: getListNumber() ? getListNumber() : false, size: 'small' }}
                            dataSource={latest ? latest.slice(0, getListNumber() * 3) : undefined}
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
                                <Typography.Title level={4}  style={{ margin: 0 }}>Өндөр үнэлгээтэй</Typography.Title>
                            </div>
                            <div>
                                <Button type="primary" href="/movies">
                                    Бүгд
                                </Button>
                            </div>
                        </div>
                        <List                        
                            grid={{
                                gutter: 16,
                                xs: 1,
                                sm: 2,
                                md: 3,
                                lg: 3,
                                xl: 3,
                                xxl: 4,
                            }}                                        
                            style={{ marginTop: '16px' }}
                            pagination={{ pageSize: getListNumber() ? getListNumber() : false, size: 'small' }}
                            dataSource={toprated ? toprated.slice(0, getListNumber() * 3) : undefined}
                            renderItem={item => (
                                <List.Item>
                                    <MovieCard item={item} />
                                </List.Item>
                            )}
                        />
                    </div> 
                </Col>
                <Col xs={24} sm={24} md={24} lg={8}>
                    <div className="trendmovies" style={{ marginTop: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <Typography.Title level={4} style={{ margin: 0 }}>Энэ сарын тренд</Typography.Title>
                            </div>
                            <div>
                                <Button type="primary" href="/movies">
                                    Бүгд
                                </Button>
                            </div>
                        </div>
                        <MovieTrendTable data={toprated ? toprated.slice(0, 10) : undefined} />
                    </div> 
                </Col>
            </Row>                     
        </div>
    )
}

export default Home;