import { Grid, Button, Col, message, Row, Spin, Tabs, Tooltip, Typography, Modal, Rate } from 'antd';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../api';
import { CaretRightOutlined, CheckCircleOutlined, CheckOutlined, CreditCardFilled, CreditCardOutlined, EyeOutlined, HeartOutlined, LoadingOutlined, PlayCircleOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import './MovieDetail.css';
import GenreTag from '../components/GenreTag';
import { connect } from "react-redux";
import MovieMembers from './MovieMembers';
import MovieCast from './MovieCast';
import MovieComment from './MovieComment';
import moment from 'moment';

const scoreValues = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

const { useBreakpoint } = Grid;
const spinIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function MovieDetail (props) {
    const screens = useBreakpoint(); 
    const [movie, setMovie] = useState()
    const [like, setLike] = useState(false)
    const [check, setCheck] = useState(false)
    const [watchlist, setWatchlist] = useState(false)
    const [score, setScore] = useState(0)
    const [modalVisible, setModalVisible] = useState(false)

    useEffect(() => {               
        getMovie()        
        getLikes()
        getChecks()
        getWatchlists()
        getScores()
    }, []); // eslint-disable-line react-hooks/exhaustive-deps    

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

    function getMovie() {        
        const id = props.match.params.movieID;
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
    }

    function getLikes() {
        if (props.token) {
            axios({
                method: 'GET',
                url: `${api.likes}?token=${props.token}&movie=${props.match.params.movieID}`,
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
                url: `${api.checks}?token=${props.token}&movie=${props.match.params.movieID}`,
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
                url: `${api.watchlists}?token=${props.token}&movie=${props.match.params.movieID}`,
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
                url: `${api.scores}?token=${props.token}&movie=${props.match.params.movieID}`,
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
        if (props.token && movie) {
            axios({
                method: 'POST',
                url: `${api.likes}/`,
                data: {
                    movie: movie.id,
                    token: props.token
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${props.token}`
                }
            })
            .then(res => {             
                if (res.status === 201 || res.status === 204) {                                  
                    getMovie()
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
        if (props.token && movie) {
            axios({
                method: 'POST',
                url: `${api.checks}/`,
                data: {
                    movie: movie.id,
                    token: props.token
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${props.token}`
                }
            })
            .then(res => {              
                if (res.status === 201 || res.status === 204) {
                    getMovie()
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
        if (props.token && movie) {
            axios({
                method: 'POST',
                url: `${api.watchlists}/`,
                data: {
                    movie: movie.id,
                    token: props.token
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${props.token}`
                }
            })
            .then(res => {              
                if (res.status === 201 || res.status === 204) {
                    getMovie()
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
        if (props.token && movie) {
            axios({
                method: 'POST',
                url: `${api.scores}/`,
                data: {
                    movie: movie.id,
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
                    getMovie()
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
        
    function formatCount(count) {
        if (count >= 1000000) {
            return (count / 1000000).toFixed(1).toString() + "M";
        } else if (count >= 1000) {
            return (count / 1000).toFixed(1).toString() + "K";
        } else {
            return count.toString();
        }
    }

    const showModal = () => {        
        setModalVisible(true);
    }

    const hideModal = () => {        
        setModalVisible(false);
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
        <div className="moviedetail" style={{ marginTop: '80px', minHeight: '80vh' }}>
            { movie ? (
                <div>
                    <div style={{ height: `${getHeight()}px` }}>
                        {movie.landscape ? (
                            <img src={movie.landscape} alt="landscape" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: '0.3', backgroundColor: '#000', filter: 'blur(4px)' }} />                        
                        ) : (
                            <div style={{ width: '100%', height: '100%', opacity: '0.5', backgroundColor: '#000' }} />
                        )}                        
                    </div>
                    <div style={{ padding: getPadding() }} className="detail">
                        <Row gutter={[16, 16]} style={{ marginTop: '-30%', paddingBottom: '40px' }}>
                            <Col xs={24} sm={8} md={8} lg={8} xl={6} style={{ padding: '0 32px' }}>
                                <img src={movie.poster} alt="poster" style={{ width: '100%', height: 'auto', borderRadius: '5px', boxShadow: '0 6px 16px -8px rgb(0 0 0 / 32%), 0 9px 28px 0 rgb(0 0 0 / 20%), 0 12px 48px 16px rgb(0 0 0 / 12%)' }} />
                                <Row gutter={[8, 8]} style={{ marginTop: '8px', width: '100%' }}>
                                    <Col span={6} style={{ textAlign: 'center' }}>
                                        <EyeOutlined style={{ fontSize: '20px' }} />
                                        <br></br>
                                        <Typography.Text>{formatCount(movie.view_count)}</Typography.Text>
                                    </Col>
                                    <Col span={6} style={{ textAlign: 'center' }}>
                                        <HeartOutlined style={{ fontSize: '20px' }} />
                                        <br></br>
                                        <Typography.Text>{formatCount(movie.like_count)}</Typography.Text>
                                    </Col>
                                    <Col span={6} style={{ textAlign: 'center' }}>
                                        <CheckCircleOutlined style={{ fontSize: '20px' }} />
                                        <br></br>
                                        <Typography.Text>{formatCount(movie.check_count)}</Typography.Text>
                                    </Col>
                                    <Col span={6} style={{ textAlign: 'center' }}>
                                        <PlusCircleOutlined style={{ fontSize: '20px' }} />
                                        <br></br>
                                        <Typography.Text>{formatCount(movie.watchlist_count)}</Typography.Text>    
                                    </Col>
                                </Row>
                                <Button block type="primary" icon={<PlayCircleOutlined />}>Үзэх</Button> 
                                <Button danger block type="primary" icon={<CreditCardOutlined />} style={{ marginTop: '8px' }}>Тасалбар захиалах</Button> 
                            </Col>
                            <Col xs={24} sm={16} md={16} lg={16} xl={18}>
                                <div style={{ borderRadius: '5px', height: '100%' }}>
                                    <Typography.Title level={2} style={{ marginBottom: '0' }}>{movie.name} /{moment(movie.releasedate).format("YYYY")}/</Typography.Title>                                    
                                    <div className="genre" style={{ marginTop: '8px' }}>
                                        {movie.genre.map(g => {
                                            return (                                                
                                                // <GenreTag genre={g.name} />
                                                <span style={{ fontSize: '16px' }}>{g.name} | </span>
                                            )                                            
                                        })}
                                    </div>                                    
                                    <div className="info">
                                        { movie.rating ? <Typography.Text type="secondary">Ангилал: {movie.rating.name} |</Typography.Text> : <></> }
                                        <p style={{ fontSize: '16px', margin: 0 }}> Үргэлжлэх хугацаа: {movie.duration} мин</p>
                                        <p style={{ fontSize: '16px', margin: 0 }}> Нээлтийн огноо: {movie.releasedate}</p>
                                    </div>
                                    <div className="actions" style={{ marginTop: '16px' }}>                                        
                                        <Tooltip title="Трэйлэр үзэх">
                                            <Button size="large" type="ghost" shape="circle" icon={<CaretRightOutlined style={{ marginLeft: '2px' }} />} onClick={showModal} />
                                        </Tooltip>
                                        <Modal 
                                            centered                                            
                                            title={movie.name}                                              
                                            visible={modalVisible}
                                            footer={null}                    
                                            onCancel={hideModal}                                                      
                                            width={getWidth()}
                                        >                                                                                        
                                            <div>
                                                <iframe title={movie.name} width="100%" height={getHeight()} src={movie.trailer} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>                                                
                                            </div> 
                                        </Modal>
                                        <Tooltip title="Таалагдсан">
                                            <Button className="like" size="large" type={like ? "primary" : "ghost"} shape="circle" icon={<HeartOutlined />} onClick={onLike}></Button>
                                        </Tooltip>
                                        <Tooltip title="Үзсэн">
                                            <Button className="check" size="large" type={check ? "primary" : "ghost"} shape="circle" icon={<CheckOutlined />} onClick={onCheck}></Button>
                                        </Tooltip>
                                        <Tooltip title="Дараа үзэх">
                                            <Button className="watchlist" size="large" type={watchlist ? "primary" : "ghost"} shape="circle" icon={<PlusOutlined />} onClick={onWatchlist}></Button>
                                        </Tooltip>                                         
                                    </div>    
                                    <div style={{ margin: '16px 0' }}>
                                        <Typography.Title level={5}>Таны үнэлгээ: {score ? score : ''}</Typography.Title>                                        
                                        <Rate tooltips={scoreValues} value={score} count={10} onChange={onScore} />
                                    </div>
                                    <div className="rating" style={{ margin: '16px 0', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>                                       
                                        <div style={{ marginRight: '24px' }}>
                                            <Typography.Title level={5} style={{ margin: 0 }}>Үзэгчдийн үнэлгээ:</Typography.Title>                                        
                                            <span>                                                                                    
                                                <span style={{ fontSize: '32px', fontWeight: 'bold' }}> {movie.score / 10}</span>                                        
                                                <span style={{ fontSize: '20px', fontWeight: 'bold' }}> / 10</span>
                                                <span style={{ fontSize: '14px' }}> (нийт {movie.score_count})</span>
                                            </span>
                                        </div>
                                        <div>
                                            <Typography.Title level={5} style={{ margin: 0 }}>Шүүмжлэгчдийн үнэлгээ:</Typography.Title>                                        
                                            <span>                                                                                    
                                                <span style={{ fontSize: '32px', fontWeight: 'bold' }}> 7.3</span>                                        
                                                <span style={{ fontSize: '20px', fontWeight: 'bold' }}> / 10</span>
                                                <span style={{ fontSize: '14px' }}> (нийт 16)</span>
                                            </span>
                                        </div>
                                    </div>                                
                                    <div className="infotabs">
                                        <Tabs defaultActiveKey="1">
                                            <Tabs.TabPane tab="Мэдээлэл" key="1">
                                                <Typography.Title level={5}>Дэлгэрэнгүй</Typography.Title>
                                                <Typography.Paragraph>{movie.description}</Typography.Paragraph>
                                                <Typography.Title level={5}>Агуулга</Typography.Title>
                                                <Typography.Paragraph>{movie.plot}</Typography.Paragraph>
                                            </Tabs.TabPane>
                                            <Tabs.TabPane tab="Бүрэлдэхүүн" key="2">
                                                <Typography.Title level={5}>Баг бүрэлдэхүүн</Typography.Title>
                                                <MovieMembers id={movie.id} />
                                            </Tabs.TabPane>
                                            <Tabs.TabPane tab="Жүжигчид" key="3">
                                                <Typography.Title level={5}>Жүжигчид</Typography.Title>
                                                <MovieCast id={movie.id} />                                                
                                            </Tabs.TabPane>
                                            <Tabs.TabPane tab="Сэтгэгдэл" key="4">
                                                <Typography.Title level={5}>Сэтгэгдэл</Typography.Title>
                                                <MovieComment id={movie.id} />
                                            </Tabs.TabPane>
                                        </Tabs>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <Spin indicator={spinIcon} />
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