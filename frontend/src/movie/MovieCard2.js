import { Grid, Button, Card, Tooltip, message, Typography, Rate } from 'antd';
import React, { useEffect, useState } from 'react';
import './MovieCard2.css';
import { CheckOutlined, PlusOutlined, HeartOutlined, StarOutlined, PlayCircleOutlined } from '@ant-design/icons';
import blank from './blank.jpg';
import axios from 'axios';
import api from '../api';
import { connect } from "react-redux";
import GenreTag from '../components/GenreTag';
import Modal from 'antd/lib/modal/Modal';
import { Link } from 'react-router-dom';

const { useBreakpoint } = Grid;

function MovieCard2 (props) {
    const screens = useBreakpoint();  
    const [user, setUser] = useState();    
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {              
        getUser()        
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
            })
        } else {
            setUser(undefined)
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
                url: `${api.movies}/${props.movie.id}/`,
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${props.token}`            
                }
            }).then(res => {                        
                if (res.status === 201 || res.status === 200) {                                               
                    getUser()     
                }             
            }).catch(err => {   
                message.error("Амжилтгүй боллоо."); 
                console.log(err);            
            })           
        } else {
            message.warning("Та эхлээд системд нэвтрэх шаардлагатай.")            
        }   
    }

    function watched () {
        if (user !== null && user !== undefined) {
            const data = {            
                token: props.token,
                watched: true
            }            
            axios({
                method: 'PUT',
                url: `${api.movies}/${props.movie.id}/`,
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${props.token}`            
                }
            }).then(res => {                        
                if (res.status === 201 || res.status === 200) {                                               
                    getUser()     
                }             
            }).catch(err => {   
                message.error("Амжилтгүй боллоо."); 
                console.log(err);            
            })  
        } else {
            message.warning("Та эхлээд системд нэвтрэх шаардлагатай.")            
        }                
    }

    function watchlist () {
        if (user !== null && user !== undefined) {
            const data = {            
                token: props.token,
                watchlist: true
            }            
            axios({
                method: 'PUT',
                url: `${api.movies}/${props.movie.id}/`,
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${props.token}`            
                }
            }).then(res => {                        
                if (res.status === 201 || res.status === 200) {                                               
                    getUser()     
                }             
            }).catch(err => {   
                message.error("Амжилтгүй боллоо."); 
                console.log(err);            
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

    const showModal = () => {        
        setModalVisible(true);
    }

    const hideModal = () => {        
        setModalVisible(false);
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
                                    <Button className="like" size="middle" type={user && user.profile.likes.find(x => x.id === props.movie.id) !== undefined ? "primary" : "ghost"} shape="circle" icon={<HeartOutlined />} onClick={like}></Button>
                                </Tooltip>
                                <Tooltip title="Үзсэн">
                                    <Button className="watched" size="middle" type={user && user.profile.watched.find(x => x.id === props.movie.id) !== undefined ? "primary" : "ghost"} shape="circle" icon={<CheckOutlined />} onClick={watched}></Button>
                                </Tooltip>
                                <Tooltip title="Дараа үзэх">
                                    <Button className="watchlist" size="middle" type={user && user.profile.watchlist.find(x => x.id === props.movie.id) !== undefined ? "primary" : "ghost"} shape="circle" icon={<PlusOutlined />} onClick={watchlist}></Button>
                                </Tooltip>
                                {user && user.profile.scores.find(x => x.movie.id === props.movie.id) !== undefined ? (
                                    <Tooltip title="Үнэлгээ өгөх">
                                        <Button className="rate" size="middle" type="primary" shape="circle">{user.profile.scores.find(x => x.movie.id === props.movie.id).score / 10}</Button>
                                    </Tooltip>
                                ) : (
                                    <Tooltip title="Үнэлгээ өгөх">
                                        <Button className="rate" size="middle" type="ghost" shape="circle" icon={<StarOutlined />}></Button>
                                    </Tooltip>
                                )}                                
                            </div>
                            <div className="play">
                                <Button type="ghost" size="large" shape="circle" icon={<PlayCircleOutlined style={{ fontSize: '32px' }} />} style={{ border: 0, width: '50px', height: '50px', paddingTop: '9px' }} onClick={showModal}></Button>                                    
                                <Modal 
                                    title={props.movie.name}      
                                    visible={modalVisible}
                                    footer={null}                    
                                    onCancel={hideModal}                                                   
                                    width={getWidth()}
                                >
                                    <div>
                                        <iframe title={props.movie.name} width="100%" height={getHeight()} src={props.movie.trailer} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                    </div>
                                </Modal>
                            </div>
                            <Link to={`/movies/${props.movie.id}`}>                                                            
                                <div className="score">
                                    <Rate disabled allowHalf defaultValue={parseFloat(props.movie.score / 20)} />                                    
                                    <Typography.Title level={screens.xs ? 3 : 2} style={{ color: '#FFF' }}>{(props.movie.score / 10).toFixed(1)}</Typography.Title>
                                </div>
                            </Link>
                        </div>
                        <Link to={`/movies/${props.movie.id}`}>
                            <div className="bot">                                
                                { screens.xs ? (
                                    <div style={{ position: 'absolute', bottom: '8px' }}>
                                        <Typography.Title level={4} style={{ textAlign: 'center', fontWeight: 'normal', color: '#FFF' }}>{props.movie.name}</Typography.Title>                         
                                    </div>  
                                ) : (
                                    <>
                                        <Typography.Title level={3} style={{ textAlign: 'center', fontWeight: 'normal', color: '#FFF' }}>{props.movie.name}</Typography.Title> 
                                        {/* <Typography.Paragraph ellipsis={{ rows: 4 }} style={{ color: '#888' }}>
                                            {props.movie.description}
                                        </Typography.Paragraph> */}
                                        <div style={{ position: 'absolute', bottom: '8px' }}>
                                            {props.movie.genre.map(g => {
                                                return (                    
                                                    <GenreTag genre={g.name} />
                                                )                                            
                                            })}                        
                                        </div>  
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