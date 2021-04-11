import { Grid, Button, Card, Tooltip, Modal, message } from 'antd';
import React, { useEffect, useState } from 'react';
import './MovieCard.css';
import { CheckOutlined, PlusOutlined, LikeOutlined, CaretRightOutlined, StarFilled } from '@ant-design/icons';
import blank from './blank.jpg';
import axios from 'axios';
import api from '../api';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

const { useBreakpoint } = Grid;

const { Meta } = Card;

function MovieCard (props) {
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
                like: false
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
                watched: false
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
                watchlist: false
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

    function getGenres() {
        const genres = []
        props.movie.genre.forEach(genre => {
            genres.push(genre.name)
        })
        return genres.slice(0, 2).toString()
    }

    return (
        <div>
            <Card             
                className="moviecard"
                size="small"
                hoverable                 
                style={{ width: '100%', height: 'auto', border: '0' }}
                cover={
                    <div className="cover-container" style={{ paddingBottom: '150%', overflow: 'hidden' }}>
                        <Link to={`/movies/${props.movie.id}`}>
                            <img src={props.movie.poster ? props.movie.poster : blank} alt="poster" style={{ width: '100%', height: '100%', position: 'absolute' }} />
                        </Link>
                        <div className="cover-overlay-top-left">
                            {/* <Avatar size="large" style={{ background: '#161b22', border: '1px solid orange', color: 'orange', fontFamily: 'Nerko One, cursive', fontSize: '20px' }}>
                                {parseInt(props.movie.score)}
                            </Avatar>  */}
                            <div style={{ background: 'rgba(0, 0, 0, 0.8)', color: '#fff', borderRadius: '5px', padding: '4px', fontSize: '18px' }}>
                                <StarFilled style={{ color: 'yellow' }} /> {parseInt(props.movie.score)}
                            </div>
                        </div>
                        <div className="cover-overlay-bot-right">        
                            <Tooltip title="Трэйлэр үзэх">
                                <Button size="large" type="ghost" shape="circle" icon={<CaretRightOutlined style={{ marginLeft: '2px' }} />} onClick={showModal} />
                            </Tooltip>
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
                            { user && user.profile.likes.find(x => x.id === props.movie.id) !== null && user.profile.likes.find(x => x.id === props.movie.id) !== undefined ? (
                                <Tooltip title="Таалагдсан">
                                    <Button size="large" type="primary" shape="circle" icon={<LikeOutlined />} onClick={like} />
                                </Tooltip>
                            ) : (
                                <Tooltip title="Таалагдсан">
                                    <Button size="large" type="ghost" shape="circle" icon={<LikeOutlined />} onClick={like} />
                                </Tooltip>
                            )}         
                            { user && user.profile.watched.find(x => x.id === props.movie.id) !== null && user.profile.watched.find(x => x.id === props.movie.id) !== undefined ? (
                                <Tooltip title="Үзсэн">
                                    <Button size="large" type="primary" shape="circle" icon={<CheckOutlined style={{ marginLeft: '2px' }} onClick={watched}  />} />
                                </Tooltip>
                            ) : (
                                <Tooltip title="Үзсэн">
                                    <Button size="large" type="ghost" shape="circle" icon={<CheckOutlined style={{ marginLeft: '2px' }} onClick={watched}  />} />
                                </Tooltip>
                            )}
                            { user && user.profile.watchlist.find(x => x.id === props.movie.id) !== null && user.profile.watchlist.find(x => x.id === props.movie.id) !== undefined ? (
                                <Tooltip title="Дараа үзэх">
                                    <Button size="large" type="primary" shape="circle" icon={<PlusOutlined />} onClick={watchlist} />
                                </Tooltip>
                            ) : (
                                <Tooltip title="Дараа үзэх">
                                    <Button size="large" type="ghost" shape="circle" icon={<PlusOutlined />} onClick={watchlist} />
                                </Tooltip>
                            )}   
                        </div>
                    </div>
                }
            >
                <Link to={`/movies/${props.movie.id}`}>
                    <Meta 
                        title={<Tooltip title={props.movie.name}>{props.movie.name}</Tooltip>} 
                        description={
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#888' }}>
                                <div>{props.movie.releasedate ? props.movie.releasedate.toString().slice(0, 4) : '----'}</div>
                                <div>{getGenres()}</div>
                            </div>
                        } 
                    />
                </Link>                
            </Card>             
        </div>        
    )
}

const mapStateToProps = state => {
    return {
        token: state.token
    }
}

export default connect(mapStateToProps)(MovieCard);