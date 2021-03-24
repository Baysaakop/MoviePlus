import React from 'react';
import { Button, Form, Input, message, Spin, Typography } from 'antd';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';
import { Redirect } from 'react-router';
import { MailOutlined, QuestionCircleOutlined, LoadingOutlined, SendOutlined } from '@ant-design/icons';

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
        message.info("Нууц үг сэргээх мэйл таны и-мэйл хаяг руу илгээгдлээ.")
        return <Redirect to="/" />
    }

    if (props.error) {
        message.error(props.error)        
    }

    return (
       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            {props.start ? (
               <Spin indicator={loadingIcon} />
            ) : (
                <div style={{ border: '1px solid #888', padding: '16px' }}>
                    <Typography.Title level={3} style={{ textAlign: 'center' }}>Нууц үг сэргээх</Typography.Title>
                    <Typography.Text>
                        <QuestionCircleOutlined /> Та системд бүртгэлтэй и-мэйл хаягаа оруулж нууц үгээ сэргээлгэнэ үү.
                    </Typography.Text>
                    <Form
                        form={form}
                        name="password-reset"
                        layout="vertical"
                        style={{ borderRadius: '5px', marginTop: '16px' }}
                        onFinish={onFinish}
                    >
                        <Form.Item 
                            name="email" 
                            label="И-мэйл хаяг"
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
                            <Input prefix={<MailOutlined style={{ color: '#a1a1a1' }} />} placeholder="И-мэйл хаяг" />
                        </Form.Item>
                        <Form.Item>
                            <Button icon={<SendOutlined />} size="large" type="primary" htmlType="submit" style={{ width: '100%' }}>
                                Илгээх
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