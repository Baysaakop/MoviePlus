import React from 'react';
import { Button, Form, Input, Typography, Spin, message } from 'antd';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';
import { Redirect } from 'react-router';
import { LockOutlined, QuestionCircleOutlined, LoadingOutlined } from '@ant-design/icons';

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const PasswordResetConfirm = (props) => {    
    const [form] = Form.useForm();    

    if (props.token) {
        return <Redirect to="/" />
    }

    function onFinish(values) {        
        const uid = props.match.params.uid;
        const token = props.match.params.token;
        props.onResetConfirm(uid, token, values.new_password, values.re_new_password);        
    }

    if (props.success) {
        message.info("Your password has been reset with the new password successfully.")
        return <Redirect to="/login" />
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
                    <Typography.Title level={3} style={{ textAlign: 'center' }}>Password Reset Confirm</Typography.Title>
                    <Typography.Text>
                        <QuestionCircleOutlined /> Password reset e-mail link is confirmed, therefore this resets the user's password.
                    </Typography.Text>
                    <Form
                        form={form}
                        name="password-reset"
                        layout="vertical"
                        style={{ padding: '16px', borderRadius: '5px', marginTop: '8px' }}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            label="New Password"
                            name="new_password"                                
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
                            name="re_new_password"                                
                            dependencies={['new_password']}
                            hasFeedback
                            rules={[
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            ({ getFieldValue }) => ({
                                validator(rule, value) {
                                if (!value || getFieldValue('new_password') === value) {
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
        start: state.passwordResetConfirmStart,
        success: state.passwordResetConfirmSuccess,
        error: state.passwordResetConfirmError,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onResetConfirm: (uid, token, new_password, re_new_password) => dispatch(actions.authPasswordResetConfirm(uid, token, new_password, re_new_password))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PasswordResetConfirm);