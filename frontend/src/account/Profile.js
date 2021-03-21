import { Grid, Breadcrumb, Button, Result, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import api from '../api';
import AccountDetail from './AccountDetail';

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

    return (
        <div>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <a href="/">Home</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    Profile
                </Breadcrumb.Item>
            </Breadcrumb>
            <div className="container" style={{ margin: '16px 0' }}>
            {user ? (
                <Tabs tabPosition={screens.xs ? "top" : "left"} style={{ minHeight: '80vh', padding: '8px' }}>
                    <Tabs.TabPane tab="Account details" key="1">
                        <div style={{ padding: '8px' }}>
                            <AccountDetail user={user ? user : undefined} token={props.token} />
                        </div>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="User activity" key="2">
                        <div style={{ padding: '8px' }}>User activity</div>                        
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Data" key="3">
                        <div style={{ padding: '8px' }}>Data</div>        
                    </Tabs.TabPane>
                </Tabs>                
            ) : (
                <Result
                    status="403"
                    title="403"
                    subTitle="Sorry, you are not authenticated. Please log in first."
                    extra={<Button type="primary" href="/login">Go to login page</Button>}
                />
            )}
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