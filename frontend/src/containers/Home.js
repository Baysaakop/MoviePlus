import { Grid, Carousel, List, Tooltip, Button, Typography, Row, Col } from 'antd';
import React, { useState, useEffect } from 'react';
import './Home.css';
import axios from 'axios';  
import api from '../api';
import MovieCard from '../movie/MovieCard';
import { CaretRightOutlined, CheckOutlined, LikeOutlined, PlusOutlined } from '@ant-design/icons';
import MovieTrendTable from '../movie/MovieTrendTable';
import GenreTag from '../components/GenreTag';
import Modal from 'antd/lib/modal/Modal';

const { useBreakpoint } = Grid;

function Home (props) {    
    const screens = useBreakpoint();
    const [latest, setLatest] = useState();
    const [toprated, setToprated] = useState();
    const [modalVisible, setModalVisible] = useState(false);

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
            url: `${api.movies}?order=score`
        }).then(res => {                                          
            setToprated(res.data.results)
        }).catch(err => {
            console.log(err.message)
        });
    }, [])       

    function getListNumber() {        
        if (screens.xxl) {
            return 4
        } else if (screens.xl) {
            return 4
        } else if (screens.lg) {
            return 3
        } else if (screens.md) {
            return 4
        } else if (screens.sm) {
            return 3
        } else if (screens.xs) {
            return 2
        }
    }
    
    function getWidth() {
        if (screens.xxl) {
            return '1400px'            
        } else if (screens.xl) {
            return '1200px'
        } else if (screens.lg) {
            return '1000px'
        } else if (screens.md) {
            return '800px'
        } else if (screens.sm) {
            return '700px'
        } else if(screens.xs) {
            return '600px'
        }
    }

    function getHeight() {
        if (screens.xxl) {
            return '700px'
        } else if (screens.xl) {
            return '600px'
        } else if (screens.lg) {
            return '500px'
        } else if (screens.md) {
            return '400px'
        } else if (screens.sm) {
            return '350px'
        } else if(screens.xs) {
            return '300px'
        }
    }

    function getPadding() {
        if (screens.xxl) {
            return '16px 15%'
        } else if (screens.xl) {
            return '16px 10%'
        } else if (screens.lg) {
            return '16px 8%'
        } else if (screens.md) {
            return '16px 5%'
        } else if (screens.sm) {
            return '16px 5%'
        } else if (screens.xs) {
            return '16px 5%'
        }
    }

    const showModal = () => {        
        setModalVisible(true);
    }

    const hideModal = () => {        
        setModalVisible(false);
    }

    return (
        <div className="home">            
            <div>
                <Carousel className="carousel" autoplay effect="fade" style={{ zIndex: '1' }}>
                    {latest ? latest.slice(0, 4).map(movie => {
                            return (
                                <div>
                                    <div style={{ margin: screens.xs ? '80px 0 0 0' : '0', padding: 0, width: '100%', height: getHeight() }}>
                                        <a href={`/movies/${movie.id}`}>                                            
                                            {movie.landscape ? (
                                                <img src={movie.landscape} alt="landscape" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: '0.2', backgroundColor: '#000' }} />                        
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', opacity: '0.5', backgroundColor: '#000' }} />
                                            )}     
                                        </a>
                                        {/* <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, 0%)', padding: '16px' }}>
                                            <Typography.Title level={2} style={{ color: '#fff' }}>СОНИРХСОН КИНОГОО ХАЙНА УУ</Typography.Title>                                                
                                            <Search placeholder="Кино эсвэл цувралын нэрийг бичнэ үү" onSearch={onSearch} size="large" enterButton />
                                        </div> */}
                                        <div style={{ position: 'absolute', left: screens.xxl ? '15%' : screens.xl ? '10%' : screens.lg ? '8%' : '5%', bottom: '10%', padding: '16px' }}>
                                            <Typography.Title level={2} style={{ marginBottom: 0 }}>{movie.name}</Typography.Title>
                                            <p style={{ color: '#f1f1f1' }}>Найруулагч: Christopher Nolan</p>
                                            <div className="info">
                                                { movie.rating ? <Typography.Text type="secondary">Ангилал: {movie.rating.name} |</Typography.Text> : <></> }
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
                                                    <Button size="large" type="ghost" shape="circle" icon={<CaretRightOutlined style={{ marginLeft: '2px' }} />} onClick={showModal} />
                                                </Tooltip>
                                                <Modal 
                                                    title={movie.name}      
                                                    visible={modalVisible}
                                                    footer={null}                    
                                                    onCancel={hideModal}                                                   
                                                    width={getWidth()}
                                                >
                                                    <div>
                                                        <iframe title={movie.name} width="100%" height={getHeight()} src={movie.trailer} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                                    </div>
                                                </Modal>
                                                <Tooltip title="Таалагдсан">                                                     
                                                    <Button size="large" type="ghost" shape="circle" icon={<LikeOutlined />} />
                                                </Tooltip>
                                                <Tooltip title="Үзсэн">
                                                    <Button size="large" type="ghost" shape="circle" icon={<CheckOutlined style={{ marginLeft: '2px' }}  />} />
                                                </Tooltip>
                                                <Tooltip title="Дараа үзэх">
                                                    <Button size="large" type="ghost" shape="circle" icon={<PlusOutlined />} />
                                                </Tooltip>
                                            </div>      
                                        </div>
                                    </div>
                                </div>
                            );
                        }) : <></>
                    }                
                </Carousel>                                                                             
            </div>     
            <div style={{ padding: getPadding() }}>
                <Row gutter={[16, 16]}>
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
                                    xs: 2,
                                    sm: 3,
                                    md: 4,
                                    lg: 3,
                                    xl: 4,
                                    xxl: 4,
                                }}                                      
                                style={{ marginTop: '16px' }}
                                pagination={{ pageSize: getListNumber() ? getListNumber() : false, size: 'small' }}
                                dataSource={latest ? latest.slice(0, getListNumber() * 3) : undefined}
                                renderItem={item => (
                                    <List.Item>
                                        <MovieCard movie={item} />
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
                                    xs: 2,
                                    sm: 3,
                                    md: 4,
                                    lg: 3,
                                    xl: 4,
                                    xxl: 4,
                                }}                                        
                                style={{ marginTop: '16px' }}
                                pagination={{ pageSize: getListNumber() ? getListNumber() : false, size: 'small' }}
                                dataSource={toprated ? toprated.slice(0, getListNumber() * 3) : undefined}
                                renderItem={item => (
                                    <List.Item>
                                        <MovieCard movie={item} />
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
        </div>
    )
}

export default Home;