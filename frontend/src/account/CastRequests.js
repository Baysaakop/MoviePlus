import { CheckOutlined, CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import { Grid, Spin, Typography, message, Button, Row, Col, Result, Avatar, Tag, Pagination } from "antd";
import React, { useEffect, useState } from "react";
import axios from 'axios';  
import api from '../api';
import { connect } from 'react-redux'


const loadingIcon  = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const { useBreakpoint } = Grid

function CastRequests (props) {
    const screens = useBreakpoint()    
    const [user, setUser] = useState()
    const [loading, setLoading] = useState()
    const [cast, setCast] = useState() 
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState()

    useEffect(() => {
        if (!user) {
            getUser()
        }        
        getCast()
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

    function getCast() {
        setLoading(true)
        var url = `${api.tempactors}/`          
        axios({
            method: 'GET',
            url: url
        }).then(res => {                                                     
            setCast(res.data.results)       
            setTotal(res.data.count)     
            setLoading(false)
        }).catch(err => {
            message.error("Алдаа гарлаа. Та хуудсаа дахин ачааллуулна уу.")
            console.log(err.message)
            setLoading(false)
        });        
    }

    function onPageChange (pageNum, pageSize) {        
        setPage(1)
        setPage(pageNum)
    }

    function showTotal(total) {
        return `Нийт ${total}:`;
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

    function onAccept (id) {
        axios({
            method: 'PUT',
            url: `${api.tempactors}/${id}/`,
            data: {
                accept: true
            }
        }).then(res => {
            if (res.status === 200 || res.status === 202) {
                getCast()            
            }            
        }).catch(err => {
            console.log(err)
        })
    }

    function onDecline (id) {
        axios({
            method: 'PUT',
            url: `${api.tempactors}/${id}/`,
            data: {
                decline: true
            }
        }).then(res => {
            if (res.status === 200 || res.status === 202) {
                getCast()            
            }            
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <div style={{ marginTop: '80px', minHeight: '80vh' }}>
            <div style={{ padding: getPadding() }}> 
            <Typography.Title level={3}>Cast update request</Typography.Title>
                { loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                        <Spin indicator={loadingIcon} tip="Уншиж байна..." />
                    </div>
                ) : user && parseInt(user.profile.role) < 3 ? (
                    <>
                        <Row gutter={[8, 8]}>
                            <Col xs={12} sm={8}>
                                <Typography.Text>Кино</Typography.Text>
                            </Col>
                            <Col xs={12} sm={6}>
                                <Typography.Text>Жүжигчин</Typography.Text>
                            </Col>
                            <Col xs={12} sm={6}>
                                <Typography.Text>Дүр</Typography.Text>
                            </Col>
                            <Col xs={12} sm={4}>
                                <Typography.Text>Зөвшөөрөх / Татгалзах</Typography.Text>
                            </Col>
                            { cast.map(element => {
                                return (
                                    <>
                                        <Col xs={12} sm={8} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                            <img alt={element.film.movie.name} src={element.film.movie.poster} style={{ width: '50px', height: 'auto', marginRight: '8px' }} />
                                            <Typography.Text>{element.film.movie.name}</Typography.Text>
                                        </Col>
                                        <Col xs={12} sm={6} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                            <Avatar shape="square" size={50} src={element.artist.avatar} style={{ marginRight: '8px' }} />
                                            <Typography.Text>{element.artist.name}</Typography.Text>
                                        </Col>
                                        <Col xs={12} sm={6} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                            {element.is_delete ?                                                 
                                                <Tag color="#c0392b">DELETE</Tag>
                                            :
                                                <Typography.Text>{element.role_name}</Typography.Text>
                                            }
                                        </Col>
                                        <Col xs={12} sm={4} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                            <Button type="primary" icon={<CheckOutlined />} style={{ marginRight: '8px' }} onClick={() => onAccept(element.id)} />
                                            <Button type="primary" icon={<CloseOutlined />} danger onClick={() => onDecline(element.id)} />
                                        </Col>
                                    </>
                                )                               
                            })}                            
                        </Row>
                        <Pagination
                            style={{ marginTop: '16px' }}
                            current={page}
                            total={total}
                            pageSize={20}                            
                            showSizeChanger={false}
                            showTotal={showTotal}
                            onChange={onPageChange}
                            hideOnSinglePage={true}
                            size="small"
                        />
                    </>
                ) : (
                    <Result
                        status="403"
                        title="403"
                        subTitle="Уучлаарай, танд энэ хуудсанд хандах эрх байхгүй байна."
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

export default connect(mapStateToProps)(CastRequests)