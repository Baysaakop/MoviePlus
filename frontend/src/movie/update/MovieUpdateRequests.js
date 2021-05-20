import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { Grid, List, Spin, Typography, message, Button, Row, Col, Pagination, Result, Avatar } from "antd";
import React, { useEffect, useState } from "react";
import axios from 'axios';  
import api from '../../api';
import { connect } from 'react-redux'
import moment from 'moment'
import Trailer from "../../components/Trailer";

const loadingIcon  = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const { useBreakpoint } = Grid

function MovieUpdateRequests (props) {
    const screens = useBreakpoint()
    const [user, setUser] = useState()
    const [loading, setLoading] = useState()
    const [movies, setMovies] = useState()
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState()
    const [trailer, setTrailer] = useState()

    useEffect(() => {
        if (!user) {
            getUser()
        }        
        getMovies()
    }, [page])   // eslint-disable-line react-hooks/exhaustive-deps

    function getUser () {
        if (props.token) {
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

    function getMovies() {
        setLoading(true)
        var url = `${api.tempfilms}?filmid=1&page=${page}`          
        axios({
            method: 'GET',
            url: url
        }).then(res => {                                         
            console.log(res.data.results)
            setMovies(res.data.results)
            setTotal(res.data.count)
            setLoading(false)
        }).catch(err => {
            message.error("Алдаа гарлаа. Та хуудсаа дахин ачааллуулна уу.")
            console.log(err.message)
            setLoading(false)
        });        
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

    function getGenres (genres) {
        let result = ""
        genres.forEach(item => {
            result = result + item.name + ", "
        })
        return result.slice(0, result.length - 2)
    }

    function showTrailer (url) {               
        setTrailer(url)
    }

    function hideTrailer (id) {
        setTrailer(undefined)
    }

    function onPageChange (pageNum, pageSize) {        
        setPage(pageNum)
    }

    function showTotal(total) {
        return `Нийт ${total} кино:`;
    }

    function onAccept (id) {        
        axios({
            method: 'PUT',
            url: `${api.tempfilms}/${id}/`,
            data: {
                accept: true
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${props.token}`            
            }
        }).then(res => {                        
            if (res.status === 200) {                      
                message.info("Зөвшөөрлөө.")       
                getMovies()                                                             
            }             
        }).catch(err => {   
            message.error("Амжилтгүй боллоо.")
            console.log(err)            
            setLoading(false)          
        })             
    }

    function onDecline (id) {
        axios({
            method: 'PUT',
            url: `${api.tempfilms}/${id}/`,
            data: {
                decline: true
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${props.token}`            
            }
        }).then(res => {                        
            if (res.status === 200) {                      
                message.info("Татгалзлаа.")       
                getMovies()                                                             
            }             
        }).catch(err => {   
            message.error("Амжилтгүй боллоо.")
            console.log(err)            
            setLoading(false)          
        }) 
    }

    function getRoles(role) {
        let result = []
        role.forEach(element => {
            result.push(element.name)    
        });
        return result.toString()
    }

    return (
        <div style={{ marginTop: '80px', minHeight: '80vh' }}>
            <div style={{ padding: getPadding() }}>              
                <Typography.Title level={3}>Кино засварын хүсэлтүүд</Typography.Title>
                { loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                        <Spin indicator={loadingIcon} tip="Уншиж байна..." />
                    </div>
                ) : user && parseInt(user.profile.role) < 3 ? (
                    <>
                        <List
                            itemLayout="vertical"
                            size="large"
                            dataSource={movies ? movies : undefined}
                            footer={
                                <Pagination
                                    current={page}
                                    total={total}
                                    pageSize={20}                                    
                                    showSizeChanger={false}
                                    showTotal={showTotal}
                                    size="small"
                                    onChange={onPageChange}
                                />
                            }
                            renderItem={item => (
                            <List.Item
                                key={item.id}
                                extra={
                                    <img
                                        width={272}
                                        alt="logo"
                                        src={item.movie.landscape}
                                    />
                                }
                                style={{ 
                                    padding: '0px',
                                    marginTop: '16px'
                                }}
                            >
                                <List.Item.Meta
                                    avatar={
                                        <img alt={item.movie.name} src={item.movie.poster} style={{ width: '100px' }} />
                                    }
                                    title={
                                        <Typography.Title level={5}>
                                            {item.movie.name}
                                        </Typography.Title>
                                    }
                                    description={
                                        <div>
                                            <div style={ screens.xs ? { display: 'block' } : { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <Typography.Text>Төрөл: {getGenres(item.movie.genre)}</Typography.Text>
                                                </div>
                                                <div>
                                                    <Typography.Text>Нээлт: {moment(item.movie.releasedate).format("YYYY-MM-DD")}</Typography.Text>
                                                </div>
                                                <div>
                                                    <Typography.Text>Хугацаа: {item.movie.duration} мин</Typography.Text>
                                                </div>
                                                <div>
                                                    <Typography.Text>Насны ангилал: {item.movie.rating ? item.movie.rating : '---'}</Typography.Text>
                                                </div>
                                                <div>
                                                    <Typography.Text>
                                                        Трейлер:              
                                                        <Button type="link" onClick={() => showTrailer(item.movie.trailer)}>Тоглуулах</Button>                                       
                                                        {trailer ? <Trailer title={item.movie.name} trailer={trailer} hide={() => hideTrailer()} /> : <></>}
                                                    </Typography.Text>       
                                                </div>
                                            </div>
                                            <div style={{ marginTop: '8px' }}>                                                                                  
                                                <Typography.Text>Дэлгэрэнгүй:</Typography.Text>
                                                <Typography.Paragraph>
                                                    {item.movie.description}
                                                </Typography.Paragraph>                                            
                                            </div>
                                        </div>
                                    }
                                />
                                <div>
                                    <Typography.Text>Агуулга:</Typography.Text>
                                    <Typography.Paragraph>
                                        {item.movie.plot}
                                    </Typography.Paragraph>
                                    <Typography.Text>Жүжигчид:</Typography.Text>
                                    <Row gutter={[8, 8]} style={{ marginBottom: '16px' }}>
                                        {item.movie.actors.map(actor => {
                                            return (
                                                <Col xs={8} sm={8} md={6} lg={4} xl={4} xxl={3}>
                                                    <Avatar size={80} shape="square" src={actor.artist.avatar} />
                                                    <Typography.Text style={{ display: 'block' }}>{actor.artist.name}</Typography.Text>
                                                    <Typography.Text style={{ display: 'block' }}>Дүр: {actor.role_name}</Typography.Text>
                                                </Col>
                                            )
                                        })}
                                    </Row>
                                    <Typography.Text>Уран бүтээлчид:</Typography.Text>
                                    <Row gutter={[8, 8]} style={{ marginBottom: '16px' }}>
                                        {item.movie.members.map(member => {
                                            return (
                                                <Col xs={8} sm={8} md={6} lg={4} xl={4} xxl={3}>
                                                    <Avatar size={80} shape="square" src={member.artist.avatar} />
                                                    <Typography.Text style={{ display: 'block' }}>{member.artist.name}</Typography.Text>
                                                    <Typography.Text>
                                                        {getRoles(member.role)}
                                                    </Typography.Text> 
                                                </Col>
                                            )
                                        })}
                                    </Row>
                                    <Row gutter={[16, 16]}>
                                        <Col xs={24} sm={24} md={24} lg={12}>
                                            <Button type="primary" icon={<CheckCircleOutlined />} style={{ marginRight: '8px' }} onClick={() => onAccept(item.id)}>Зөвшөөрөх</Button>
                                            <Button danger type="primary" icon={<CloseCircleOutlined />} style={{ marginRight: '8px' }} onClick={() => onDecline(item.id)}>Татгалзах</Button>
                                        </Col>
                                        <Col xs={24} sm={24} md={24} lg={12} style={{ textAlign: 'end' }}>
                                            <Typography.Text>Засварласан: {item.movie.updated_by.username}</Typography.Text>
                                            <br />
                                            <Typography.Text>Он сар өдөр: {moment(item.movie.updated_at).format("YYYY-MM-DD HH:mm:ss")}</Typography.Text>
                                        </Col>
                                    </Row>                                                                    
                                </div>
                            </List.Item>
                            )}
                        />                        
                    </>
                ) : (
                    <Result
                        status="403"
                        title="403"
                        subTitle="Уучлаарай, та эхлээд системд нэвтэрнэ үү."
                        extra={<Button type="primary" href="/login">Нэвтрэх цонх руу шилжих</Button>}
                    />
                )}                
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        token: state.token
    }
}

export default connect(mapStateToProps)(MovieUpdateRequests)