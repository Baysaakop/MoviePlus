import { Grid, Breadcrumb, Button, Result, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import api from '../api';
import AccountDetail from './AccountDetail';
import { CheckCircleOutlined, CloseCircleOutlined, LikeOutlined, PlusCircleOutlined, UserOutlined } from '@ant-design/icons';
import Logout from './Logout';

const { useBreakpoint } = Grid;

function Profile (props) {
    const screens = useBreakpoint();
    const [user, setUser] = useState();

    useEffect(() => {        
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
    }, [props.token])

    function getPadding() {
        if (screens.xxl) {
            return '24px 15% 0 15%';
        } else if (screens.xl) {
            return '24px 15% 0 15%';
        } else if ( screens.lg) {
            return '24px 15% 0 15%';
        } else if (screens.md) {
            return '16px 5% 0 5%';
        } else if (screens.sm) {
            return '16px 5% 0 5%';
        } else if (screens.xs) {
            return '16px 5% 0 5%';
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
                        <Tabs.TabPane tab={<span><LikeOutlined style={{ fontSize: '18px' }} />Таалагдсан кино</span>} key="2">
                            <div style={{ padding: '8px' }}>Таалагдсан кино</div>                        
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={<span><CheckCircleOutlined style={{ fontSize: '18px' }} />Үзсэн кино</span>} key="3">
                            <div style={{ padding: '8px' }}>Үзсэн кино</div>        
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={<span><PlusCircleOutlined style={{ fontSize: '18px' }} />Дараа үзэх кино</span>} key="4">
                            <div style={{ padding: '8px' }}>Дараа үзэх кино</div>        
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={<span><CloseCircleOutlined style={{ fontSize: '18px' }} />Гарах</span>} key="5">
                            <div style={{ padding: '8px' }}>
                                <Logout />
                            </div>        
                        </Tabs.TabPane>
                    </Tabs>                
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