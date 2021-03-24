import { Button, Col, Row, Spin, Statistic, Tooltip, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../api';
import { CaretRightOutlined, CheckOutlined, LikeOutlined, LoadingOutlined, PlusOutlined, StarFilled, StarOutlined } from '@ant-design/icons';
import './MovieDetail.css';

const spinIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function MovieDetail (props) {

    const [movie, setMovie] = useState()

    useEffect(() => {
        const id = props.match.params.movieID;
        const url = api.movies + "/" + id + "/";        
        axios({
            method: 'GET',
            url: url
        })
        .then(res => {
            console.log(res.data);
            setMovie(res.data);
        })
        .catch(err => {
            console.log(err.message);
        })
    }, [props.match]);

    return (
        <div>
            { movie ? (
                <div>
                    <div style={{ height: '80vh' }}>
                        <img src={movie.landscape} alt="landscape" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: '0.5', backgroundColor: '#000' }} />                        
                    </div>
                    <div style={{ padding: '0 15%' }} className="moviedetail">
                        <Row gutter={[16, 16]} style={{ marginTop: '-25%' }}>
                            <Col xs={24} sm={24} md={12} lg={6}>
                                <img src={movie.poster} alt="poster" style={{ width: '100%', height: 'auto', borderRadius: '5px', boxShadow: '0 6px 16px -8px rgb(0 0 0 / 32%), 0 9px 28px 0 rgb(0 0 0 / 20%), 0 12px 48px 16px rgb(0 0 0 / 12%)' }} />
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={18}>
                                <div style={{ background: 'rgba(22, 27, 34, 0.5)', borderRadius: '5px', padding: '8px', marginLeft: '24px', height: '100%' }}>
                                    <Typography.Title level={2}>{movie.name}</Typography.Title>
                                    <div className="actions">                                        
                                        <Tooltip title="Трэйлэр үзэх">
                                            <Button size="large" type="ghost" shape="circle" icon={<CaretRightOutlined style={{ marginLeft: '2px' }} />} />
                                        </Tooltip>
                                        <Tooltip title="Таалагдсан">
                                            <Button size="large" type="ghost" shape="circle" icon={<LikeOutlined />} />
                                        </Tooltip>
                                        <Tooltip title="Үзсэн">
                                            <Button size="large" type="ghost" shape="circle" icon={<CheckOutlined style={{ marginLeft: '2px' }}  />} />
                                        </Tooltip>
                                        <Tooltip title="Дараа үзэх">
                                            <Button size="large" type="ghost" shape="circle" icon={<PlusOutlined />} />
                                        </Tooltip>
                                        <Tooltip title="Үнэлгээ өгөх">
                                            <Button size="large" type="ghost" shape="circle" icon={<StarOutlined />} />
                                        </Tooltip>
                                    </div>
                                    <div className="rating" style={{ padding: '16px 8px' }}>
                                        <Statistic title="Үнэлгээ" value={movie.score} prefix={<StarFilled style={{ color: 'gold' }} />} suffix="/100" />
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Spin indicator={spinIcon} />
                </div>
            )}                        
        </div>
    )
}

export default MovieDetail;