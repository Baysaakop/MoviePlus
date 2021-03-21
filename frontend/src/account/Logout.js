import React from 'react';
import { Button, Result } from 'antd';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';
import { Redirect } from 'react-router';

const Logout = (props) => {    
    
    const onClick = () => {                
        props.logout();               
    };

    if (!props.token) {
        return <Redirect to="/" />
    }

    return (
       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
           <Result
                status="warning"
                title="Are you sure to sign out?"
                extra={
                    <Button danger size="large" type="primary" onClick={onClick}>
                        Sign Out
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