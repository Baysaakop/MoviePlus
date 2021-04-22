import { Form, Input, Avatar, message, Comment, Button, Typography, Tooltip, Row, Col, Popconfirm } from 'antd';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../api';
import { connect } from 'react-redux';
import { DeleteOutlined, DislikeOutlined, EditOutlined, LikeOutlined, StarFilled, UserOutlined } from '@ant-design/icons';
import moment from 'moment';

const { TextArea } = Input;

function MovieComment (props) {
    const [form] = Form.useForm()
    const [user, setUser] = useState()
    const [comments, setComments] = useState()
    const [edit, setEdit] = useState()
    const [editValue, setEditValue] = useState()

    useEffect(() => {
        getComments()
        getUser()                      
    }, [props.token, props.id]) // eslint-disable-line react-hooks/exhaustive-deps    

    function getUser() {
        if (props.token) {
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
        } 
    }

    function getComments() {
        axios({
            method: 'GET',
            url: `${api.comments}?movie=${props.id}`,
            headers: {
                'Content-Type': 'application/json'                
            }
        })
        .then(res => {                
            setComments(res.data.results)
        })
        .catch(err => {
            message.error("Алдаа гарлаа. Та хуудсаа дахин ачааллуулна уу.")
        })
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

    function onEdit(comment_id) {
        if (comment_id === edit) {
            setEdit(undefined)
        } else {
            setEdit(comment_id)
        }
    }

    function onChange(e) {        
        setEditValue(e.target.value)
    }

    function onEnd(e) {             
        if (props.token && edit) {
            axios({
                method: 'PUT',
                url: `${api.comments}/${edit}/`,
                data: {                    
                    token: props.token,
                    comment: editValue
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${props.token}`
                }
            })
            .then(res => {             
                if (res.status === 200) {                  
                    setEdit(undefined)  
                    setEditValue(undefined)                    
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

    function onDelete(comment_id) {
        if (props.token) {
            axios({
                method: 'DELETE',
                url: `${api.comments}/${comment_id}/`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${props.token}`
                }
            })
            .then(res => {             
                if (res.status === 204) {                                        
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
                                </Tooltip>,
                                user && user.id === comment.user.id ? (
                                <>
                                    <Tooltip key="comment-basic-dislike" title="Засах">  
                                        <Button type="ghost" size="small" icon={<EditOutlined />} style={{ border: 0, marginRight: '4px' }} onClick={() => onEdit(comment.id)}> 
                                        {edit && edit === comment.id ? 'Болих' : 'Засах'}
                                        </Button>
                                    </Tooltip>,                                    
                                    <Popconfirm title="Устгах уу?" onConfirm={() => onDelete(comment.id)}>                                    
                                        <Button danger type="ghost" size="small" icon={<DeleteOutlined />} style={{ border: 0, marginRight: '4px' }}> Устгах</Button>                                    
                                    </Popconfirm>
                                </>
                                ) : (
                                    <></>
                                )
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
                                    <Col span={18}>
                                        {edit && edit === comment.id ? (
                                            <>
                                                <TextArea defaultValue={comment.comment} value={editValue} onChange={onChange} rows={4} />                                                
                                                <Button size="small" type="primary" style={{ marginTop: '8px' }} onClick={onEnd}>Нийтлэх</Button>
                                            </>
                                        ) : (
                                            <Typography.Paragraph style={{ margin: 0 }}>
                                                {comment.comment}
                                            </Typography.Paragraph>
                                        )}
                                    </Col>
                                    <Col span={6} style={{ textAlign: 'end' }}>
                                        <span>
                                            <StarFilled style={{ color: 'yellow', fontSize: '20px' }} />
                                            <Typography.Text style={{ fontSize: '24px', fontWeight: 'bold' }}> {comment.score}</Typography.Text>
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