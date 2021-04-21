import { Form, Input, Avatar, message, Comment, Button, Typography, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../api';
import { connect } from 'react-redux';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';

const { TextArea } = Input;

function MovieComment (props) {
    const [form] = Form.useForm()
    const [user, setUser] = useState()
    const [comments, setComments] = useState()

    useEffect(() => {
        getComments()
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
            message.error("Алдаа гарлаа. Хуудсыг дахин ачааллана уу.")            
        })                
    }, [props.token, props.id])

    function getComments() {
        if (props.token) {
            axios({
                method: 'GET',
                url: `${api.comments}?movie=${props.id}`,
                headers: {
                    'Content-Type': 'application/json'                
                }
            })
            .then(res => {                
                console.log(res)
                setComments(res.data.results)
            })
            .catch(err => {
                message.error("Алдаа гарлаа. Та хуудсаа дахин ачааллуулна уу.")
            })
        }
    }

    function onFinish(values) {
        if (props.token && props.id && values.comment) {
            axios({
                method: 'POST',
                url: `${api.comments}/`,
                data: {
                    movie: props.id,
                    token: props.token,
                    comment: values.comment
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${props.token}`
                }
            })
            .then(res => {             
                if (res.status === 201 || res.status === 204) {                                  
                    console.log(res)           
                    getComments()       
                }
            })
            .catch(err => {
                console.log(err)
                message.error("Дахин оролдоно уу.")
            })
        } else {
            message.warning("Та эхлээд системд нэвтрэх шаардлагатай.")            
        }        
    }

    return (
        <div>
            { comments ? (
                comments.map(comment => {
                    return (
                        <Comment
                            author={<Typography.Text>{comment.user.username}</Typography.Text>}
                            avatar={
                                comment.user.profile.avatar ? (
                                    <Avatar src={comment.user.profile.avatar} alt={comment.user.username} />
                                ) : (
                                    <Avatar icon={<UserOutlined />} alt={comment.user.username} />
                                )
                            }
                            content={
                                <Typography.Paragraph>
                                    {comment.comment}
                                </Typography.Paragraph>
                            }
                            datetime={
                                <Tooltip title={moment().format("YYYY-MM-DD HH:mm:ss")}>
                                    <span>{moment().fromNow()}</span>
                                </Tooltip>
                            }                                                        
                        />
                    )
                })
            ) : (
                <>
                </>
            )}
            { user ? (    
                <>        
                    <Comment
                        avatar={
                            user.profile.avatar ? (
                                <Avatar src={user.profile.avatar} alt={user.username} />
                            ) : (
                                <Avatar icon={<UserOutlined />} alt={user.username} />
                            )
                        }
                        content={
                            <Form form={form} onFinish={onFinish}>
                                <Form.Item name="comment">
                                    <TextArea rows={4} />
                                </Form.Item>
                                <Form.Item>
                                    <Button htmlType="submit" type="primary">
                                        Нийтлэх
                                    </Button>
                                </Form.Item>
                            </Form>
                        }
                    />
                </>
            ) : (
                <></>
            )}
        </div>
    )
}

const mapStateToProps = state => {
    return {
        token: state.token
    }
}

export default connect(mapStateToProps)(MovieComment);