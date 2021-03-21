import React from 'react';
import { Button, Form, Input, message, Spin, Typography } from 'antd';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';
import { Redirect } from 'react-router';
import { MailOutlined, QuestionCircleOutlined, LoadingOutlined } from '@ant-design/icons';

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const PasswordReset = (props) => {    
    const [form] = Form.useForm();    

    if (props.token) {
        return <Redirect to="/" />
    }

    function onFinish(values) {        
        props.onReset(values.email);
    }

    if (props.success) {
        message.info("Password reset e-mail has been sent to your e-mail address.")
        return <Redirect to="/" />
    }

    if (props.error) {
        message.error(props.error)        
    }

    return (
       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
            {props.start ? (
               <Spin indicator={loadingIcon} />
            ) : (
                <div>
                    <Typography.Title level={3} style={{ textAlign: 'center' }}>Password Reset</Typography.Title>
                    <Typography.Text>
                        <QuestionCircleOutlined /> Please enter your e-mail address to receive password reset mail.
                    </Typography.Text>
                    <Form
                        form={form}
                        name="password-reset"
                        layout="vertical"
                        style={{ padding: '16px', borderRadius: '5px', marginTop: '8px' }}
                        onFinish={onFinish}
                    >
                        <Form.Item 
                            name="email" 
                            label="E-mail"
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
                        <Form.Item>
                            <Button size="large" type="primary" htmlType="submit" style={{ width: '100%' }}>
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            )}            
       </div>          
    );
};

const mapStateToProps = (state) => {
    return {          
        token: state.token,
        start: state.passwordResetStart,
        success: state.passwordResetSuccess,
        error: state.passwordResetError,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onReset: (email) => dispatch(actions.authPasswordReset(email))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PasswordReset);