import { Grid, Button, Card, Tooltip, message, Typography, Rate } from 'antd';
import React, { useEffect, useState } from 'react';
import './MovieCard2.css';
import { CheckOutlined, PlusOutlined, HeartOutlined, StarOutlined, PlayCircleOutlined, StarFilled } from '@ant-design/icons';
import blank from './blank.jpg';
import axios from 'axios';
import api from '../api';
import { connect } from "react-redux";
import GenreTag from '../components/GenreTag';
import Modal from 'antd/lib/modal/Modal';
import { Link } from 'react-router-dom';

const { useBreakpoint } = Grid;

function MovieCard3 (props) {
    const screens = useBreakpoint();   
    const [rating, setRating] = useState()
    const [like, setLike] = useState(false)
    const [check, setCheck] = useState(false)
    const [watchlist, setWatchlist] = useState(false)
    const [score, setScore] = useState(0)
    const [trailerModalVisible, setTrailerModalVisible] = useState(false);
    const [rateModalVisible, setRateModalVisible] = useState(false);

    useEffect(() => {              
        setRating(props.movie.score)    
        getLikes()
        getChecks()
        getWatchlists()
        getScores()
    }, [props.movie]); // eslint-disable-line react-hooks/exhaustive-deps    

    function getLikes() {
        if (props.token) {
            axios({
                method: 'GET',
                url: `${api.likes}?token=${props.token}&movie=${props.movie.id}`,
                headers: {
                    'Content-Type': 'application/json'                
                }
            })
            .then(res => {
                if (res.data.count === 0) {
                    setLike(false)
                } else {
                    setLike(true)
                }
            })
            .catch(err => {
                message.error("Алдаа гарлаа. Та хуудсаа дахин ачааллуулна уу.")
            })
        }
    }

    function getChecks() {
        if (props.token) {
            axios({
                method: 'GET',
                url: `${api.checks}?token=${props.token}&movie=${props.movie.id}`,
                headers: {
                    'Content-Type': 'application/json'                
                }
            })
            .then(res => {
                if (res.data.count === 0) {
                    setCheck(false)
                } else {
                    setCheck(true)
                }
            })
            .catch(err => {
                message.error("Алдаа гарлаа. Та хуудсаа дахин ачааллуулна уу.")
            })
        }
    }

    function getWatchlists() {
        if (props.token) {
            axios({
                method: 'GET',
                url: `${api.watchlists}?token=${props.token}&movie=${props.movie.id}`,
                headers: {
                    'Content-Type': 'application/json'                
                }
            })
            .then(res => {
                if (res.data.count === 0) {
                    setWatchlist(false)
                } else {
                    setWatchlist(true)
                }
            })
            .catch(err => {
                message.error("Алдаа гарлаа. Та хуудсаа дахин ачааллуулна уу.")
            })
        }
    }

    function getScores() {
        if (props.token) {
            axios({
                method: 'GET',
                url: `${api.scores}?token=${props.token}&movie=${props.movie.id}`,
                headers: {
                    'Content-Type': 'application/json'                
                }
            })
            .then(res => {                
                if (res.data.count > 0) {                    
                    setScore(res.data.results[0].score)
                } else {
                    setScore(0)
                }
            })
            .catch(err => {
                message.error("Алдаа гарлаа. Та хуудсаа дахин ачааллуулна уу.")
            })
        }
    }

    function onLike () {        
        if (props.token && props.movie) {
            axios({
                method: 'POST',
                url: `${api.likes}/`,
                data: {
                    movie: props.movie.id,
                    token: props.token
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${props.token}`
                }
            })
            .then(res => {              
                if (res.status === 201 || res.status === 204) {
                    getLikes()
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
                method: 'POST',
                url: `${api.checks}/`,
                data: {
                    movie: props.movie.id,
                    token: props.token
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${props.token}`
                }
            })
            .then(res => {             
                if (res.status === 201 || res.status === 204) {
                    getChecks()
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
                method: 'POST',
                url: `${api.watchlists}/`,
                data: {
                    movie: props.movie.id,
                    token: props.token
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${props.token}`
                }
            })
            .then(res => {            
                if (res.status === 201 || res.status === 204) {
                    getWatchlists()
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
                method: 'POST',
                url: `${api.scores}/`,
                data: {
                    movie: props.movie.id,
                    token: props.token,
                    score: value
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${props.token}`
                }
            })
            .then(res => {              
                if (res.status === 200 || res.status === 201 || res.status === 204) {                    
                    if (res.data !== "") {
                        setRating(res.data.movie.score)
                    }                  
                    getScores()
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
                                    <Button className="like" size="middle" type={like ? "primary" : "ghost"} shape="circle" icon={<HeartOutlined />} onClick={onLike}></Button>
                                </Tooltip>
                                <Tooltip title="Үзсэн">
                                    <Button className="check" size="middle" type={check ? "primary" : "ghost"} shape="circle" icon={<CheckOutlined />} onClick={onCheck}></Button>
                                </Tooltip>
                                <Tooltip title="Дараа үзэх">
                                    <Button className="watchlist" size="middle" type={watchlist ? "primary" : "ghost"} shape="circle" icon={<PlusOutlined />} onClick={onWatchlist}></Button>
                                </Tooltip>
                                <Tooltip title="Үнэлгээ өгөх">
                                    {score > 0 ? (
                                        <Button className="rate" size="middle" type="primary" shape="circle" style={{ color: '#000' }} onClick={() => setRateModalVisible(true)}>{score}</Button>
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
                                            <Typography.Title level={5}>Таны үнэлгээ: {score ? score : ''}</Typography.Title>
                                            <span>
                                                <Rate value={score} count={10} onChange={onScore} />                                            
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
                                    {props.movie.genre.map(g => {
                                        return (                    
                                            <GenreTag genre={g.name} />
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

export default connect(mapStateToProps)(MovieCard3);