import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';
import { connect } from "react-redux";
import { Grid, Breadcrumb, message, Typography, Row, Col, Tooltip, Button, Avatar, Statistic, Divider } from 'antd';
import { CommentOutlined, DislikeOutlined, FormOutlined, LikeOutlined, ShareAltOutlined, StarFilled, UserAddOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Link } from 'react-router-dom';
import ReviewComment from './ReviewComment';

const { useBreakpoint } = Grid;

function ReviewDetail (props) {
    const screens = useBreakpoint();    
    const [user, setUser] = useState();
    const [review, setReview] = useState();  
    // const [lastPosts, setLastPosts] = useState();  

    useEffect(() => {               
        getUser()
        getReview()     
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    function getUser() {
        if (props.token && props.token !== null) {
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

    function getReview() {
        const id = props.match.params.reviewID;
        const url = api.reviews + "/" + id + "/";  
        axios({
            method: 'GET',
            url: url,
            headers: {
                'Content-Type': 'application/json'                
            }
        })
        .then(res => {
            console.log(res.data)
            setReview(res.data)
        })
        .catch(err => {
            message.error("Алдаа гарлаа. Та хуудсаа дахин ачааллуулна уу.")
        })      
    }

    // function getLastPosts(id) {               
    //     const url = api.reviews + "?user=" + id  
    //     console.log(url)
    //     axios({
    //         method: 'GET',
    //         url: url,
    //         headers: {
    //             'Content-Type': 'application/json'                
    //         }
    //     })
    //     .then(res => {    
    //         setLastPosts(res.data.results)
    //     })
    //     .catch(err => {
    //         message.error("Алдаа гарлаа. Та хуудсаа дахин ачааллуулна уу.")
    //     })    
    // }

    function formatCount(count) {
        if (count >= 1000000) {
            return (count / 1000000).toFixed(1).toString() + "M";
        } else if (count >= 1000) {
            return (count / 1000).toFixed(1).toString() + "K";
        } else {
            return count.toString();
        }
    }

    function getPadding() {
        if (screens.xxl) {
            return '32px 15%'
        } else if (screens.xl) {
            return '32px 10%'
        } else if (screens.lg) {
            return '32px 8%'
        } else if (screens.md) {
            return '32px 5%'
        } else if (screens.sm) {
            return '32px 5%'
        } else if (screens.xs) {
            return '32px 5%'
        }
    }

    function like () {        
        if (user !== null && user !== undefined) {
            const data = {            
                token: props.token,
                like: true
            }            
            axios({
                method: 'PUT',
                url: `${api.reviews}/${review.id}/`,
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${props.token}`            
                }
            }).then(res => {                        
                if (res.status === 201 || res.status === 200) {                                               
                    getReview()     
                }             
            }).catch(err => {   
                message.error("Амжилтгүй боллоо."); 
                console.log(err);            
            })       
        } else {
            message.warning("Та эхлээд системд нэвтрэх шаардлагатай.")            
        }     
    }

    function dislike () {        
        if (user !== null && user !== undefined) {
            const data = {            
                token: props.token,
                dislike: true
            }            
            axios({
                method: 'PUT',
                url: `${api.reviews}/${review.id}/`,
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${props.token}`            
                }
            }).then(res => {                        
                if (res.status === 201 || res.status === 200) {                                               
                    getReview()     
                }             
            }).catch(err => {   
                message.error("Амжилтгүй боллоо."); 
                console.log(err);            
            })       
        } else {
            message.warning("Та эхлээд системд нэвтрэх шаардлагатай.")            
        }     
    }

    return (
        <div style={{ marginTop: '80px', minHeight: '80vh' }}>
            { review ? (
                <div style={{ padding: getPadding() }}>
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to="/">Нүүр</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <Link to="/reviews">Нийтлэл</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            {review.title}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <div style={{ marginTop: '16px' }}>
                        <Typography.Title level={1}>{review.title}</Typography.Title>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={24} md={24} lg={18}>
                                <img src={review.thumbnail} alt="thumbnail" style={{ maxHeight: '300px', width: '100%', height: 'auto', objectFit: 'scale-down'  }} />
                                <Typography.Paragraph style={{ marginTop: '16px', padding: '8px' }}>
                                    <div dangerouslySetInnerHTML={{__html: review.content }} />                                            
                                </Typography.Paragraph>                                                               
                                <Row gutter={[16, 16]}>
                                    <Col xs={24} sm={24} md={12}>                    
                                        <Tooltip title="Таалагдсан">
                                            <Button type={user && review.likes.filter(x => x === user.id).length > 0 ? "primary" : "ghost"} onClick={like} size="large" icon={<LikeOutlined />} style={{ marginLeft: '8px' }}>{formatCount(review.likes.length)}</Button>
                                        </Tooltip>
                                        <Tooltip title="Таалагдаагүй">
                                            <Button danger type={user && review.dislikes.filter(x => x === user.id).length > 0 ? "primary" : "ghost"} onClick={dislike} size="large" icon={<DislikeOutlined />} style={{ marginLeft: '8px' }}>{formatCount(review.dislikes.length)}</Button>
                                        </Tooltip>
                                        <Tooltip title="Сэтгэгдэл">
                                            <Button type="ghost" size="large" icon={<CommentOutlined />} style={{ marginLeft: '8px' }}>{formatCount(review.comments.length)}</Button>
                                        </Tooltip>
                                        <Tooltip title="Хуваалцах">
                                            <Button type="ghost" size="large" icon={<ShareAltOutlined />} style={{ marginLeft: '8px' }}>34</Button>
                                        </Tooltip>
                                    </Col>
                                    <Col xs={24} sm={24} md={12} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                        <Typography.Text type="secondary" style={{ marginRight: '16px' }}>Уншсан: {formatCount(review.views)}</Typography.Text>
                                        <Typography.Text type="secondary">Нийтлэгдсэн: {moment(review.created_at).format("YYYY-MM-DD")}</Typography.Text>
                                    </Col>                                    
                                </Row>
                                <div style={{ marginTop: '24px' }}>
                                    <Typography.Title level={5}>Сэтгэгдэл</Typography.Title>
                                    <ReviewComment token={props.token} user={user} reviewID={review.id} />
                                </div>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={6}>
                                <Typography.Title level={4}>Нийтлэлч:</Typography.Title>
                                <div style={{ textAlign: 'center' }}>
                                    <Avatar size={128} src={review.user.profile.avatar} />
                                    <Typography.Title level={5}>{review.user.username}</Typography.Title>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                                    <div>
                                        <LikeOutlined style={{ fontSize: '24px' }} />
                                        <br/>
                                        {formatCount(12462)}
                                    </div>
                                    <div>
                                        <UserAddOutlined style={{ fontSize: '24px' }} />
                                        <br/>
                                        {formatCount(3564)}
                                    </div>
                                    <div>
                                        <FormOutlined style={{ fontSize: '24px' }} />
                                        <br/>
                                        {formatCount(56)}
                                    </div>
                                </div>
                                <Divider />
                                <Typography.Title level={5} style={{ marginTop: '16px' }}>Өгсөн оноо:</Typography.Title>
                                <Statistic prefix={<StarFilled style={{ color: 'orange' }} />} value={review.score} suffix=" /10" />
                                <Typography.Title level={5} style={{ marginTop: '16px' }}>Киноны мэдээлэл:</Typography.Title>                                
                            </Col>
                        </Row>
                    </div>
                </div>
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

export default connect(mapStateToProps)(ReviewDetail);