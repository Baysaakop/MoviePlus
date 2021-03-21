import React from 'react';
import { Form, Input, Button, Typography, Spin, Row, Col, Divider, message } from 'antd';
import { FacebookFilled, GoogleOutlined, LoadingOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';
import svg from './signin.svg';
import { Redirect } from 'react-router-dom';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import './Login.css';

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Login = (props) => {
    const [form] = Form.useForm();    
    
    const onFinish = (values) => {                
        props.onAuth(values.email, values.password);               
    };

    if (props.token) {
        message.info("Signed in.")
        return <Redirect to="/" />
    }

    if (props.error) {
        const errorMessage = props.error.message.toString()
        if (errorMessage.endsWith('400')) {
            message.error("Authentication failed! Username or password is incorrect.")
        }  
    }

    function authFacebook (response) {
        props.onAuthFacebook(response.accessToken)
    }

    function authGoogle (response) {
        console.log(response)
    }

    return (
        <Row gutter={[16, 16]}>            
            <Col xs={24} sm={12}>
                <div style={{ height: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>            
                    {props.loading ? (
                        <Spin indicator={loadingIcon} />
                    ) : (
                        <div style={{ width: '500px' }}>
                            <div className="form-title" style={{ textAlign: 'center' }}>
                                <Typography.Title level={2} style={{ background: 'transparent' }}>
                                    Sign in with your account   
                                </Typography.Title>
                                <Typography.Title level={5} style={{ background: 'transparent' }}>
                                    Or <a href="/signup" style={{ background: 'transparent' }}>create an account</a>
                                </Typography.Title>
                            </div>                                                        
                            <Form                            
                                form={form}                                                    
                                name="login"
                                className="login"
                                layout="vertical"
                                initialValues={{
                                    remember: true,
                                }}
                                onFinish={onFinish}   
                                style={{ borderRadius: '5px', padding: '16px' }}                     
                            >
                                <Form.Item            
                                    label="E-mail"                    
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your email!',
                                        },
                                        {
                                            type: 'email',
                                            message: 'The input is not valid E-mail!',
                                        }
                                    ]}
                                >
                                    <Input prefix={<MailOutlined style={{ color: '#555' }} />} placeholder="Email" />
                                </Form.Item>

                                <Form.Item         
                                    label="Password"                             
                                    name="password"
                                    rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                    ]}
                                >
                                    <Input.Password prefix={<LockOutlined style={{ color: '#555' }} />} placeholder="Password" />
                                </Form.Item>
                                <a href="/password/reset">Forgot your password?</a>
                                <Form.Item style={{ marginTop: '16px' }}>
                                    <Button size="large" type="primary" htmlType="submit" style={{ width: '100%' }}>
                                        Sign in
                                    </Button>
                                </Form.Item>
                                <Divider>OR</Divider>                                
                                <GoogleLogin                                                                                                            
                                    clientId="<Google Client ID>"
                                    buttonText=" Sign in with Google"
                                    render={renderProps => (
                                        <Button size="large" danger type="primary" onClick={renderProps.onClick} icon={<GoogleOutlined style={{ fontSize: '18px' }} />} style={{ width: '100%', marginBottom: '16px' }}>
                                            Sign in with Google
                                        </Button>
                                    )}
                                    onSuccess={authGoogle}                                    
                                />
                                <FacebookLogin
                                    cssClass="login-facebook"
                                    icon={<FacebookFilled />}
                                    textButton=" Sign in with Facebook"
                                    appId="265092655117778"
                                    fields="name,email,picture"                                    
                                    callback={authFacebook}                                    
                                />                                
                            </Form>                    
                        </div>
                    )}  
                </div>   
            </Col>
            <Col xs={24} sm={12}>
                <div style={{ height: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img src={svg} alt="illustration-login" style={{ width: '70%', height: 'auto' }} />
                </div>
            </Col>
        </Row>             
    );
};

const mapStateToProps = (state) => {
    return {
        loading: state.loading,        
        token: state.token,
        error: state.error,
        created: state.created
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password) => dispatch(actions.authLogin(email, password)),
        onAuthFacebook: (access_token) => dispatch(actions.authFacebook(access_token))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);