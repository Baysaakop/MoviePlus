import React, { useEffect, useState } from 'react';
import { Grid, Typography, Button, Breadcrumb, Result, Menu, Row, Col, message, Spin } from 'antd';
import axios from 'axios';
import api from '../../api';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import MovieUpdateInfo from './MovieUpdateInfo';
import MovieUpdateCast from './MovieUpdateCast';
import MovieUpdateCrew from './MovieUpdateCrew';
import { LoadingOutlined } from '@ant-design/icons';

const loadingIcon  = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const { useBreakpoint } = Grid;

function MovieUpdate (props) {
    const screens = useBreakpoint()
    const [key, setKey] = useState("1")
    const [movie, setMovie] = useState()
    const [loading, setLoading] = useState()

    useEffect(() => {         
        getMovie()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function getMovie() {        
        setLoading(true)
        const id = props.match.params.movieID
        const url = api.films + "/" + id + "/";  
        axios({
            method: 'GET',
            url: url,
            headers: {
                'Content-Type': 'application/json'                
            }
        })
        .then(res => {
            let target = res.data              
            setMovie(target)
            setLoading(false)
        })
        .catch(err => {
            message.error("Алдаа гарлаа. Та хуудсаа дахин ачааллуулна уу.")
        })
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

    function onSelect (e) {
        setKey(e.key)
    }

    return (
        <div style={{ marginTop: '80px', minHeight: '80vh' }}>
            { loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    <Spin indicator={loadingIcon} tip="Уншиж байна..." />
                </div>
            ) : (
                <div>
                    {movie ? (
                        <div>
                            <div style={{ padding: getPadding() }}>
                                <Breadcrumb>
                                    <Breadcrumb.Item>
                                        <Link to="/">Нүүр</Link>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item>
                                        <Link to="/movies">Кино</Link>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item>
                                        <Link to={`/movies/${movie.id}`}>{movie.movie.name}</Link>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item>
                                        Засварлах
                                    </Breadcrumb.Item>
                                </Breadcrumb>
                            </div>        
                            { props.token ? (
                                <div style={{ padding: getPadding() }}>
                                    <Typography.Title level={3}>Кино Засварлах</Typography.Title>
                                    <Row gutter={[16 ,16]}>
                                        <Col xs={24} sm={24} md={4}>
                                            <Menu mode="inline" theme="dark" style={{ width: '100%', backgroundColor: '#161b22' }} selectedKeys={key} onClick={onSelect}>
                                                <Menu.Item key="1">Ерөнхий</Menu.Item>
                                                <Menu.Item key="2">Бүрэлдэхүүн</Menu.Item>
                                                <Menu.Item key="3">Жүжигчин</Menu.Item>
                                            </Menu>  
                                        </Col>
                                        <Col xs={24} sm={24} md={20}>
                                            { 
                                            key === "1" ?
                                                <MovieUpdateInfo movieID={movie.id} token={props.token} />
                                            : key === "2" ?
                                                <MovieUpdateCrew movieID={movie.id} token={props.token} />
                                            : key === "3" ?
                                                <MovieUpdateCast movieID={movie.id} token={props.token} />
                                            : 
                                                <></> 
                                            }
                                        </Col>
                                    </Row>                    
                                </div>
                            ) : (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                                    <Result
                                        status="403"
                                        title="403"
                                        subTitle="Уучлаарай, та эхлээд системд нэвтэрнэ үү."
                                        extra={<Button type="primary" href="/login">Нэвтрэх цонх руу шилжих</Button>}
                                    />
                                </div>
                            )}   
                        </div>
                    ) : (
                        <></>
                    )}
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

export default connect(mapStateToProps)(MovieUpdate);