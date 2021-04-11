import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';
import { connect } from "react-redux";
import { Grid, Breadcrumb, message, Spin, Typography, Row, Col, Tooltip, Button, Avatar, Statistic, Divider } from 'antd';
import { CommentOutlined, EyeOutlined, FormOutlined, LikeOutlined, LoadingOutlined, ShareAltOutlined, StarFilled, UserAddOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Link } from 'react-router-dom';

const indicator = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const { useBreakpoint } = Grid;

function PostDetail (props) {
    const screens = useBreakpoint();    
    const [user, setUser] = useState();
    const [post, setPost] = useState();  
    const [lastPosts, setLastPosts] = useState();  
    const [loading, setLoading] = useState(false);  

    useEffect(() => {               
        getPost()     
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    function getPost() {
        setLoading(true)
        const id = props.match.params.postID;
        const url = api.reviews + "/" + id + "/";  
        axios({
            method: 'GET',
            url: url,
            headers: {
                'Content-Type': 'application/json'                
            }
        })
        .then(res => {            
            setPost(res.data)
            getLastPosts(res.data.created_by.id)
            setLoading(false)
        })
        .catch(err => {
            message.error("Алдаа гарлаа. Та хуудсаа дахин ачааллуулна уу.")
        })        
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
        })
    }

    function getLastPosts(id) {               
        const url = api.reviews + "?user=" + id  
        console.log(url)
        axios({
            method: 'GET',
            url: url,
            headers: {
                'Content-Type': 'application/json'                
            }
        })
        .then(res => {    
            setLastPosts(res.data.results)
        })
        .catch(err => {
            message.error("Алдаа гарлаа. Та хуудсаа дахин ачааллуулна уу.")
        })    
    }

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
                url: `${api.reviews}/${post.id}/`,
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${props.token}`            
                }
            }).then(res => {                        
                if (res.status === 201 || res.status === 200) {                                               
                    getPost()     
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
            { post ? (
                <div style={{ padding: getPadding() }}>
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to="/">Нүүр</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <Link to="/posts">Нийтлэл</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            {post.title}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <div style={{ marginTop: '16px' }}>
                        <Typography.Title level={1}>{post.title}</Typography.Title>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={24} md={24} lg={18}>
                                <img src={post.thumbnail} alt="thumbnail" style={{ maxHeight: '300px', width: '100%', height: 'auto', objectFit: 'scale-down'  }} />
                                <Typography.Paragraph style={{ marginTop: '16px', padding: '8px' }}>
                                    <div dangerouslySetInnerHTML={{__html: post.content }} />                                            
                                </Typography.Paragraph>                                
                                <Row gutter={[16, 16]}>
                                    <Col xs={24} sm={24} md={18}>
                                        <Tooltip title="Үзсэн">
                                            <Button type="ghost" size="large" icon={<EyeOutlined />} style={{ marginLeft: '8px', border: 0 }}>{formatCount(post.views)}</Button>
                                        </Tooltip>                        
                                        <Tooltip title="Таалагдсан">
                                            <Button type={user && user.profile.review_likes.find(x => x.id === post.id) !== undefined ? "primary" : "ghost"} onClick={like} size="large" icon={<LikeOutlined />} style={{ marginLeft: '8px', border: 0 }}>{formatCount(post.likes)}</Button>
                                        </Tooltip>
                                        <Tooltip title="Сэтгэгдэл">
                                            <Button type="ghost" size="large" icon={<CommentOutlined />} style={{ marginLeft: '8px', border: 0 }}>15</Button>
                                        </Tooltip>
                                        <Tooltip title="Хуваалцах">
                                            <Button type="ghost" size="large" icon={<ShareAltOutlined />} style={{ marginLeft: '8px', border: 0 }}>241</Button>
                                        </Tooltip>
                                    </Col>
                                    <Col xs={24} sm={24} md={6} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                        <Typography.Text type="secondary">Нийтлэсэн: {moment(post.created_at).format("YYYY-MM-DD")}</Typography.Text>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={6}>
                                <Typography.Title level={4}>Нийтлэлч:</Typography.Title>
                                <div style={{ textAlign: 'center' }}>
                                    <Avatar size={128} src={post.created_by.profile.avatar} />
                                    <Typography.Title level={5}>{post.created_by.username}</Typography.Title>
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
                                <Statistic prefix={<StarFilled style={{ color: 'orange' }} />} value={post.score} suffix=" /10" />
                                <Typography.Title level={5} style={{ marginTop: '16px' }}>Киноны мэдээлэл:</Typography.Title>
                                {post.movie ? (
                                    <Link to={`/movies/${post.movie.id}`}>
                                        <Row gutter={[8, 8]}>
                                            <Col span={12}>
                                                <img alt="poster" src={post.movie.poster} style={{ width: '100%', height: 'auto' }} />
                                            </Col>
                                            <Col span={12}>
                                                <Typography.Text style={{ fontSize: '16px' }}>{post.movie.name}</Typography.Text>   
                                                <br />                                             
                                                <Typography.Text>Ангилал: {post.movie.rating ? post.movie.rating.name : '----'}</Typography.Text>
                                                <br />
                                                <Typography.Text>Хугацаа: {post.movie.duration}</Typography.Text>
                                                <br />
                                                <Typography.Text>Нээлт: {moment(post.movie.releasedate).format("YYYY")}</Typography.Text>
                                                <br />
                                                <Typography.Text>Жанр: 
                                                    {post.movie.genre.map(g => {
                                                        return (                                                
                                                            <span> {g.name} |</span>
                                                        )                                            
                                                    })}
                                                </Typography.Text>                                                
                                                <br />
                                                <Typography.Text>Үнэлгээ: <StarFilled style={{ color: 'orange' }} /> {post.movie.score / 10}</Typography.Text>
                                            </Col>
                                        </Row>                                        
                                    </Link>
                                ) : ( 
                                    <Typography.Text>-- Байхгүй --</Typography.Text>
                                )}
                                <Typography.Title level={5} style={{ marginTop: '16px' }}>Өмнөх нийтлэлүүд:</Typography.Title>     
                                {lastPosts ? lastPosts.slice(0, 3).map(item => {                                    
                                    return (
                                        item.id !== post.id ?
                                        <Link to={`/posts/${item.id}`} style={{ marginTop: '8px' }}>                                            
                                            <img src={item.thumbnail} alt="thumbnail" style={{ width: '100%', height: 'auto' }} />                                
                                            <Typography.Title level={5}>{item.title}</Typography.Title>
                                            <Typography.Paragraph ellipsis={{ rows: 3 }} style={{ marginTop: '8px' }}>
                                                <div dangerouslySetInnerHTML={{__html: item.content }} />                                            
                                            </Typography.Paragraph>
                                        </Link> : <></>      
                                    )                        
                                }) : <></>}                           
                            </Col>
                        </Row>
                    </div>
                </div>
            ) : loading ? (
                <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Spin indicator={indicator} />
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

export default connect(mapStateToProps)(PostDetail);