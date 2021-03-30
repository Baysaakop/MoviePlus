import { Avatar, Button, Card, Tooltip, message } from 'antd';
import React, { useEffect, useState } from 'react';
import './MovieCard.css';
import { CheckOutlined, PlusOutlined, LikeOutlined } from '@ant-design/icons';
import blank from './blank.jpg';
import axios from 'axios';
import api from '../api';
import { connect } from "react-redux";

const { Meta } = Card;

function MovieCard (props) {
    const [user, setUser] = useState();
    const [movie, setMovie] = useState();

    useEffect(() => {              
        getMovie()        
    }, []);

    function getMovie() {
        const id = props.id;
        const url = api.movies + "/" + id + "/";  
        axios({
            method: 'GET',
            url: url,
            headers: {
                'Content-Type': 'application/json'                
            }
        })
        .then(res => {
            setMovie(res.data);
        })
        .catch(err => {
            message.error("Алдаа гарлаа. Та хуудсаа дахин ачааллуулна уу.")
        })
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
        const data = {            
            token: props.token,
            like: true
        }            
        axios({
            method: 'PUT',
            url: `${api.movies}/${movie.id}/`,
            data: data,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${props.token}`            
            }
        }).then(res => {                        
            if (res.status === 201 || res.status === 200) {                                               
                getMovie()     
            }             
        }).catch(err => {   
            message.error("Амжилтгүй боллоо."); 
            console.log(err);            
        })       
    }

    function watched () {
        const data = {            
            token: props.token,
            watched: true
        }            
        axios({
            method: 'PUT',
            url: `${api.movies}/${movie.id}/`,
            data: data,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${props.token}`            
            }
        }).then(res => {                        
            if (res.status === 201 || res.status === 200) {                                               
                getMovie()     
            }             
        }).catch(err => {   
            message.error("Амжилтгүй боллоо."); 
            console.log(err);            
        })       
    }

    function watchlist () {
        const data = {            
            token: props.token,
            watchlist: true
        }            
        axios({
            method: 'PUT',
            url: `${api.movies}/${movie.id}/`,
            data: data,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${props.token}`            
            }
        }).then(res => {                        
            if (res.status === 201 || res.status === 200) {                                               
                getMovie()     
            }             
        }).catch(err => {   
            message.error("Амжилтгүй боллоо."); 
            console.log(err);            
        })    
    }

    return (
        <div>
            { movie ?(
                <Card             
                    size="small"
                    hoverable                 
                    style={{ width: '100%', height: 'auto', border: '0' }}
                    cover={
                        <div className="cover-container" style={{ paddingBottom: '140%', overflow: 'hidden' }}>
                            <a href={`/movies/${movie.id}`}>
                                <img src={movie.poster ? movie.poster : blank} alt="poster" style={{ width: '100%', height: '100%', position: 'absolute' }} />
                            </a>
                            <div className="cover-overlay-top-left">
                                <Avatar size="large" style={{ background: '#161b22', border: '1px solid orange', color: 'orange', fontFamily: 'Nerko One, cursive', fontSize: '20px' }}>
                                    {parseInt(movie.score)}
                                </Avatar>    
                                {/* <div style={{ padding: '4px', background: 'rgba(0, 0, 0, 0.8    )', borderRadius: '5px', fontSize: '18px' }}>
                                    <StarFilled style={{ color: 'gold' }} /> {props.item.score}
                                </div>                             */}
                            </div>
                            <div className="cover-overlay-bot-right">                           
                                { user && user.profile.likes.find(x => x === movie.id) !== null && user.profile.likes.find(x => x === movie.id) !== undefined ? (
                                    <Tooltip title="Таалагдлаа">
                                        <Button size="large" type="primary" shape="circle" icon={<LikeOutlined />} onClick={like} />
                                    </Tooltip>
                                ) : (
                                    <Tooltip title="Таалагдлаа">
                                        <Button size="large" type="ghost" shape="circle" icon={<LikeOutlined />} onClick={like} />
                                    </Tooltip>
                                )}         
                                { user && user.profile.watched.find(x => x === movie.id) !== null && user.profile.watched.find(x => x === movie.id) !== undefined ? (
                                    <Tooltip title="Үзсэн">
                                        <Button size="large" type="primary" shape="circle" icon={<CheckOutlined style={{ marginLeft: '2px' }} onClick={watched}  />} />
                                    </Tooltip>
                                ) : (
                                    <Tooltip title="Үзсэн">
                                        <Button size="large" type="ghost" shape="circle" icon={<CheckOutlined style={{ marginLeft: '2px' }} onClick={watched}  />} />
                                    </Tooltip>
                                )}
                                { user && user.profile.watchlist.find(x => x === movie.id) !== null && user.profile.watchlist.find(x => x === movie.id) !== undefined ? (
                                    <Tooltip title="Дараа үзэх">
                                        <Button size="large" type="primary" shape="circle" icon={<PlusOutlined />} onClick={watchlist} />
                                    </Tooltip>
                                ) : (
                                    <Tooltip title="Дараа үзэх">
                                        <Button size="large" type="ghost" shape="circle" icon={<PlusOutlined />} onClick={watchlist} />
                                    </Tooltip>
                                )}   
                                {/* <Tooltip title="Үнэлгээ өгөх">
                                    <Button type="ghost" shape="circle" size="large" icon={<StarOutlined />} />
                                </Tooltip> */}
                            </div>
                        </div>
                    }
                >
                    <Meta title={movie.name} description={movie.releasedate ? movie.releasedate.toString().slice(0, 4) : '----'} />
                </Card>
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

export default connect(mapStateToProps)(MovieCard);