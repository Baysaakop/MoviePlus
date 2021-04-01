import { Grid, Button, Card, Tooltip, message, Typography, Statistic } from 'antd';
import React, { useEffect, useState } from 'react';
import './MovieCard2.css';
import { CheckOutlined, PlusOutlined, LikeOutlined, CaretRightOutlined, StarFilled } from '@ant-design/icons';
import blank from './blank.jpg';
import axios from 'axios';
import api from '../api';
import { connect } from "react-redux";

const { useBreakpoint } = Grid;

const { Meta } = Card;

function MovieCard2 (props) {
    const screens = useBreakpoint();  
    const [user, setUser] = useState();    
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {              
        getUser()        
    }, []);

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

    function formatCount(count) {
        if (count >= 1000000) {
            return (count / 1000000).toFixed(1).toString() + "M";
        } else if (count >= 1000) {
            return (count / 1000).toFixed(1).toString() + "K";
        } else {
            return count.toString();
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
                style={{ width: '100%', height: 'auto', border: '0', padding: 0 }}                
            >                
                <div className="container" style={{ paddingBottom: '150%', overflow: 'hidden' }}>
                    <a href={`/movies/${props.movie.id}`}>
                        <img className="poster" src={props.movie.poster ? props.movie.poster : blank} alt="poster" />
                    </a>       
                    <div className="overlay-actions">              
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
                        {/* <Tooltip title="Таалагдсан">
                            <Button size="large" type="ghost" shape="circle" icon={<StarOutlined />} />
                        </Tooltip> */}
                    </div>
                    <div className="overlay-play">                        
                        <Tooltip title="Трейлер үзэх">
                            <Button size="large" type="primary" shape="circle" icon={<CaretRightOutlined style={{ marginLeft: '2px' }} />} />                                                                    
                        </Tooltip>
                    </div> 
                    <div className="overlay-name">
                        <Typography.Title level={3}>{props.movie.name}</Typography.Title>                        
                    </div> 
                    <div className="overlay-score">                        
                        <Statistic value={props.movie.score} prefix={<StarFilled style={{ color: '#FDCC0D' }} />} />
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