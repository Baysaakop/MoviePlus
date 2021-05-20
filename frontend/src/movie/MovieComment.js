import { Form, Input, Avatar, message, Comment, Button, Typography, Tooltip, Popconfirm, Rate, Divider } from 'antd';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../api';
import { DeleteOutlined, DislikeOutlined, EditOutlined, LikeOutlined } from '@ant-design/icons';
import moment from 'moment';

const { TextArea } = Input;

function MovieComment (props) {
    const [form] = Form.useForm()
    const [comments, setComments] = useState()
    const [edit, setEdit] = useState()
    const [editValue, setEditValue] = useState()

    useEffect(() => {
        getComments()               
    }, [props.user, props.movieID]) // eslint-disable-line react-hooks/exhaustive-deps    

    function getComments() {
        axios({
            method: 'GET',
            url: `${api.comments}?movie=${props.movieID}`,
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
        if (props.token && values.comment) {
            axios({
                method: 'POST',
                url: `${api.comments}/`,
                data: {
                    token: props.token,
                    movie: props.movieID,                    
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
            { comments ? comments.map(comment => {
                    return (
                        <Comment
                            actions={[
                                <Tooltip key="comment-basic-like" title="Таалагдсан">
                                    <Button type={props.user && comment.likes.filter(x => x === props.user.id).length > 0 ? "primary" : "ghost"} size="small" icon={<LikeOutlined />} style={{ border: 0, marginRight: '4px' }} onClick={() => onLike(comment.id)}> {comment.likes.length}</Button>
                                </Tooltip>,
                                <Tooltip key="comment-basic-dislike" title="Таалагдаагүй">
                                    <Button danger type={props.user && comment.dislikes.filter(x => x === props.user.id).length > 0 ? "primary" : "ghost"} size="small" icon={<DislikeOutlined />} style={{ border: 0, marginRight: '4px' }} onClick={() => onDislike(comment.id)}> {comment.dislikes.length}</Button>
                                </Tooltip>,
                                props.user ? (
                                <>
                                    { props.user.id === comment.user.id ? (
                                    <Tooltip key="comment-basic-dislike" title="Засах">  
                                        <Button type="primary" size="small" icon={<EditOutlined />} style={{ border: 0, marginRight: '4px' }} onClick={() => onEdit(comment.id)}> 
                                        {edit && edit === comment.id ? 'Болих' : 'Засах'}
                                        </Button>
                                    </Tooltip>
                                    ) : <></>}          
                                    { props.user.id === comment.user.id || props.user.profile.role < 3 ? (
                                    <Popconfirm title="Устгах уу?" onConfirm={() => onDelete(comment.id)}>                                    
                                        <Button danger type="primary" size="small" icon={<DeleteOutlined />} style={{ border: 0, marginRight: '4px' }}> Устгах</Button>                                    
                                    </Popconfirm>                    
                                    ) : <></>}                                          
                                </>
                                ) : (
                                    <></>
                                )
                            ]}
                            author={<Typography.Text style={{ fontWeight: 'bold' }}>{comment.user.username}</Typography.Text>}
                            avatar={
                                comment.user.profile.avatar ? (                                        
                                    <Avatar src={comment.user.profile.avatar} /> 
                                ) : (                                         
                                    <Avatar style={{ backgroundColor: '#8e44ad', color: '#fff', fontWeight: 'bold' }}>{comment.user.username.slice(0, 1)}</Avatar>                                      
                                )
                            }
                            content={
                                edit && edit === comment.id ? (
                                    <>
                                        <TextArea defaultValue={comment.comment} value={editValue} onChange={onChange} rows={4} />                                                
                                        <Button size="small" type="primary" style={{ marginTop: '8px' }} onClick={onEnd}>Нийтлэх</Button>
                                    </>
                                ) : (
                                    <Typography.Paragraph style={{ margin: 0 }}>
                                        {comment.comment}
                                    </Typography.Paragraph>
                                )
                            }
                            datetime={
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>     
                                    <div>                                                                                                                                                
                                    { comment.score ? (
                                        <>                                        
                                            <Rate disabled allowHalf value={comment.score / 2} style={{ fontSize: '14px' }} />
                                            <Typography.Text style={{ fontSize: '12px' }}> - {comment.score} / 10</Typography.Text>
                                            {/* <StarFilled style={{ color: '#fadb14' }}></StarFilled>
                                            <Typography.Text style={{ fontSize: '14px' }}> {comment.score} / 10</Typography.Text> */}
                                        </>                       
                                    ) : <>
                                            <Typography.Text>- - - Үнэлгээ өгөөгүй - - -</Typography.Text>
                                        </>
                                    }
                                    </div>
                                    <Tooltip title={moment(comment.created_at).format("YYYY-MM-DD HH:mm:ss")}>
                                        <span style={{ marginLeft: '16px' }}>- {moment(comment.created_at).fromNow()}</span>
                                    </Tooltip>
                                </div>
                            }                                                        
                        />
                    )
                }) : <></>
            }
            { props.user ? (    
                <>        
                    <Divider />
                    <Typography.Title level={5}>Сэтгэгдэл үлдээх</Typography.Title>                    
                    <Comment
                        avatar={
                            props.user.profile.avatar ? (                                        
                                <Avatar src={props.user.profile.avatar} /> 
                            ) : (                                         
                                <Avatar style={{ backgroundColor: '#8e44ad', color: '#fff', fontWeight: 'bold' }}>{props.user.username.slice(0, 1)}</Avatar>                                      
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

export default MovieComment;