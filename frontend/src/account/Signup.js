import React from 'react';
import { Form, Input, Button, Typography, Spin, Row, Col, Divider, message } from 'antd';
import { LoadingOutlined, LockOutlined, MailOutlined, UserOutlined, GoogleOutlined, FacebookFilled } from '@ant-design/icons';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';
import svg from './signup.svg';
import { Redirect } from 'react-router';

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Signup = (props) => {
    const [form] = Form.useForm();    
    
    const onFinish = (values) => {        
        props.onAuth(values.username, values.email, values.password, values.confirm);        
    };

    if (props.token) {
        message.warning("You are already signed in!")
        return <Redirect to="/" />
    }

    if (props.created) {
        message.info("We have sent you an email to activate your account. Please check you e-mail.")
        return <Redirect to="/" />
    }

    if (props.error) {
        const errorMessage = props.error.message.toString()
        if (errorMessage.endsWith('400')) {
            message.error("E-mail is already registered!")
        }    
    }

    return (
        <Row gutter={[16, 16]}>            
            <Col xs={24} sm={12}>
                <div style={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img src={svg} alt="illustration-login" style={{ width: '70%', height: 'auto' }} />
                </div>
            </Col>
            <Col xs={24} sm={12}>
                <div style={{ minHeight: '400px', padding: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>            
                    {props.loading ? (
                        <Spin indicator={loadingIcon} />
                    ) : (
                        <div style={{ width: '500px' }}>
                            <div className="form-title" style={{ textAlign: 'center' }}>
                                <Typography.Title level={2} style={{ background: 'transparent' }}>
                                    Create an new account
                                </Typography.Title>
                                <Typography.Title level={5} style={{ background: 'transparent' }}>
                                    Already registered? <a href="/login" style={{ background: 'transparent' }}>Click here to sign in</a>
                                </Typography.Title>
                            </div>                                                        
                            <Form                            
                                form={form}                                                    
                                name="signup"
                                className="signup"
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
                                        type: 'email',
                                        message: 'The input is not valid E-mail!',
                                    },
                                    {
                                        required: true,
                                        message: 'Please input your E-mail!',
                                    },
                                    ]}
                                >
                                    <Input prefix={<MailOutlined style={{ color: '#a1a1a1' }} />} placeholder="E-mail" />
                                </Form.Item>
                                <Form.Item
                                    label="Username"
                                    name="username"                                                          
                                    rules={[
                                    {
                                        required: true,
                                        message: 'Please input your username!',
                                    },
                                    ]}
                                >
                                    <Input prefix={<UserOutlined style={{ color: '#a1a1a1' }} />} placeholder="Username" />
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
                                    hasFeedback
                                >
                                    <Input.Password prefix={<LockOutlined style={{ color: '#a1a1a1' }} />} placeholder="Password" />
                                </Form.Item>
                                <Form.Item
                                    label="Confirm Password"
                                    name="confirm"                                
                                    dependencies={['password']}
                                    hasFeedback
                                    rules={[
                                    {
                                        required: true,
                                        message: 'Please confirm your password!',
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(rule, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject('The two passwords that you entered do not match!');
                                        },
                                    }),
                                    ]}
                                >
                                    <Input.Password prefix={<LockOutlined style={{ color: '#a1a1a1' }} />} placeholder="Confirm Password" />
                                </Form.Item>                                
                                <Form.Item>
                                    <Button size="large" type="primary" htmlType="submit" style={{ width: '100%' }}>
                                        Sign up
                                    </Button>
                                </Form.Item>
                                <Divider>OR</Divider>
                                <Button size="large" danger type="primary" icon={<GoogleOutlined style={{ fontSize: '18px' }} />} style={{ width: '100%', marginBottom: '16px' }}>
                                    Sign in with Google
                                </Button>
                                <Button size="large" type="primary" icon={<FacebookFilled style={{ fontSize: '18px' }} />} style={{ width: '100%' }}>
                                    Sign in with Facebook
                                </Button>
                            </Form>                    
                        </div>
                    )}  
                </div>   
            </Col>            
        </Row>                              
    );
};

const mapStateToProps = (state) => {
    return {
        loading: state.loading,        
        token: state.token,
        created: state.created,
        error: state.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (username, email, password1, password2) => dispatch(actions.authSignup(username, email, password1, password2))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);