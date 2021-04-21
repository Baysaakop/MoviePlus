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
        message.info("Системд нэвтэрлээ.")
        return <Redirect to="/" />
    }

    if (props.error) {
        const errorMessage = props.error.message.toString()
        if (errorMessage.endsWith('400')) {
            message.error("Authentication failed! Username or password is incorrect.")
        }  
    }

    function authFacebook (response) {
        console.log(response)
        props.onAuthFacebook(response.accessToken)
    }

    function authGoogle (response) {
        console.log(response)
        props.onAuthGoogle(response.accessToken)
    }

    return (
        <Row gutter={[16, 16]} style={{ marginTop: '80px', width: '100%', padding: '5% 15%' }}>            
            <Col xs={24} sm={12}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>            
                    {props.loading ? (
                        <Spin indicator={loadingIcon} />
                    ) : (
                        <div style={{ border: '1px solid #888', padding: '16px 0px' }}>
                            <div className="form-title" style={{ textAlign: 'center' }}>
                                <Typography.Title level={2} style={{ background: 'transparent' }}>
                                    Системд нэвтрэх  
                                </Typography.Title>
                                <Typography.Title level={5} style={{ background: 'transparent' }}>
                                    Та бүртгүүлэх бол <a href="/signup" style={{ background: 'transparent' }}>энд дарж бүртгүүлнэ үү</a>
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
                                    label="И-мэйл хаяг"                    
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Та и-мэйл хаягаа оруулна уу!',
                                        },
                                        {
                                            type: 'email',
                                            message: 'Та зөв и-мэйл хаяг оруулна уу!',
                                        }
                                    ]}
                                >
                                    <Input prefix={<MailOutlined style={{ color: '#555' }} />} placeholder="И-мэйл хаяг" />
                                </Form.Item>

                                <Form.Item         
                                    label="Нууц үг"                             
                                    name="password"
                                    rules={[
                                    {
                                        required: true,
                                        message: 'Та нууц үгээ оруулна уу!',
                                    },
                                    ]}
                                >
                                    <Input.Password prefix={<LockOutlined style={{ color: '#555' }} />} placeholder="Нууц үг" />
                                </Form.Item>
                                <a href="/password/reset">Нууц үг мартсан?</a>
                                <Form.Item style={{ marginTop: '16px' }}>
                                    <Button size="large" type="primary" htmlType="submit" style={{ width: '100%' }}>
                                        Нэвтрэх
                                    </Button>
                                </Form.Item>
                                <Divider>эсвэл</Divider>                                
                                <GoogleLogin                                                                                                            
                                    clientId="296268545765-t0tu72rhuo4g2rpia6b8qirt08i6mea2.apps.googleusercontent.com"
                                    buttonText=" Sign in with Google"
                                    render={renderProps => (
                                        <Button size="large" danger type="primary" onClick={renderProps.onClick} icon={<GoogleOutlined style={{ fontSize: '18px' }} />} style={{ width: '100%', marginBottom: '16px' }}>
                                            Sign in with Google
                                        </Button>
                                    )}
                                    onSuccess={authGoogle} 
                                    onFailure={authGoogle}                                   
                                />
                                <FacebookLogin
                                    cssClass="login-facebook"
                                    icon={<FacebookFilled />}
                                    textButton=" Sign in with Facebook"
                                    appId="461902185229960"
                                    fields="name,email"                                    
                                    callback={authFacebook}                                    
                                />                                
                            </Form>                    
                        </div>
                    )}  
                </div>   
            </Col>
            <Col xs={24} sm={12}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
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
        onAuthFacebook: (access_token) => dispatch(actions.authFacebook(access_token)),
        onAuthGoogle: (access_token) => dispatch(actions.authGoogle(access_token)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);