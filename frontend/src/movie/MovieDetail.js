import { Grid, Button, Col, message, Row, Spin, Tabs, Tooltip, Typography, Modal, Rate } from 'antd';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../api';
import { CaretRightOutlined, CheckCircleOutlined, CheckOutlined, EyeOutlined, HeartOutlined, LoadingOutlined, PlusCircleOutlined, PlusOutlined, StarOutlined } from '@ant-design/icons';
import './MovieDetail.css';
import GenreTag from '../components/GenreTag';
import { connect } from "react-redux";
import MovieMembers from './MovieMembers';
import MovieCast from './MovieCast';

const { useBreakpoint } = Grid;
const spinIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function MovieDetail (props) {
    const screens = useBreakpoint();  
    const [user, setUser] = useState();
    const [movie, setMovie] = useState();
    const [modalVisible, setModalVisible] = useState(false);
    const [rateVisible, setRateVisible] = useState(false);

    useEffect(() => {               
        getMovie()        
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
        axios({
            method: 'GET',
            url: api.profile,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${props.token}`
            }
        }).then(res => {            
            console.log(res.data)
            setUser(res.data)
        }).catch(err => {
            console.log(err)
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

    function like () {        
        if (user !== null && user !== undefined) {
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
        } else {
            message.warning("Та эхлээд системд нэвтрэх шаардлагатай.")            
        }  
    }

    function score (value) {                    
        if (user !== null && user !== undefined) {    
            const data = {            
                token: props.token,
                score: (value * 20)
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
        } else {
            message.warning("Та эхлээд системд нэвтрэх шаардлагатай.")            
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
                            <img src={movie.landscape} alt="landscape" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: '0.2', backgroundColor: '#000' }} />                        
                        ) : (
                            <div style={{ width: '100%', height: '100%', opacity: '0.5', backgroundColor: '#000' }} />
                        )}                        
                    </div>
                    <div style={{ padding: getPadding() }} className="detail">
                        <Row gutter={[16, 16]} style={{ marginTop: '-20%', paddingBottom: '40px' }}>
                            <Col xs={24} sm={8} md={8} lg={8} xl={6} style={{ padding: '0 32px' }}>
                                <img src={movie.poster} alt="poster" style={{ width: '100%', height: 'auto', borderRadius: '5px', boxShadow: '0 6px 16px -8px rgb(0 0 0 / 32%), 0 9px 28px 0 rgb(0 0 0 / 20%), 0 12px 48px 16px rgb(0 0 0 / 12%)' }} />
                                <Row gutter={[8, 8]} style={{ marginTop: '8px', width: '100%' }}>
                                    <Col span={6} style={{ textAlign: 'center' }}>
                                        <EyeOutlined style={{ fontSize: '20px' }} />
                                        <br></br>
                                        <Typography.Text>{formatCount(movie.views)}</Typography.Text>
                                    </Col>
                                    <Col span={6} style={{ textAlign: 'center' }}>
                                        <HeartOutlined style={{ fontSize: '20px' }} />
                                        <br></br>
                                        <Typography.Text>{formatCount(movie.likes)}</Typography.Text>
                                    </Col>
                                    <Col span={6} style={{ textAlign: 'center' }}>
                                        <CheckCircleOutlined style={{ fontSize: '20px' }} />
                                        <br></br>
                                        <Typography.Text>{formatCount(movie.watched)}</Typography.Text>
                                    </Col>
                                    <Col span={6} style={{ textAlign: 'center' }}>
                                        <PlusCircleOutlined style={{ fontSize: '20px' }} />
                                        <br></br>
                                        <Typography.Text>{formatCount(movie.watchlist)}</Typography.Text>    
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={24} sm={16} md={16} lg={16} xl={18}>
                                <div style={{ borderRadius: '5px', height: '100%' }}>
                                    <Typography.Title level={2} style={{ marginBottom: '0' }}>{movie.name}</Typography.Title>
                                    <div className="info">
                                        { movie.rating ? <Typography.Text type="secondary">Ангилал: {movie.rating.name} |</Typography.Text> : <></> }
                                        <Typography.Text type="secondary"> Хугацаа: {movie.duration} мин |</Typography.Text>
                                        <Typography.Text type="secondary"> Нээлт: {movie.releasedate}</Typography.Text>
                                    </div>
                                    <div className="genre" style={{ marginTop: '8px' }}>
                                        {movie.genre.map(g => {
                                            return (                                                
                                                <GenreTag genre={g.name} />
                                            )                                            
                                        })}
                                    </div>                                    
                                    <div className="actions" style={{ marginTop: '16px' }}>                                        
                                        <Tooltip title="Трэйлэр үзэх">
                                            <Button size="large" type="ghost" shape="circle" icon={<CaretRightOutlined style={{ marginLeft: '2px' }} />} onClick={showModal} />
                                        </Tooltip>
                                        <Modal 
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
                                            <Button className="like" size="large" type={user && user.profile.likes.find(x => x.id === movie.id) !== undefined ? "primary" : "ghost"} shape="circle" icon={<HeartOutlined />} onClick={like}></Button>
                                        </Tooltip>
                                        <Tooltip title="Үзсэн">
                                            <Button className="watched" size="large" type={user && user.profile.watched.find(x => x.id === movie.id) !== undefined ? "primary" : "ghost"} shape="circle" icon={<CheckOutlined />} onClick={watched}></Button>
                                        </Tooltip>
                                        <Tooltip title="Дараа үзэх">
                                            <Button className="watchlist" size="large" type={user && user.profile.watchlist.find(x => x.id === movie.id) !== undefined ? "primary" : "ghost"} shape="circle" icon={<PlusOutlined />} onClick={watchlist}></Button>
                                        </Tooltip>           
                                        <span style={{ fontSize: '16px' }}>                                                
                                            {user && user.profile.scores.find(x => x.movie.id === movie.id) !== null && user.profile.scores.find(x => x.movie.id === movie.id) !== undefined ? (
                                                <>
                                                    <Tooltip title="Үнэлгээ өгөх">
                                                        <Button className="rate" size="large" type="primary" shape="circle" icon={<StarOutlined />} onClick={() => setRateVisible(!rateVisible)} />
                                                    </Tooltip>
                                                    {rateVisible ? 
                                                        <>
                                                            Таны үнэлгээ: <Rate allowHalf onChange={score} defaultValue={user.profile.scores.find(x => x.movie.id === movie.id).score / 20} />
                                                            {` (${user.profile.scores.find(x => x.movie.id === movie.id).score / 10})`}
                                                        </>
                                                    : <></>}
                                                </>
                                            ) : 
                                                <>
                                                    <Tooltip title="Үнэлгээ өгөх">
                                                        <Button className="rate" size="large" type="ghost" shape="circle" icon={<StarOutlined />} onClick={() => setRateVisible(!rateVisible)} />
                                                    </Tooltip>
                                                    {rateVisible ? 
                                                        <>
                                                            Таны үнэлгээ: <Rate allowHalf onChange={score} />
                                                            {` (Хоосон)`}
                                                        </>
                                                    : <></>}                                                        
                                                </>
                                            }
                                        </span>              
                                    </div>    
                                    <div className="rating" style={{ margin: '16px 0' }}>
                                        {/* <Statistic title="Үнэлгээ" value={parseFloat(movie.score / 10)} prefix={<StarFilled style={{ color: 'gold' }} />} suffix={<span>/10 <span style={{ fontSize: '16px' }}>({movie.score_count} үнэлгээнээс)</span></span>} />                                         */}
                                        <Typography.Text>Үнэлгээ:</Typography.Text>
                                        <span>
                                        <Typography.Title level={1} style={{ margin: 0 }}>{parseFloat(movie.score / 10)} <span style={{ fontSize: '24px' }}>/ 10</span></Typography.Title>                                        
                                        </span>
                                        <Rate disabled allowHalf defaultValue={movie.score / 20} />
                                        <br />
                                        <Typography.Text> ({movie.score_count} үнэлгээнээс)</Typography.Text>
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
                                                <MovieMembers data={movie.member} />
                                            </Tabs.TabPane>
                                            <Tabs.TabPane tab="Жүжигчид" key="3">
                                                <Typography.Title level={5}>Жүжигчид</Typography.Title>
                                                <MovieCast data={movie.cast} />                                                
                                            </Tabs.TabPane>
                                            <Tabs.TabPane tab="Сэтгэгдэл" key="4">
                                                <Typography.Title level={5}>Сэтгэгдэл</Typography.Title>
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