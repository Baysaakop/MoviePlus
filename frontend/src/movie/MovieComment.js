import { Form, Input, Avatar, message, Comment, Button, Typography, Tooltip, Row, Col, InputNumber } from 'antd';
import React, { createElement, useEffect, useState } from 'react';
import axios from 'axios';
import api from '../api';
import { connect } from 'react-redux';
import { DislikeOutlined, LikeOutlined, StarFilled, UserOutlined } from '@ant-design/icons';
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
                    form.resetFields()
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

    function onLike(comment_id) {
        if (props.token) {
            axios({
                method: 'PUT',
                url: `${api.comments}/${comment_id}/`,
                data: {                    
                    token: props.token,
                    like: true
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${props.token}`
                }
            })
            .then(res => {             
                if (res.status === 200) {                                  
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

    function onDislike(comment_id) {
        if (props.token) {
            axios({
                method: 'PUT',
                url: `${api.comments}/${comment_id}/`,
                data: {                    
                    token: props.token,
                    dislike: true
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${props.token}`
                }
            })
            .then(res => {             
                if (res.status === 200) {                                  
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
                            actions={[
                                <Tooltip key="comment-basic-like" title="Таалагдсан">
                                    <Button type={user && comment.likes.filter(x => x === user.id).length > 0 ? "primary" : "ghost"} size="small" icon={<LikeOutlined />} style={{ border: 0, marginRight: '4px' }} onClick={() => onLike(comment.id)}> {comment.likes.length}</Button>
                                </Tooltip>,
                                <Tooltip key="comment-basic-dislike" title="Таалагдаагүй">
                                    <Button danger type={user && comment.dislikes.filter(x => x === user.id).length > 0 ? "primary" : "ghost"} size="small" icon={<DislikeOutlined />} style={{ border: 0, marginRight: '4px' }} onClick={() => onDislike(comment.id)}> {comment.dislikes.length}</Button>
                                </Tooltip>
                            ]}
                            author={<Typography.Text>{comment.user.username}</Typography.Text>}
                            avatar={
                                comment.user.profile.avatar ? (
                                    <Avatar src={comment.user.profile.avatar} alt={comment.user.username} />
                                ) : (
                                    <Avatar icon={<UserOutlined />} alt={comment.user.username} />
                                )
                            }
                            content={
                                <Row gutter={[8, 8]}>
                                    <Col span={20}>
                                        <Typography.Paragraph style={{ margin: 0 }}>
                                            {comment.comment}
                                        </Typography.Paragraph>
                                    </Col>
                                    <Col span={4} style={{ textAlign: 'end' }}>
                                        <span>
                                            <StarFilled style={{ color: 'yellow', fontSize: '20px' }} />
                                            <Typography.Text style={{ fontSize: '24px', fontWeight: 'bold' }}> 7</Typography.Text>
                                            <Typography.Text style={{ fontSize: '18px', fontWeight: 'bold' }}> / 10</Typography.Text>
                                        </span>                                        
                                    </Col>                                
                                </Row>
                            }
                            datetime={
                                <Tooltip title={moment(comment.created_at).format("YYYY-MM-DD HH:mm:ss")}>
                                    <span>{moment(comment.created_at).fromNow()}</span>
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
                            <Form layout="vertical" form={form} onFinish={onFinish}>
                                {/* <Form.Item name="title" label="Гарчиг">
                                    <Input />
                                </Form.Item>
                                <Form.Item name="score" label="Үнэлгээ">
                                    <InputNumber />
                                </Form.Item> */}
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