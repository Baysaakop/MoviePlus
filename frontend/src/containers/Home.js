import { Grid, Typography, Row, Col } from 'antd';
import React, { useState } from 'react';
import { DesktopOutlined, ReadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
// import MovieTrendTable from '../movie/MovieTrendTable';
import CountUp from 'react-countup';
import MoviesRow from './MoviesRow';

const { useBreakpoint } = Grid;

function Home (props) {    
    const screens = useBreakpoint();
    // const [latest, setLatest] = useState();
    // const [toprated, setToprated] = useState();
    // const [posts, setPosts] = useState();
    const [modalVisible, setModalVisible] = useState(false);

    // useEffect(() => {
    //     axios({
    //         method: 'GET',
    //         url: `${api.movies}/`
    //     }).then(res => {                                     
    //         setLatest(res.data.results)
    //     }).catch(err => {
    //         console.log(err.message)
    //     });        
    //     axios({
    //         method: 'GET',
    //         url: `${api.movies}?order=score`
    //     }).then(res => {                                          
    //         setToprated(res.data.results)
    //     }).catch(err => {
    //         console.log(err.message)
    //     });
    // }, [])       

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
                {/* <Carousel className="carousel" autoplay effect="fade" style={{ zIndex: '1' }}>
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
                                        <div style={{ position: 'absolute', left: screens.xxl ? '15%' : screens.xl ? '10%' : screens.lg ? '8%' : '5%', bottom: '10%', padding: '16px' }}>
                                            <Typography.Title level={1} style={{ marginBottom: 0 }}>{movie.name}</Typography.Title>                                                                                                                                  
                                            <Typography.Text>Үнэлгээ:</Typography.Text>
                                            <span>
                                            <Typography.Title level={2} style={{ margin: 0 }}>{parseFloat(movie.score / 10)} <span style={{ fontSize: '20px' }}>/ 10</span></Typography.Title>                                        
                                            </span>
                                            <Rate disabled allowHalf defaultValue={movie.score / 20} />
                                            <br />                                            
                                            <div className="actions" style={{ marginTop: '16px' }}>                                        
                                                <Tooltip title="Трэйлэр үзэх">
                                                    <Button size="large" type="ghost" shape="circle" icon={<CaretRightOutlined style={{ marginLeft: '2px' }} />} onClick={showModal} style={{ marginRight: '8px' }} />
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
                                                    <Button size="large" type="ghost" shape="circle" icon={<LikeOutlined />}  style={{ marginRight: '8px' }} />
                                                </Tooltip>
                                                <Tooltip title="Үзсэн">
                                                    <Button size="large" type="ghost" shape="circle" icon={<CheckOutlined />}  style={{ marginRight: '8px' }} />
                                                </Tooltip>
                                                <Tooltip title="Дараа үзэх">
                                                    <Button size="large" type="ghost" shape="circle" icon={<PlusOutlined />}  style={{ marginRight: '8px' }} />
                                                </Tooltip>
                                            </div>      
                                        </div>
                                    </div>
                                </div>
                            );
                        }) : <></>
                    }                
                </Carousel>                                                                              */}
            </div>     
            <div style={{ padding: getPadding(), marginTop: '64px' }}>   
                <div style={{ margin: '16px 0' }}>
                    <MoviesRow title="ШИНЭЭР НЭМЭГДСЭН" type="created_at" />
                </div>
                <div style={{ margin: '16px 0' }}>
                    <MoviesRow title="ӨНДӨР ҮНЭЛГЭЭТЭЙ" type="score" />
                </div>
            </div>
            {/* <div style={{ padding: getPadding() }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={18}>
                        <div className="movies" style={{ marginTop: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ borderLeft: '12px solid #8e44ad' }}>                                    
                                    <Typography.Title level={4} style={{ margin: '0 0 0 8px' }}>КИНО</Typography.Title>
                                </div>
                                <div>
                                    <Button type="ghost" href="/movies">
                                        Бүгд
                                    </Button>
                                </div>
                            </div>
                            <Tabs defaultActiveKey="1">
                                <Tabs.TabPane tab="Одоо гарч буй" key="1">                                    
                                    <List                        
                                        grid={{
                                            gutter: 16,
                                            xs: 2,
                                            sm: 2,
                                            md: 3,
                                            lg: 4,
                                            xl: 3,
                                            xxl: 4,
                                        }}                                      
                                        style={{ marginTop: '16px' }}
                                        pagination={{ pageSize: getListNumber() ? getListNumber() : false, size: 'small' }}
                                        dataSource={latest ? latest.slice(0, getListNumber() * 3) : undefined}
                                        renderItem={item => (
                                            <List.Item>
                                                <MovieCard3 movie={item} />
                                            </List.Item>
                                        )}
                                    /> 
                                </Tabs.TabPane>
                                <Tabs.TabPane tab="Удахгүй гарах" key="2">
                                    <List                        
                                        grid={{
                                            gutter: 16,
                                            xs: 2,
                                            sm: 2,
                                            md: 3,
                                            lg: 4,
                                            xl: 3,
                                            xxl: 4,
                                        }}                                      
                                        style={{ marginTop: '16px' }}
                                        pagination={{ pageSize: getListNumber() ? getListNumber() : false, size: 'small' }}
                                        dataSource={latest ? latest.slice(0, getListNumber() * 3) : undefined}
                                        renderItem={item => (
                                            <List.Item>
                                                <MovieCard3 movie={item} />
                                            </List.Item>
                                        )}
                                    /> 
                                </Tabs.TabPane>           
                                <Tabs.TabPane tab="Шинээр нэмэгдсэн" key="3">
                                    <List                        
                                        grid={{
                                            gutter: 16,
                                            xs: 2,
                                            sm: 2,
                                            md: 3,
                                            lg: 4,
                                            xl: 3,
                                            xxl: 4,
                                        }}                                      
                                        style={{ marginTop: '16px' }}
                                        pagination={{ pageSize: getListNumber() ? getListNumber() : false, size: 'small' }}
                                        dataSource={latest ? latest.slice(0, getListNumber() * 3) : undefined}
                                        renderItem={item => (
                                            <List.Item>
                                                <MovieCard3 movie={item} />
                                            </List.Item>
                                        )}
                                    /> 
                                </Tabs.TabPane>                    
                                <Tabs.TabPane tab="Өндөр үнэлгээтэй" key="4">
                                    <List                        
                                        grid={{
                                            gutter: 16,
                                            xs: 2,
                                            sm: 2,
                                            md: 3,
                                            lg: 4,
                                            xl: 3,
                                            xxl: 4,
                                        }}                                        
                                        style={{ marginTop: '16px' }}
                                        pagination={{ pageSize: getListNumber() ? getListNumber() : false, size: 'small' }}
                                        dataSource={toprated ? toprated.slice(0, getListNumber() * 3) : undefined}
                                        renderItem={item => (
                                            <List.Item>
                                                <MovieCard3 movie={item} />
                                            </List.Item>
                                        )}
                                    /> 
                                </Tabs.TabPane>
                            </Tabs>                            
                        </div>     
                        <div className="series" style={{ marginTop: '32px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ borderLeft: '12px solid #8e44ad' }}>
                                    <Typography.Title level={4} style={{ margin: '0 0 0 8px' }}>ТВ ЦУВРАЛ</Typography.Title>
                                </div>
                                <div>
                                    <Button type="ghost" href="/movies">
                                        Бүгд
                                    </Button>
                                </div>
                            </div>
                            <Tabs defaultActiveKey="1">
                                <Tabs.TabPane tab="Одоо гарч буй" key="1">
                                    <List                        
                                        grid={{
                                            gutter: 16,
                                            xs: 2,
                                            sm: 2,
                                            md: 3,
                                            lg: 4,
                                            xl: 3,
                                            xxl: 4,
                                        }}                                      
                                        style={{ marginTop: '16px' }}
                                        pagination={{ pageSize: getListNumber() ? getListNumber() : false, size: 'small' }}
                                        dataSource={latest ? latest.slice(0, getListNumber() * 3) : undefined}
                                        renderItem={item => (
                                            <List.Item>
                                                <MovieCard3 movie={item} />
                                            </List.Item>
                                        )}
                                    /> 
                                </Tabs.TabPane>
                                <Tabs.TabPane tab="Удахгүй гарах" key="2">
                                    <List                        
                                        grid={{
                                            gutter: 16,
                                            xs: 2,
                                            sm: 2,
                                            md: 3,
                                            lg: 4,
                                            xl: 3,
                                            xxl: 4,
                                        }}                                      
                                        style={{ marginTop: '16px' }}
                                        pagination={{ pageSize: getListNumber() ? getListNumber() : false, size: 'small' }}
                                        dataSource={latest ? latest.slice(0, getListNumber() * 3) : undefined}
                                        renderItem={item => (
                                            <List.Item>
                                                <MovieCard3 movie={item} />
                                            </List.Item>
                                        )}
                                    /> 
                                </Tabs.TabPane>           
                                <Tabs.TabPane tab="Шинээр нэмэгдсэн" key="3">
                                    <List                        
                                        grid={{
                                            gutter: 16,
                                            xs: 2,
                                            sm: 2,
                                            md: 3,
                                            lg: 4,
                                            xl: 3,
                                            xxl: 4,
                                        }}                                      
                                        style={{ marginTop: '16px' }}
                                        pagination={{ pageSize: getListNumber() ? getListNumber() : false, size: 'small' }}
                                        dataSource={latest ? latest.slice(0, getListNumber() * 3) : undefined}
                                        renderItem={item => (
                                            <List.Item>
                                                <MovieCard3 movie={item} />
                                            </List.Item>
                                        )}
                                    /> 
                                </Tabs.TabPane>                    
                                <Tabs.TabPane tab="Өндөр үнэлгээтэй" key="4">
                                    <List                        
                                        grid={{
                                            gutter: 16,
                                            xs: 2,
                                            sm: 2,
                                            md: 3,
                                            lg: 4,
                                            xl: 3,
                                            xxl: 4,
                                        }}                                        
                                        style={{ marginTop: '16px' }}
                                        pagination={{ pageSize: getListNumber() ? getListNumber() : false, size: 'small' }}
                                        dataSource={toprated ? toprated.slice(0, getListNumber() * 3) : undefined}
                                        renderItem={item => (
                                            <List.Item>
                                                <MovieCard3 movie={item} />
                                            </List.Item>
                                        )}
                                    /> 
                                </Tabs.TabPane>
                            </Tabs>                            
                        </div>                   
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={6}>
                        <div style={{ marginTop: '16px', padding: '16px' }}>
                            <Typography.Title level={2}> Реклам зар сурталчилгаа</Typography.Title>
                        </div>                                                
                    </Col>
                </Row>                      
            </div>           */}
            <div style={{ background: '#161b22', padding: getPadding(), margin: '48px 0' }}>
                <Row gutter={[16, 16]} style={{ padding: '32px 0' }}>
                    <Col xs={12} sm={12} md={6} style={{ textAlign: 'center' }}>
                        <VideoCameraOutlined style={{ fontSize: '32px' }} />
                        <Typography.Title level={4}>
                            <CountUp end={253} delay={5} /> Кино                            
                        </Typography.Title>
                    </Col>
                    <Col xs={12} sm={12} md={6} style={{ textAlign: 'center' }}>
                        <DesktopOutlined style={{ fontSize: '32px' }} />                        
                        <Typography.Title level={4}>
                            <CountUp end={46} delay={5} /> Цуврал                            
                        </Typography.Title>
                    </Col>
                    <Col xs={12} sm={12} md={6} style={{ textAlign: 'center' }}>
                        <UserOutlined style={{ fontSize: '32px' }} />
                        <Typography.Title level={4}>
                            <CountUp end={1252} delay={5} /> У/Бүтээлч                            
                        </Typography.Title>                        
                    </Col>
                    <Col xs={12} sm={12} md={6} style={{ textAlign: 'center' }}>
                        <ReadOutlined style={{ fontSize: '32px' }} />                        
                        <Typography.Title level={4}>
                            <CountUp end={495} delay={5} /> Нийтлэл                           
                        </Typography.Title>
                    </Col>
                </Row>     
            </div>            
            <div style={{ padding: getPadding(), margin: '48px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <Typography.Title level={4} style={{ margin: 0 }}>АШИГЛАХ ЗААВАР</Typography.Title>
                    </div>
                </div>                
            </div>
        </div>
    )
}

export default Home;