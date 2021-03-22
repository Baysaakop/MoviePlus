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
                            <Avatar size="large" style={{ background: 'rgba(255, 77, 79, 1)', border: '1px solid #fff', color: '#fff' }}>
                                {parseInt(props.item.score) / 10}
                            </Avatar>
                        </div>
                        <div className="cover-overlay-bot-right">
                            {/* <Tooltip title="Трэйлэр үзэх">
                                <Button size="large" type="ghost" shape="circle" icon={<C style={{ marginLeft: '2px' }} />} />
                            </Tooltip> */}
                            <Tooltip title="Таалагдсан">                                
                                <Button size="default" type="ghost" shape="circle" icon={<LikeOutlined />} />
                            </Tooltip>
                            <Tooltip title="Үзсэн">
                                <Button size="default" type="ghost" shape="circle" icon={<CheckOutlined style={{ marginLeft: '2px' }}  />} />
                            </Tooltip>
                            <Tooltip title="Дараа үзэх">
                                <Button size="default" type="ghost" shape="circle" icon={<PlusOutlined />} />
                            </Tooltip>
                            <Tooltip title="Үнэлгээ өгөх">
                                <Button size="default" type="ghost" shape="circle" icon={<StarOutlined />} />
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