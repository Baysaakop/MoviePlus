import { Grid, Button, Result, Tabs, Typography, Spin, message, Row, Col, Avatar, Progress } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import api from '../api';
import AccountDetail from './AccountDetail';
import { CheckCircleOutlined, CloseCircleOutlined, PlusCircleOutlined, SettingOutlined, UserOutlined, LoadingOutlined, HeartOutlined, MailOutlined, PhoneOutlined, CrownOutlined } from '@ant-design/icons';
import Logout from './Logout';
import Moderator from './Moderator';
import MoviesLiked from '../movie/MoviesLiked';

const indicator = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const { useBreakpoint } = Grid;

function Profile (props) {
    const screens = useBreakpoint()
    const [loading, setLoading] = useState(false)
    const [likesCount, setLikesCount] = useState(0)
    const [checksCount, setChecksCount] = useState(0)
    const [watchlistsCount, setWatchlistsCount] = useState(0)
    const [user, setUser] = useState()

    useEffect(() => {        
        if (props.token && props.token !== null) {
            setLoading(true)
            axios({
                method: 'GET',
                url: api.profile,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${props.token}`
                }
            }).then(res => {               
                console.log(res.data)             
                setUser(res.data)                
                setLoading(false)
            }).catch(err => {                
                console.log(err) 
                message.error("Алдаа гарлаа. Хуудсыг дахин ачааллана уу.")    
                setLoading(false)           
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

    return (
        <div style={{ marginTop: '80px', minHeight: '80vh' }}>
            <div style={{ padding: getPadding() }}>                
                <div className="container">
                {user ? (
                    <>
                        <div style={{ margin: '24px 0 48px 0', padding: '16px', background: '#161b22', borderRadius: '4px' }}> 
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={24} md={24} lg={6} xl={4}>
                                    <Avatar size={144} src={user.profile.avatar} />
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={8} xl={6}>
                                    <Typography.Title level={2}>{user.username}</Typography.Title>
                                    <Typography.Text style={{ display: 'block', fontSize: '16px' }}><MailOutlined /> И-мэйл хаяг: {user.email}</Typography.Text>
                                    <Typography.Text style={{ display: 'block', fontSize: '16px' }}><PhoneOutlined /> Утасны дугаар: {user.profile.phone_number}</Typography.Text>
                                    <Typography.Text style={{ display: 'block', fontSize: '16px' }}><CrownOutlined /> Цол: Шинэ хэрэглэгч</Typography.Text>
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={10} xl={7} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                        <div>
                                            <Progress type="circle" percent={68} width={80} strokeColor="#fadb14" trailColor="#1b262c" strokeWidth={6} />
                                        </div>
                                        <div style={{ marginLeft: '8px', padding: '8px', background: '#161b22', borderRadius: '4px' }}>
                                            <Typography.Text style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                                Дундаж үнэлгээ
                                                <br />
                                                (Кино)                                                                                                
                                            </Typography.Text>                  
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={10} xl={7} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                        <div>
                                            <Progress type="circle" percent={53} width={80} strokeColor="#fadb14" trailColor="#1b262c" strokeWidth={6} />
                                        </div>
                                        <div style={{ marginLeft: '8px', padding: '8px', background: '#161b22', borderRadius: '4px' }}>
                                            <Typography.Text style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                                Дундаж үнэлгээ
                                                <br />
                                                (Цуврал)                                                                                                
                                            </Typography.Text>                  
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <Tabs tabPosition={screens.xs ? "top" : "left"}>
                            <Tabs.TabPane tab={<span><UserOutlined style={{ fontSize: '18px' }} />Хэрэглэгчийн мэдээлэл</span>} key="1">
                                <div style={{ padding: '8px' }}>
                                    <AccountDetail user={user ? user : undefined} token={props.token} />
                                </div>
                            </Tabs.TabPane>                        
                            <Tabs.TabPane tab={<span><HeartOutlined style={{ fontSize: '18px' }} />Таалагдсан кино</span>} key="2">
                                <div style={{ padding: '8px' }}>
                                    <Typography.Title level={5}>Таалагдсан кино ({likesCount})</Typography.Title>
                                    <MoviesLiked token={props.token} state="like" user={user} setCount={(count) => setLikesCount(count)} />                 
                                </div>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab={<span><CheckCircleOutlined style={{ fontSize: '18px' }} />Үзсэн кино</span>} key="3">                            
                                <div style={{ padding: '8px' }}>
                                    <Typography.Title level={5}>Үзсэн кино ({checksCount})</Typography.Title>
                                    <MoviesLiked token={props.token} state="check" user={user} setCount={(count) => setChecksCount(count)} />                 
                                </div>       
                            </Tabs.TabPane>
                            <Tabs.TabPane tab={<span><PlusCircleOutlined style={{ fontSize: '18px' }} />Дараа үзэх кино</span>} key="4">                              
                                <div style={{ padding: '8px' }}>
                                    <Typography.Title level={5}>Дараа үзэх кино ({watchlistsCount})</Typography.Title>
                                    <MoviesLiked token={props.token} state="watchlist" user={user} setCount={(count) => setWatchlistsCount(count)} />                 
                                </div>  
                            </Tabs.TabPane>                        
                            { user.profile.role === "1" || user.profile.role === "2" ? (
                                <>
                                    <Tabs.TabPane tab={<span><SettingOutlined style={{ fontSize: '18px' }} />Модератор цонх</span>} key="6">
                                        <Moderator />      
                                    </Tabs.TabPane>
                                </>
                            ) : (
                                <>
                                </>
                            )} 
                            <Tabs.TabPane tab={<span><CloseCircleOutlined style={{ fontSize: '18px' }} />Гарах</span>} key="5">
                                <div style={{ padding: '8px' }}>
                                    <Logout />
                                </div>        
                            </Tabs.TabPane>
                        </Tabs>   
                    </>             
                ) : loading ? (
                    <div style={{ width: '100%', height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Spin indicator={indicator} tip="Ачааллаж байна..." />
                    </div>
                ) : (
                    <Result
                        status="403"
                        title="403"
                        subTitle="Уучлаарай, та эхлээд системд нэвтэрнэ үү."
                        extra={<Button type="primary" href="/login">Нэвтрэх цонх руу шилжих</Button>}
                    />
                )}
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

export default connect(mapStateToProps)(Profile)