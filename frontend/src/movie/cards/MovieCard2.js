import { Grid, Button, Card, Tooltip, message, Typography, Rate } from 'antd';
import React, { useEffect, useState } from 'react';
import './MovieCard2.css';
import { CheckOutlined, PlusOutlined, HeartOutlined, StarOutlined, PlayCircleOutlined, StarFilled } from '@ant-design/icons';
import blank from './blank.jpg'
import axios from 'axios';
import api from '../../api';
import { connect } from "react-redux";
import Modal from 'antd/lib/modal/Modal';
import { Link } from 'react-router-dom';

const { useBreakpoint } = Grid;

function MovieCard2 (props) {
    const screens = useBreakpoint();       
    const [likes, setLikes] = useState()    
    const [checks, setChecks] = useState()    
    const [watchlists, setWatchlists] = useState()    
    const [scores, setScores] = useState()    
    const [rating, setRating] = useState()
    const [trailerModalVisible, setTrailerModalVisible] = useState(false);
    const [rateModalVisible, setRateModalVisible] = useState(false);

    useEffect(() => {              
        setLikes(props.movie.likes)
        setChecks(props.movie.checks)
        setWatchlists(props.movie.watchlists)
        setScores(props.movie.scores)
        setRating(props.movie.score)    
    }, [props.movie, props.user]); // eslint-disable-line react-hooks/exhaustive-deps    

    function onLike () {                
        if (props.token && props.movie) {
            axios({
                method: 'PUT',
                url: `${api.films}/${props.movie.id}/`,
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
                    setLikes(res.data.likes)
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

    function onCheck () {
        if (props.token && props.movie) {
            axios({
                method: 'PUT',
                url: `${api.films}/${props.movie.id}/`,
                data: {                    
                    token: props.token,
                    check: true
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${props.token}`
                }
            })
            .then(res => {              
                if (res.status === 200) {
                    setChecks(res.data.checks)
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

    function onWatchlist () {
        if (props.token && props.movie) {
            axios({
                method: 'PUT',
                url: `${api.films}/${props.movie.id}/`,
                data: {                    
                    token: props.token,
                    watchlist: true
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${props.token}`
                }
            })
            .then(res => {              
                if (res.status === 200) {
                    setWatchlists(res.data.watchlists)
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

    function onScore (value) {                  
        if (props.token && props.movie) {
            axios({
                method: 'PUT',
                url: `${api.films}/${props.movie.id}/`,
                data: {                    
                    token: props.token,
                    score: value
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${props.token}`
                }
            })
            .then(res => {              
                if (res.status === 200) {                    
                    setRating(res.data.score)                 
                    setScores(res.data.scores)
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

    function getWidth() {
        if (screens.xxl) {
            return 1200            
        } else if (screens.xl) {
            return 1000
        } else if (screens.lg) {
            return 700
        } else if (screens.md) {
            return 600
        } else if (screens.sm) {
            return 500
        } else if(screens.xs) {
            return 400
        } else {
            return 400
        }       
    }

    function getHeight() {
        if (screens.xxl) {
            return 600
        } else if (screens.xl) {
            return 500
        } else if (screens.lg) {
            return 350
        } else if (screens.md) {
            return 300
        } else if (screens.sm) {
            return 250
        } else if(screens.xs) {
            return 200
        } else {
            return 200
        }       
    }

    return (
        <div>
            <Card                             
                className="moviecard2"
                hoverable                                        
            >                
                <div className="container">                    
                    <img className="poster" src={props.movie.poster ? props.movie.poster : blank} alt="poster" />                                        
                    <div className="content">
                        <div className="top">
                            <div className="actions">
                                <Tooltip title="Таалагдсан">
                                    <Button className="like" size="middle" type={props.user && likes && likes.filter(x => x === props.user.id).length > 0 ? "primary" : "ghost"} shape="circle" icon={<HeartOutlined />} onClick={onLike}></Button>
                                </Tooltip>
                                <Tooltip title="Үзсэн">
                                    <Button className="check" size="middle" type={props.user && checks && checks.filter(x => x === props.user.id).length > 0 ? "primary" : "ghost"} shape="circle" icon={<CheckOutlined />} onClick={onCheck}></Button>
                                </Tooltip>
                                <Tooltip title="Дараа үзэх">
                                    <Button className="watchlist" size="middle" type={props.user && watchlists && watchlists.filter(x => x === props.user.id).length > 0 ? "primary" : "ghost"} shape="circle" icon={<PlusOutlined />} onClick={onWatchlist}></Button>
                                </Tooltip>
                                <Tooltip title="Үнэлгээ өгөх">
                                    {props.user && scores && scores.filter(x => x.user === props.user.id).length > 0 ? (
                                        <Button className="rate" size="middle" type="primary" shape="circle" style={{ color: '#000' }} onClick={() => setRateModalVisible(true)}>{props.user && scores && scores.filter(x => x.user === props.user.id)[0].score}</Button>
                                    ) : (
                                        <Button className="rate" size="middle" type="ghost" shape="circle" icon={<StarOutlined />} onClick={() => setRateModalVisible(true)}></Button>
                                    )}          
                                    <Modal 
                                        centered                                            
                                        title={`"${props.movie.name}"-д үнэлгээ өгөх`}                                              
                                        visible={rateModalVisible}
                                        footer={null}                    
                                        onCancel={() => setRateModalVisible(false)}                                                      
                                        width={400}
                                    >                                                                                        
                                        <div style={{ textAlign: 'center' }}>
                                            <Typography.Title level={5}>Таны үнэлгээ: {props.user && scores && scores.filter(x => x.user === props.user.id).length > 0 ? scores.filter(x => x.user === props.user.id)[0].score : ''}</Typography.Title>
                                            <span>
                                                <Rate value={props.user && scores && scores.filter(x => x.user === props.user.id).length > 0 ? scores.filter(x => x.user === props.user.id)[0].score : 0} count={10} onChange={onScore} />                                            
                                            </span>
                                        </div> 
                                    </Modal>                          
                                </Tooltip>                                
                            </div>
                            <div className="play">
                                <Button type="ghost" size="large" shape="circle" icon={<PlayCircleOutlined style={{ fontSize: '32px', color: '#FFF' }} />} style={{ border: 0, width: '50px', height: '50px', paddingTop: '9px' }} onClick={() => setTrailerModalVisible(true)}></Button>                                    
                                <Modal 
                                    title={props.movie.name}      
                                    visible={trailerModalVisible}
                                    footer={null}                    
                                    onCancel={() => setTrailerModalVisible(false)}                                                   
                                    width={getWidth()}
                                >
                                    <div>
                                        <iframe title={props.movie.name} width="100%" height={getHeight()} src={props.movie.trailer} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                    </div>
                                </Modal>
                            </div>
                            <Link to={`/movies/${props.movie.id}`}>                                                            
                                <div className="score">
                                    {screens.xs ? (
                                        <>
                                            <Typography.Title level={3} style={{ color: '#FFF' }}>
                                                <StarFilled style={{ color: '#fadb14' }} /> {(rating / 10).toFixed(1)}
                                            </Typography.Title>
                                        </>
                                    ) : (
                                        <>
                                            <Rate disabled allowHalf value={rating / 20} />                                    
                                            <Typography.Title level={screens.xs ? 3 : 2} style={{ color: '#FFF' }}>{(rating / 10).toFixed(1)}</Typography.Title>
                                        </>
                                    )}                                    
                                </div>
                            </Link>
                        </div>
                        <Link to={`/movies/${props.movie.id}`}>
                            <div className="bot">                                
                                <Typography.Title level={screens.xs ? 5 : 3} style={{ textAlign: 'center', fontWeight: 'normal', color: '#FFF' }}>{props.movie.name}</Typography.Title>                         
                                { !screens.xs ? (
                                    <div style={{ position: 'absolute', bottom: '8px' }}>
                                    {props.movie.genre.slice(0, 2).map(g => {
                                        return (                    
                                            <Button size="small" type="ghost" style={{ marginRight: '8px', marginBottom: '8px' }}>{g.name}</Button>
                                        )                                            
                                    })}                        
                                </div>  
                                ) : (
                                    <> 
                                    </>
                                )}
                            </div>        
                        </Link>                    
                    </div>                                                        
                </div>                
            </Card>         
        </div>        
    )
}

const mapStateToProps = state => {
    return {
        token: state.token
    }
}

export default connect(mapStateToProps)(MovieCard2);