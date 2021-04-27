import { Grid, Breadcrumb, Button, Result, Tabs, Typography, Spin, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import api from '../api';
import AccountDetail from './AccountDetail';
import { CheckCircleOutlined, CloseCircleOutlined, PlusCircleOutlined, SettingOutlined, UserOutlined, LoadingOutlined, FormOutlined, HeartOutlined } from '@ant-design/icons';
import Logout from './Logout';
import Moderator from './Moderator';
import MoviesLiked from '../movie/MoviesLiked';
import ReviewCreate from '../reviews/ReviewCreate';
import ReviewUpdate from '../reviews/ReviewUpdate';

const indicator = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const { useBreakpoint } = Grid;

function Profile (props) {
    const screens = useBreakpoint();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState();

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
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <a href="/">Нүүр</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Хэрэглэгч
                    </Breadcrumb.Item>
                </Breadcrumb>
                <div className="container" style={{ margin: '16px 0' }}>
                {user ? (
                    <Tabs tabPosition={screens.xs ? "top" : "left"}>
                        <Tabs.TabPane tab={<span><UserOutlined style={{ fontSize: '18px' }} />Хэрэглэгчийн мэдээлэл</span>} key="1">
                            <div style={{ padding: '8px' }}>
                                <AccountDetail user={user ? user : undefined} token={props.token} />
                            </div>
                        </Tabs.TabPane>                        
                        <Tabs.TabPane tab={<span><HeartOutlined style={{ fontSize: '18px' }} />Таалагдсан кино</span>} key="2">
                            <div style={{ padding: '8px' }}>
                                <Typography.Title level={5}>Таалагдсан кино</Typography.Title>
                                <MoviesLiked token={props.token} state="like" user={user} />                 
                            </div>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={<span><CheckCircleOutlined style={{ fontSize: '18px' }} />Үзсэн кино</span>} key="3">                            
                            <div style={{ padding: '8px' }}>
                                <Typography.Title level={5}>Үзсэн кино</Typography.Title>
                                <MoviesLiked token={props.token} state="check" user={user} />                 
                            </div>       
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={<span><PlusCircleOutlined style={{ fontSize: '18px' }} />Дараа үзэх кино</span>} key="4">                              
                            <div style={{ padding: '8px' }}>
                                <Typography.Title level={5}>Дараа үзэх кино</Typography.Title>
                                <MoviesLiked token={props.token} state="watchlist" user={user} />                 
                            </div>  
                        </Tabs.TabPane>                        
                        { user.profile.role === "1" || user.profile.role === "2" ? (
                            <>
                                <Tabs.TabPane tab={<span><SettingOutlined style={{ fontSize: '18px' }} />Модератор цонх</span>} key="6">
                                    <Moderator />      
                                </Tabs.TabPane>
                                <Tabs.TabPane tab={<span><FormOutlined style={{ fontSize: '18px' }} />Нийтлэл оруулах</span>} key="7">
                                    <ReviewCreate token={props.token} />
                                </Tabs.TabPane>
                                <Tabs.TabPane tab={<span><FormOutlined style={{ fontSize: '18px' }} />Нийтлэл засах</span>} key="8">
                                    <ReviewUpdate token={props.token} userID={user.id} />
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