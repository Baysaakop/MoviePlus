import { Avatar, Button, Card, Tooltip } from 'antd';
import React from 'react';
import './MovieCard.css';
import { CheckOutlined, PlusOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons';

const { Meta } = Card;

function MovieCard (props) {
    return (
        <div>
            <Card 
                size="small"
                hoverable                 
                style={{ width: '100%', height: 'auto', border: '0' }}
                cover={
                    <div className="cover-container">
                        <img src={props.item.poster} alt="poster" style={{ width: '100%', height: 'auto' }} />
                        <div className="cover-overlay-top-left">
                            <Avatar size="large" style={{ background: '#161b22', border: '1px solid orange', color: 'orange', fontFamily: 'Nerko One, cursive', fontSize: '20px' }}>
                                {parseInt(props.item.score)}
                            </Avatar>
                        </div>
                        <div className="cover-overlay-bot-right">
                            {/* <Tooltip title="Трэйлэр үзэх">
                                <Button size="large" type="ghost" shape="circle" icon={<C style={{ marginLeft: '2px' }} />} />
                            </Tooltip> */}
                            <Tooltip title="Таалагдсан">                                
                                <Button type="ghost" shape="circle" size="large" icon={<LikeOutlined />} />
                            </Tooltip>
                            <Tooltip title="Үзсэн">
                                <Button type="ghost" shape="circle" size="large" icon={<CheckOutlined style={{ marginLeft: '2px' }}  />} />
                            </Tooltip>
                            <Tooltip title="Дараа үзэх">
                                <Button type="ghost" shape="circle" size="large" icon={<PlusOutlined />} />
                            </Tooltip>
                            <Tooltip title="Үнэлгээ өгөх">
                                <Button type="ghost" shape="circle" size="large" icon={<StarOutlined />} />
                            </Tooltip>
                        </div>
                    </div>
                }
            >
                <Meta title={props.item.name} description={props.item.releasedate.slice(0, 4)} />
            </Card>
        </div>
    )
}

export default MovieCard;