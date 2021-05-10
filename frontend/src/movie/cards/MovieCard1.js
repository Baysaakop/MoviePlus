import { Button, Card, Progress, Tooltip, Typography, message, Rate } from 'antd'
import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import './MovieCard1.css'
import { CheckOutlined, HeartOutlined, MoreOutlined, PlusOutlined, StarOutlined } from '@ant-design/icons'
import axios from 'axios';  
import api from '../../api';
import { connect } from 'react-redux'
import blank from './blank.jpg'

function MovieCard1 (props) {

    const [visible, setVisible] = useState(false)
    const [filmId, setFilmId] = useState()
    const [movie, setMovie] = useState()
    const [likes, setLikes] = useState()    
    const [checks, setChecks] = useState()    
    const [watchlists, setWatchlists] = useState()    
    const [rating, setRating] = useState()
    const [value, setValue] = useState()
    const [rateVisible, setRateVisible] = useState(false)

    useEffect(() => {              
        setFilmId(props.item.id)
        setMovie(props.item.movie)
        setLikes(props.item.movie.likes)
        setChecks(props.item.movie.checks)
        setWatchlists(props.item.movie.watchlists)
        setRating(props.item.movie.score)    
        getValue(props.item.movie.scores)
    }, [props.item, props.user]) // eslint-disable-line react-hooks/exhaustive-deps   

    function getGenre(genres) {
        let result = ""
        genres.slice(0, 2).forEach(genre => {
            result = result + genre.name + ", "
        })
        return result.slice(0, result.length - 2)
    }

    function onMore () {
        setVisible(!visible)
        setRateVisible(false)
    }

    function getValue(scores) {
        if (props.user && scores) {
            let data = scores.filter(x => x.user === props.user.id)
            if (data.length > 0) {
                setValue(data[0].score)
            }            
        }        
    }

    function onLike () {                
        if (props.token && filmId) {
            axios({
                method: 'PUT',
                url: `${api.movies}/${filmId}/`,
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
                    setLikes(res.data.movie.likes)
                }
            })
            .catch(err => {
                console.log(err)
                message.error("Дахин оролдоно уу.")
            })
        } else {
            message.warning("Та эхлээд системд нэвтрэх шаардлагатай.")            
            props.history.push('/login')  
        }        
    }

    function onCheck () {
        if (props.token && filmId) {
            axios({
                method: 'PUT',
                url: `${api.movies}/${filmId}/`,
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
                    setChecks(res.data.movie.checks)
                }
            })
            .catch(err => {
                console.log(err)
                message.error("Дахин оролдоно уу.")
            })
        } else {
            props.history.push('/login')             
        }
    }

    function onWatchlist () {
        if (props.token && filmId) {
            axios({
                method: 'PUT',
                url: `${api.movies}/${filmId}/`,
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
                    setWatchlists(res.data.movie.watchlists)
                }
            })
            .catch(err => {
                console.log(err)
                message.error("Дахин оролдоно уу.")
            })
        } else {
            props.history.push('/login')             
        }
    }

    function onScore (value) {                  
        if (props.token && filmId) {
            axios({
                method: 'PUT',
                url: `${api.movies}/${filmId}/`,
                data: {                    
                    token: props.token,
                    score: value * 2
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${props.token}`
                }
            })
            .then(res => {              
                if (res.status === 200) {                    
                    setRating(res.data.movie.score)                 
                    getValue(res.data.movie.scores)
                }
            })
            .catch(err => {
                console.log(err)
                message.error("Дахин оролдоно уу.")
            })
        } else {
            props.history.push('/login')  
        }                  
    }

    return (
        <div>            
            { movie ? (
            <Card 
                className="moviecard1"
                hoverable 
                cover={
                    <div className="container">
                        <Link to={`/movies/${filmId}`}>
                            <img className="poster" alt={movie.name} src={movie.poster ? movie.poster : blank} style={{ opacity: '0.9' }} />
                        </Link>
                        <div className="overlay-more">
                            <div>
                                <Button type="ghost" shape="circle" icon={<MoreOutlined />} onClick={onMore} />
                            </div>
                            { visible ? 
                                <div className="actions">   
                                    <Tooltip title="Таалагдсан">
                                        <Button className="like" type={props.user && likes && likes.filter(x => x === props.user.id).length > 0 ? "primary" : "ghost"} shape="circle" icon={<HeartOutlined />} onClick={onLike} />
                                    </Tooltip>
                                    <Tooltip title="Үзсэн">
                                        <Button className="check" type={props.user && checks && checks.filter(x => x === props.user.id).length > 0 ? "primary" : "ghost"} shape="circle" icon={<CheckOutlined />} onClick={onCheck} />
                                    </Tooltip>
                                    <Tooltip title="Дараа үзэх">
                                        <Button className="watchlist" type={props.user && watchlists && watchlists.filter(x => x === props.user.id).length > 0 ? "primary" : "ghost"} shape="circle" icon={<PlusOutlined />} onClick={onWatchlist} />
                                    </Tooltip>
                                    <Tooltip title="Үнэлгээ өгөх">
                                    {value ? (
                                        <Button className="score" type="primary" shape="circle" onClick={() => setRateVisible(!rateVisible)}>{value}</Button>
                                    ) : (
                                        <Button className="score" type="ghost" shape="circle" icon={<StarOutlined />} onClick={() => setRateVisible(!rateVisible)} />
                                    )}                                       
                                    </Tooltip>
                                </div>
                            : 
                                <></>
                            }
                        </div>
                        {rateVisible ? (
                        <div className="overlay-rate">
                            <div style={{ background: '#0d1117', padding: '4px' }}>                                
                                <Rate allowHalf style={{ fontSize: '18px' }} value={value ? value / 2 : undefined} onChange={onScore} />                                
                            </div>
                        </div>
                        ) : (
                            <></>
                        )}
                        <div className="overlay-score">
                            <Progress type="circle" percent={rating} width={44} strokeColor="#fadb14" trailColor="#1b262c" strokeWidth={4} />
                        </div>
                    </div>
                } 
                style={{ border: 0 }} 
                size="small"
            >                            
                <Link to={`/movies/${filmId}`}>                                        
                    <Card.Meta 
                        title={
                            <Tooltip title={movie.name}>
                                {`${movie.name} /${moment(movie.releasedate).format("YYYY")}/`} 
                            </Tooltip>
                        }
                        description={
                            <Typography.Paragraph ellipsis={true} style={{ margin: 0 }}>
                                {getGenre(movie.genre)}
                            </Typography.Paragraph>
                        } 
                    />
                </Link>        
            </Card>
            ) : (<></>)}            
        </div>
    )
}

const mapStateToProps = state => {
    return {
        token: state.token
    }
}

export default connect(mapStateToProps)(MovieCard1);