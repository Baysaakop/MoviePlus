import { Grid, Button, Col, message, Row, Spin, Tabs, Tooltip, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../api';
import { UserAddOutlined, EyeOutlined, LoadingOutlined, LikeOutlined } from '@ant-design/icons';
import '../movie/MovieDetail.css';
import { connect } from "react-redux";
import Filmography from './Filmography';

const { useBreakpoint } = Grid;

const spinIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function ArtistDetail (props) {
    const screens = useBreakpoint();  
    const [user, setUser] = useState();
    const [artist, setArtist] = useState();            

    useEffect(() => {               
        getArtist()     
        getUser()   
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    function getHeight() {
        if (screens.xxl) {
            return 400
        } else if (screens.xl) {
            return 300
        } else if (screens.lg) {
            return 200
        } else if (screens.md) {
            return 150
        } else if (screens.sm) {
            return 100
        } else if(screens.xs) {
            return 100
        }
    }

    function getArtist() {
        const id = props.match.params.artistID;
        const url = api.artists + "/" + id + "/";  
        axios({
            method: 'GET',
            url: url,
            headers: {
                'Content-Type': 'application/json'                
            }
        })
        .then(res => {
            console.log(res.data)
            setArtist(res.data);
        })
        .catch(err => {
            message.error("Алдаа гарлаа. Та хуудсаа дахин ачааллуулна уу.")
        })        
    }

    function getUser() {        
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
        } else {
            setUser(undefined)
        }        
    }
    
    function formatCount(count) {
        if (count >= 1000000) {
            return (count / 1000000).toFixed(1).toString() + "M";
        } else if (count >= 1000) {
            return (count / 1000).toFixed(1).toString() + "K";
        } else {
            return count.toString();
        }
    }

    function like () {
        if (user !== null && user !== undefined) {
            const data = {            
                token: props.token,
                like: true
            }            
            axios({
                method: 'PUT',
                url: `${api.artists}/${artist.id}/`,
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${props.token}`            
                }
            }).then(res => {                        
                if (res.status === 201 || res.status === 200) {                                               
                    getArtist()                                          
                    getUser()  
                }             
            }).catch(err => {   
                message.error("Амжилтгүй боллоо."); 
                console.log(err);            
            })           
        } else {
            message.warning("Та эхлээд системд нэвтрэх шаардлагатай.")            
        }   
    }

    function follow () {
        if (user !== null && user !== undefined) {
            const data = {            
                token: props.token,
                follow: true
            }            
            axios({
                method: 'PUT',
                url: `${api.artists}/${artist.id}/`,
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${props.token}`            
                }
            }).then(res => {                        
                if (res.status === 201 || res.status === 200) {     
                    getArtist()                                          
                    getUser()     
                }             
            }).catch(err => {   
                message.error("Амжилтгүй боллоо."); 
                console.log(err);            
            })           
        } else {
            message.warning("Та эхлээд системд нэвтрэх шаардлагатай.")            
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

    return (
        <div style={{ marginTop: '80px', minHeight: '80vh' }}>
            { artist ? (
                <div>
                    <div style={{ height: `${getHeight()}px` }}>
                        <div style={{ width: '100%', height: '100%' }} />                       
                    </div>
                    <div style={{ padding: getPadding() }} className="detail">
                        <Row gutter={[16, 16]} style={{ marginTop: '-20%', paddingBottom: '40px' }}>
                            <Col xs={24} sm={8} md={8} lg={8} xl={6} style={{ padding: '0 32px' }}>
                                <img src={artist.avatar} alt="avatar" style={{ width: '100%', height: 'auto', borderRadius: '5px', boxShadow: '0 6px 16px -8px rgb(0 0 0 / 32%), 0 9px 28px 0 rgb(0 0 0 / 20%), 0 12px 48px 16px rgb(0 0 0 / 12%)' }} />
                                <Row gutter={[8, 8]} style={{ marginTop: '8px', width: '100%' }}>
                                    <Col span={8} style={{ textAlign: 'center' }}>
                                        <EyeOutlined style={{ fontSize: '20px' }} />
                                        <br></br>
                                        <Typography.Text>{formatCount(artist.views)}</Typography.Text>
                                    </Col>
                                    <Col span={8} style={{ textAlign: 'center' }}>
                                        <LikeOutlined style={{ fontSize: '20px' }} />
                                        <br></br>
                                        <Typography.Text>{formatCount(artist.likes)}</Typography.Text>
                                    </Col>
                                    <Col span={8} style={{ textAlign: 'center' }}>
                                        <UserAddOutlined style={{ fontSize: '20px' }} />
                                        <br></br>
                                        <Typography.Text>{formatCount(artist.follows)}</Typography.Text>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={24} sm={16} md={16} lg={16} xl={18}>
                                <div style={{ borderRadius: '5px', height: '100%' }}>
                                    <Typography.Title level={2} style={{ marginBottom: '0' }}>{artist.name}</Typography.Title>
                                    <div className="info">                                        
                                        {/* <Typography.Text type="secondary"> Хугацаа: {artist.duration} мин |</Typography.Text> */}
                                        <Typography.Text type="secondary"> Төрсөн өдөр: {artist.birthday}</Typography.Text>
                                    </div>
                                    <div className="occupation" style={{ marginTop: '8px' }}>
                                        {artist.occupation.map(o => {
                                            return (                                                
                                                <Typography.Text>{o.name} | </Typography.Text>
                                            )                                            
                                        })}
                                    </div>                                    
                                    <div className="actions" style={{ marginTop: '16px' }}>         
                                        <Tooltip title="Таалагдсан">
                                            <Button size="large" type="ghost" shape="circle" icon={<LikeOutlined />} onClick={like} />
                                        </Tooltip>       
                                        <Tooltip title="Дагах">
                                            <Button size="large" type="ghost" shape="circle" icon={<UserAddOutlined style={{ marginLeft: '2px' }} />} onClick={follow} />
                                        </Tooltip>                                                                
                                    </div>                                                          
                                    <div className="infotabs">
                                        <Tabs defaultActiveKey="1">
                                            <Tabs.TabPane tab="Танилцуулга" key="1">
                                                <Typography.Title level={5}>Танилцуулга</Typography.Title>
                                                <Typography.Paragraph>{artist.biography}</Typography.Paragraph>
                                            </Tabs.TabPane>
                                            <Tabs.TabPane tab="Уран бүтээлүүд" key="2">                                                
                                                <Filmography id={artist.id} occupation={artist.occupation[0].id} />       
                                            </Tabs.TabPane>                                            
                                        </Tabs>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <Spin indicator={spinIcon} />
                </div>
            )}                        
        </div>
    )
}

const mapStateToProps = state => {
    return {
        token: state.token
    }
}

export default connect(mapStateToProps)(ArtistDetail);