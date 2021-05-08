import React from 'react';
import { Button, Result } from 'antd';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';
import { Redirect } from 'react-router';
import { CloseCircleOutlined } from '@ant-design/icons';

const Logout = (props) => {    
    
    const onClick = () => {                
        props.logout();               
    };

    if (!props.token) {
        return <Redirect to="/" />
    }

    return (
       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #888', padding: '16px 0px', height: '40vh' }}>
           <Result
                status="warning"
                title="Та системээс гарахдаа итгэлтэй байна уу?"
                extra={
                    <Button danger size="large" type="primary" icon={<CloseCircleOutlined />} onClick={onClick}>
                        Гарах
                    </Button>
                }
            />
       </div>          
    );
};

const mapStateToProps = (state) => {
    return {          
        token: state.token
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(actions.logout())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Logout);