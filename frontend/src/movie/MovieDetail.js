import { Grid, Button, Col, message, Row, Spin, Tabs, Tooltip, Typography, notification, Progress } from 'antd';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../api';
import { CheckCircleOutlined, CheckOutlined, HeartOutlined, LoadingOutlined, PlayCircleOutlined, PlusCircleOutlined, PlusOutlined, StarOutlined, ToolOutlined } from '@ant-design/icons';
import './MovieDetail.css';
import { connect } from "react-redux";
import MovieCrew from './MovieCrew';
import MovieCast from './MovieCast';
import MovieComment from './MovieComment';
import moment from 'moment';
import Trailer from '../components/Trailer';
import { Link } from 'react-router-dom';
import MovieScoreModal from './cards/MovieScoreModal';

const { useBreakpoint } = Grid;
const spinIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function MovieDetail (props) {    
    const screens = useBreakpoint()
    const [user, setUser] = useState()
    const [filmId, setFilmId] = useState()
    const [movie, setMovie] = useState()
    const [trailer, setTrailer] = useState(false)    
    const [rateVisible, setRateVisible] = useState(false)
    const [scoreLoading, setScoreLoading] = useState(false)

    useEffect(() => {               
        getUser()
        getMovie()        
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

    function getMovie() {        
        const id = props.match.params.movieID;
        const url = api.films + "/" + id + "/";  
        axios({
            method: 'GET',
            url: url,
            headers: {
                'Content-Type': 'application/json'                
            }
        })
        .then(res => {
            console.log(res.data)
            setFilmId(res.data.id)
            setMovie(res.data.movie)            
        })
        .catch(err => {
            message.error("Алдаа гарлаа. Та хуудсаа дахин ачааллуулна уу.")
        })
    }

    function getValue(user, scores) {
        if (user && scores) {
            let data = scores.filter(x => x.user === user.id)
            if (data.length > 0) {
                // setValue(data[0].score)
                return data[0].score
            }            
        }        
        return 0
    }

    function onLike (type) {                
        if (props.token && filmId) {
            axios({
                method: 'PUT',
                url: `${api.films}/${filmId}/`,
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
                if (type) {                                  
                    notification.open({
                        message: 'Жагсаалтаас хасагдлаа',
                        description: `${movie.name} кино таны таалагдсан киноны жагсаалтаас хасагдлаа.`,
                        icon: <HeartOutlined style={{ color: '#c0392b' }} />,                        
                    })                                    
                } else {                    
                    notification.open({
                        message: 'Жагсаалтад нэмэгдлээ',
                        description: `${movie.name} кино таны таалагдсан киноны жагсаалтад нэмэгдлээ.`,
                        icon: <HeartOutlined style={{ color: '#c0392b' }} />,                        
                    })                          
                }
                getMovie()
            })
            .catch(err => {
                console.log(err)
                message.error("Дахин оролдоно уу.")
            })
        } else {
            props.history.push('/login')   
        }        
    }

    function onCheck (type) {
        if (props.token && filmId) {
            axios({
                method: 'PUT',
                url: `${api.films}/${filmId}/`,
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
                if (type) {                                  
                    notification.open({
                        message: 'Жагсаалтаас хасагдлаа',
                        description: `${movie.name} кино таны үзсэн киноны жагсаалтаас хасагдлаа.`,
                        icon: <CheckCircleOutlined style={{ color: '#2ecc71' }} />,
                    })                                   
                } else {
                    notification.open({
                        message: 'Жагсаалтад нэмэгдлээ',
                        description: `${movie.name} кино таны үзсэн киноны жагсаалтад нэмэгдлээ.`,
                        icon: <CheckCircleOutlined style={{ color: '#2ecc71' }} />,
                    })      
                }
                getMovie()
            })
            .catch(err => {
                console.log(err)
                message.error("Дахин оролдоно уу.")
            })
        } else {
            props.history.push('/login')             
        }                
    }

    function onWatchlist (type) {
        if (props.token && filmId) {
            axios({
                method: 'PUT',
                url: `${api.films}/${filmId}/`,
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
                if (type) {                                  
                    notification.open({
                        message: 'Жагсаалтаас хасагдлаа',
                        description: `${movie.name} кино таны дараа үзэх киноны жагсаалтаас хасагдлаа.`,
                        icon: <PlusCircleOutlined style={{ color: '#3498db' }} />,
                    })                                  
                } else {
                    notification.open({
                        message: 'Жагсаалтад нэмэгдлээ',
                        description: `${movie.name} кино таны дараа үзэх киноны жагсаалтад нэмэгдлээ.`,
                        icon: <PlusCircleOutlined style={{ color: '#3498db' }} />,
                    })        
                }
                getMovie()
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
            setScoreLoading(true)
            axios({
                method: 'PUT',
                url: `${api.films}/${filmId}/`,
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
                if (value === 0) {                                  
                    notification.open({
                        message: 'Жагсаалтаас хасагдлаа',
                        description: `${movie.name} кино таны үнэлгээ өгсөн киноны жагсаалтаас хасагдлаа.`,
                        icon: <StarOutlined style={{ color: '#fadb14' }} />,
                    })                                  
                } else {
                    notification.open({
                        message: 'Жагсаалтад нэмэгдлээ',
                        description: `${movie.name} кино таны үнэлгээ өгсөн киноны жагсаалтад нэмэгдлээ.`,
                        icon: <StarOutlined style={{ color: '#fadb14' }} />,
                    })        
                }
                getMovie()
                setScoreLoading(false)
            })
            .catch(err => {
                console.log(err)
                message.error("Дахин оролдоно уу.")
                setScoreLoading(false)
            })
        } else {
            props.history.push('/login')          
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

    function getPadding() {
        if (screens.xxl) {
            return '16px 15%'
        } else if (screens.xl) {
            return '16px 10%'
        } else if (screens.lg) {
            return '16px 8%'
        } else if (screens.md) {
            return '16px 5%'
        } else if (screens.sm) {
            return '16px 5%'
        } else if (screens.xs) {
            return '16px 5%'
        }
    }

    return (
        <div className="moviedetail" style={{ minHeight: '80vh' }}>
            { movie ? (
                <div>
                    <div style={{ height: `${window.screen.availHeight * 0.6}px` }}>
                        {movie.landscape ? (
                            // <img src={movie.landscape} alt="landscape" style={{ width: '100%', height: '100%', objectFit: 'fill', backgroundColor: '#000', background: 'rgba(0, 0, 0, 0.5)', filter: 'blur(1px)' }} />                        
                            <div
                                style={{
                                    backgroundImage: `linear-gradient(60deg, rgba(11, 20, 30, 0.6), rgba(22, 35, 49, 0.8)), url(${movie.landscape})`,
                                    width: '100%',
                                    height: '100%',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: 'cover'                                                                                           
                                }}
                            >
                            </div>
                        ) : (
                            <div style={{ width: '100%', height: '100%', opacity: '0' }} />
                        )}                                            
                    </div>
                    <div style={{ padding: getPadding() }} className="detail">
                        <Row gutter={[16, 16]} style={{ marginTop: '-25%', marginBottom: '40px' }}>
                            <Col xs={24} sm={8} md={8} lg={8} xl={6} style={ screens.xs ? { padding: '0 8px' } : { padding: '8px 32px 0 8px'}}>
                                <img src={movie.poster} alt="poster" style={{ width: '100%', height: 'auto', borderRadius: '5px', boxShadow: '0 6px 16px -8px rgb(0 0 0 / 32%), 0 9px 28px 0 rgb(0 0 0 / 20%), 0 12px 48px 16px rgb(0 0 0 / 12%)' }} />                                
                                <div className="actions">                                                                            
                                    <Tooltip title="Таалагдсан">
                                        <div style={{ width: '25%', marginRight: '8px', textAlign: 'center' }}>
                                            <Button className="like" size="large" type={user && movie.likes.filter(x => x === user.id).length > 0 ? "primary" : "ghost"} icon={<HeartOutlined />} onClick={() => onLike(user && movie.likes.filter(x => x === user.id).length > 0)} />                                                                                                                                                                          
                                            <Typography.Text>{formatCount(movie.likes.length)}</Typography.Text>                
                                        </div>
                                    </Tooltip>
                                    <Tooltip title="Үзсэн">
                                        <div style={{ width: '25%', marginRight: '8px', textAlign: 'center' }}>
                                            <Button className="check" size="large" type={user && movie.checks.filter(x => x === user.id).length > 0 ? "primary" : "ghost"} icon={<CheckOutlined />} onClick={() => onCheck(user && movie.checks.filter(x => x === user.id).length > 0)} />                                                
                                            <Typography.Text>{formatCount(movie.checks.length)}</Typography.Text>        
                                        </div>
                                    </Tooltip>
                                    <Tooltip title="Дараа үзэх">
                                        <div style={{ width: '25%', marginRight: '8px', textAlign: 'center' }}>
                                            <Button className="watchlist" size="large" type={user && movie.watchlists.filter(x => x === user.id).length > 0 ? "primary" : "ghost"} icon={<PlusOutlined />} onClick={() => onWatchlist(user && movie.watchlists.filter(x => x === user.id).length > 0)} />
                                            <Typography.Text>{formatCount(movie.watchlists.length)}</Typography.Text>
                                        </div>
                                    </Tooltip> 
                                    <Tooltip title="Үнэлгээ өгөх">
                                        <div style={{ width: '25%', marginRight: '8px', textAlign: 'center' }}>
                                            {user && getValue(user, movie.scores) > 0 ? (
                                                <Button className="score" size="large" type="primary" onClick={() => setRateVisible(!rateVisible)}>
                                                    <Typography.Text>{getValue(user, movie.scores)}</Typography.Text>
                                                </Button>
                                            ) : (
                                                <Button className="score" size="large" type="ghost" icon={<StarOutlined />} onClick={() => setRateVisible(!rateVisible)} />
                                            )}
                                            <Typography.Text>{formatCount(movie.scores.length)}</Typography.Text>
                                        </div>
                                    </Tooltip>        
                                    {rateVisible ? <MovieScoreModal movie={movie} value={getValue(user, movie.scores)} score={(val) => onScore(val)} hide={() => setRateVisible(false)} /> : <></>}                                
                                </div>
                                <Button size="large" block type="primary" icon={<PlayCircleOutlined />} onClick={() => setTrailer(true)}>
                                    Трейлер үзэх
                                </Button>
                                {trailer ? <Trailer title={movie.title} trailer={movie.trailer} hide={() => setTrailer(false)} /> : <></>}           
                                <Link to={`/updatemovie/${filmId}`}>
                                    <Button size="large" block type="ghost" icon={<ToolOutlined />} style={{ marginTop: '64px' }}>
                                        Мэдээлэл засах
                                    </Button> 
                                </Link>                
                            </Col>
                            <Col xs={24} sm={16} md={16} lg={16} xl={18}>
                                <div style={{ borderRadius: '5px', backgroundColor: 'rgba(0, 0, 0, 0)', padding: '8px' }}>
                                    <Typography.Title level={1}>{movie.name} /{moment(movie.releasedate).format("YYYY")}/</Typography.Title>                                    
                                    <div className="genre">
                                        {movie.genre.map(g => {
                                            return (                                                                                                
                                                <span style={{ marginRight: '8px', color: 'white', padding: '8px', border: '1px solid white', borderRadius: '4px', fontSize: '16px' }}>{g.name}</span>
                                            )                                            
                                        })}
                                    </div>                                    
                                    <div className="info" style={{ marginTop: '24px', fontSize: '16px' }}>                                                                      
                                        <Typography.Text style={{ display: 'block' }}>Нээлтийн он сар өдөр: {movie.releasedate}</Typography.Text>
                                        <Typography.Text style={{ display: 'block' }}>Үргэлжлэх хугацаа: {movie.duration} минут</Typography.Text>
                                        <Typography.Text style={{ display: 'block' }}>Насны ангилал: Тодорхойлоогүй</Typography.Text>                                        
                                    </div>                                    
                                    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginTop: '16px' }}>
                                        <div>                                                                                        
                                            {scoreLoading ? (
                                                <div style={{ width: '96px', height: '96px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Spin indicator={spinIcon} />
                                                </div>                                
                                            ) : (
                                                <Progress 
                                                    type="circle" 
                                                    percent={movie.score}
                                                    width={96} 
                                                    strokeColor="#fadb14" 
                                                    trailColor="#1b262c" 
                                                    strokeWidth={6} 
                                                    format={p => <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{`${p}%`}</span> } 
                                                    // format={p => <span style={{ fontSize: '28px' }}>{`${p / 10}`}</span> } 
                                                />
                                            )}               
                                        </div>
                                        <div style={{ marginLeft: '8px', padding: '8px', background: '#161b22', borderRadius: '4px' }}>
                                            <Typography.Text style={{ fontSize: '22px', fontWeight: 'bold' }}>
                                                Үзэгчдийн үнэлгээ                                                                                                
                                            </Typography.Text>                  
                                            <br />
                                            <Typography.Text style={{ fontSize: '16px' }}>
                                                (Нийт {formatCount(movie.scores.length)})
                                            </Typography.Text>
                                        </div>
                                    </div>                                         
                                </div>
                                <div className="infotabs">
                                    <Tabs defaultActiveKey="1" style={{ fontSize: '16px' }}>
                                        <Tabs.TabPane tab="Мэдээлэл" key="1">
                                            <Typography.Title level={5}>Дэлгэрэнгүй</Typography.Title>
                                            <Typography.Paragraph>{movie.description ? movie.description : 'In consectetur orci tellus, nec tristique leo rhoncus non. Morbi tempor, augue non interdum auctor, nisl diam euismod enim, sed euismod ex ligula nec odio. Integer sed varius nisl, nec vestibulum lectus. Phasellus nec purus et turpis pellentesque cursus sed eget mi. Vivamus eu dolor id eros consectetur lobortis non id ipsum. In non ante erat. Cras in neque id eros egestas viverra. Nullam at egestas dui, ac pulvinar dolor.'}</Typography.Paragraph>
                                            <Typography.Title level={5}>Агуулга</Typography.Title>
                                            <Typography.Paragraph>{movie.plot ? movie.plot : 'Nam dignissim velit et elit condimentum porta. Maecenas imperdiet mollis diam vulputate ultrices. Quisque vitae enim quis purus varius accumsan. Nunc tempus, ipsum eget ornare vulputate, mauris neque viverra erat, a faucibus nisl enim eu diam. Nulla blandit sed tortor in gravida. Curabitur at lacinia enim, vitae aliquam nulla. Maecenas eu tortor aliquam augue vehicula dapibus. Cras a diam dapibus, consectetur lectus eu, imperdiet nibh. Nunc dignissim id nisl ut hendrerit.'}</Typography.Paragraph>
                                        </Tabs.TabPane>
                                        <Tabs.TabPane tab="Бүрэлдэхүүн" key="2">
                                            <Typography.Title level={5}>Баг бүрэлдэхүүн</Typography.Title>
                                            <MovieCrew id={filmId} />
                                        </Tabs.TabPane>
                                        <Tabs.TabPane tab="Жүжигчид" key="3">
                                            <Typography.Title level={5}>Жүжигчид</Typography.Title>
                                            <MovieCast id={filmId} />                                                
                                        </Tabs.TabPane>
                                        <Tabs.TabPane tab="Сэтгэгдэл" key="4">
                                            <Typography.Title level={5}>Сэтгэгдэл</Typography.Title>
                                            <MovieComment token={props.token} user={user} movieID={movie.id} />
                                        </Tabs.TabPane>
                                        <Tabs.TabPane tab="Зураг" key="5">
                                            <Typography.Title level={5}>Зураг</Typography.Title>                                                
                                        </Tabs.TabPane>
                                    </Tabs>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <Spin indicator={spinIcon} tip="Уншиж байна..." />
                </div>
            )}                        
        </div>
    )
}

const mapStateToProps = state => {
    return {
        token: state.token
    }
}

export default connect(mapStateToProps)(MovieDetail);