import { Grid, Typography, Row, Col } from 'antd';
import React, { useState, useEffect } from 'react';
import { DesktopOutlined,  ReadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import CountUp from 'react-countup';
import MoviesRow from './MoviesRow';
import axios from 'axios';
import api from '../api';
import { connect } from 'react-redux';
import HomeCarousel from './HomeCarousel';
import HomeReviews from './HomeReviews';
// import HomeArtists from './HomeArtists';

const { useBreakpoint } = Grid;

function Home (props) {    
    const screens = useBreakpoint()
    const [user, setUser] = useState()
    const [movieCount, setMovieCount] = useState()

    useEffect(() => {        
        if (props.token && props.token !== null) {            
            axios({
                method: 'GET',
                url: api.profile,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${props.token}`
                }
            }).then(res => {                                          
                setUser(res.data)                                
            }).catch(err => {                
                console.log(err)                                     
            })                    
        }
    }, [props.token])     

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

    function getMovieCount(count) {
        setMovieCount(count)
    }

    return (
        <div className="home">            
            <div>
                <HomeCarousel />
            </div>     
            <div style={{ padding: getPadding(), marginTop: '16px' }}>   
                <Row gutter={[32, 16]}>
                    <Col xs={24} sm={24} md={24} lg={24}>
                        <div style={{ margin: '24px 0' }}>
                            <MoviesRow title="ШИНЭЭР НЭМЭГДСЭН" type="created_at" user={user} getMovieCount={getMovieCount} />
                        </div>
                        <div style={{ margin: '24px 0' }}>
                            <MoviesRow title="ӨНДӨР ҮНЭЛГЭЭТЭЙ" type="score" user={user} />
                        </div>
                        <div style={{ margin: '24px 0' }}>
                            <MoviesRow title="ШИНЭЭР НЭЭЛТЭЭ ХИЙСЭН" type="releasedate" user={user} />
                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={6}>
                        {/* <div style={{ margin: '16px 0' }}>
                            <div style={{ borderLeft: '12px solid #8e44ad' }}>                                    
                                <Typography.Title level={4} style={{ margin: '0 0 0 8px' }}>УРАН БҮТЭЭЛЧИД</Typography.Title>
                            </div>
                        </div>
                        <HomeArtists /> */}
                    </Col>
                </Row>
            </div>
            <div style={{ padding: getPadding(), margin: '48px 0', backgroundImage: 'linear-gradient(-225deg, #FF3CAC 0%, #562B7C 52%, #2B86C5 100%)' }}>
                <Row gutter={[16, 16]} style={{ padding: '24px 0' }}>
                    <Col xs={12} sm={12} md={6} style={{ textAlign: 'center' }}>
                        <VideoCameraOutlined style={{ fontSize: '32px' }} />
                        <Typography.Title level={4}>
                            <CountUp end={movieCount ? movieCount : 0} delay={5} /> Кино                            
                        </Typography.Title>
                    </Col>
                    <Col xs={12} sm={12} md={6} style={{ textAlign: 'center' }}>
                        <DesktopOutlined style={{ fontSize: '32px' }} />                        
                        <Typography.Title level={4}>
                            <CountUp end={0} delay={5} /> Цуврал                            
                        </Typography.Title>
                    </Col>
                    <Col xs={12} sm={12} md={6} style={{ textAlign: 'center' }}>
                        <UserOutlined style={{ fontSize: '32px' }} />
                        <Typography.Title level={4}>
                            <CountUp end={24} delay={5} /> У/Бүтээлч                            
                        </Typography.Title>                        
                    </Col>
                    <Col xs={12} sm={12} md={6} style={{ textAlign: 'center' }}>
                        <ReadOutlined style={{ fontSize: '32px' }} />                        
                        <Typography.Title level={4}>
                            <CountUp end={3} delay={5} /> Нийтлэл                           
                        </Typography.Title>
                    </Col>
                </Row>     
            </div>  
            <div style={{ padding: getPadding(), margin: '48px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ borderLeft: '12px solid #8e44ad' }}> 
                        <Typography.Title level={4} style={{ margin: '0 0 0 8px' }}>НИЙТЛЭЛ</Typography.Title>
                    </div>                    
                </div>    
                <div style={{ marginTop: '16px' }}>
                    <HomeReviews />
                </div>
            </div>                                                          
        </div>
    )
}

const mapStateToProps = state => {
    return {
        token: state.token
    }
}

export default connect(mapStateToProps)(Home)