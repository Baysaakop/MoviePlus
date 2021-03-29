import { Avatar, Button, Col, List, Row, Spin, Statistic, Tabs, Tooltip, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../api';
import { CaretRightOutlined, CheckOutlined, LikeOutlined, LoadingOutlined, PlusOutlined, StarFilled, StarOutlined } from '@ant-design/icons';
import './MovieDetail.css';
import GenreTag from '../components/GenreTag';

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
        <div style={{ marginTop: '80px' }}>
            { movie ? (
                <div>
                    <div style={{ height: '60vh' }}>
                        {movie.landscape ? (
                            <img src={movie.landscape} alt="landscape" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: '0.3', backgroundColor: '#000' }} />                        
                        ) : (
                            <div style={{ width: '100%', height: '100%', opacity: '0.5', backgroundColor: '#000' }} />
                        )}                        
                    </div>
                    <div style={{ padding: '0 15%' }} className="moviedetail">
                        <Row gutter={[16, 16]} style={{ marginTop: '-20%', paddingBottom: '40px' }}>
                            <Col xs={24} sm={24} md={12} lg={6}>
                                <img src={movie.poster} alt="poster" style={{ width: '100%', height: 'auto', borderRadius: '5px', boxShadow: '0 6px 16px -8px rgb(0 0 0 / 32%), 0 9px 28px 0 rgb(0 0 0 / 20%), 0 12px 48px 16px rgb(0 0 0 / 12%)' }} />
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={18}>
                                <div style={{ borderRadius: '5px', padding: '16px', marginLeft: '24px', height: '100%' }}>
                                    <Typography.Title level={2} style={{ marginBottom: '0' }}>{movie.name}</Typography.Title>
                                    <div className="info">
                                        { movie.rating ? <Typography.Text type="secondary">Ангилал: {movie.rating ? movie.rating.name : "Null"} |</Typography.Text> : <></> }
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
                                    <div className="rating" style={{ margin: '16px 0' }}>
                                        <Statistic title="Үнэлгээ" value={movie.score} prefix={<StarFilled style={{ color: 'gold' }} />} suffix={<span>/100 <span style={{ fontSize: '16px' }}>({movie.score_count} үнэлгээнээс)</span></span>} />                                        
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
                                                <List                                                                                                        
                                                    itemLayout="horizontal"                                                    
                                                    dataSource={movie.member ? movie.member : undefined}
                                                    renderItem={item => (
                                                    <List.Item>                                                        
                                                        <List.Item.Meta
                                                            avatar={
                                                                <Avatar size="large" src={item.artist.avatar} />
                                                            }
                                                            title={<a href={`/artists/${item.artist.id}`}>{item.artist.name}</a>}
                                                            description={item.artist.occupation.map(occupation => {
                                                                return (
                                                                    <span>{occupation.name} </span>
                                                                )
                                                            })}
                                                        />
                                                        <Typography.Text>
                                                            {item.role.name}
                                                        </Typography.Text>                                                        
                                                    </List.Item>
                                                    )}
                                                />
                                            </Tabs.TabPane>
                                            <Tabs.TabPane tab="Жүжигчид" key="3">
                                                <Typography.Title level={5}>Жүжигчид</Typography.Title>
                                                <List                                                                                                        
                                                    itemLayout="horizontal"                                                    
                                                    dataSource={movie.cast ? movie.cast : undefined}
                                                    renderItem={item => (
                                                    <List.Item>                                                        
                                                        <List.Item.Meta
                                                            avatar={
                                                                <Avatar size="large" src={item.artist.avatar} />
                                                            }
                                                            title={<a href={`/artists/${item.artist.id}`}>{item.artist.name}</a>}
                                                            description={item.artist.occupation.map(occupation => {
                                                                return (
                                                                    <span>{occupation.name} </span>
                                                                )
                                                            })}
                                                        />
                                                        <Typography.Text>
                                                            {item.role_name}
                                                        </Typography.Text>                                                        
                                                    </List.Item>
                                                    )}
                                                />
                                            </Tabs.TabPane>
                                            <Tabs.TabPane tab="Зураг" key="4">
                                                <Typography.Title level={5}>Зураг</Typography.Title>
                                            </Tabs.TabPane>
                                            <Tabs.TabPane tab="Сэтгэгдэл" key="5">
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
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Spin indicator={spinIcon} />
                </div>
            )}                        
        </div>
    )
}

export default MovieDetail;