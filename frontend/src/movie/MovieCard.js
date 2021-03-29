import { Avatar, Button, Card, Tooltip } from 'antd';
import React from 'react';
import './MovieCard.css';
import { CheckOutlined, PlusOutlined, LikeOutlined } from '@ant-design/icons';
import blank from './blank.jpg';

const { Meta } = Card;

function MovieCard (props) {

    function like () {
        console.log(props.item.id + " like")
    }

    function watched () {
        console.log(props.item.id + " watched")
    }

    function watchlist () {
        console.log(props.item.id + " watchlist")
    }

    return (
        <div>
            {/* <a href={`/movies/${props.item.id}`}> */}
                <Card             
                    size="small"
                    hoverable                 
                    style={{ width: '100%', height: 'auto', border: '0' }}
                    cover={
                        <div className="cover-container">
                            <a href={`/movies/${props.item.id}`}>
                                <img src={props.item.poster ? props.item.poster : blank} alt="poster" style={{ width: '100%', height: 'auto' }} />
                            </a>
                            <div className="cover-overlay-top-left">
                                <Avatar size="large" style={{ background: '#161b22', border: '1px solid orange', color: 'orange', fontFamily: 'Nerko One, cursive', fontSize: '20px' }}>
                                    {parseInt(props.item.score)}
                                </Avatar>                                
                            </div>
                            <div className="cover-overlay-bot-right">                           
                                <Tooltip title="Таалагдсан">                                
                                    <Button type="ghost" shape="circle" size="large" icon={<LikeOutlined />} onClick={like} />
                                </Tooltip>
                                <Tooltip title="Үзсэн">
                                    <Button type="ghost" shape="circle" size="large" icon={<CheckOutlined style={{ marginLeft: '2px' }} />} onClick={watched} />
                                </Tooltip>
                                <Tooltip title="Дараа үзэх">
                                    <Button type="ghost" shape="circle" size="large" icon={<PlusOutlined />} onClick={watchlist} />
                                </Tooltip>
                                {/* <Tooltip title="Үнэлгээ өгөх">
                                    <Button type="ghost" shape="circle" size="large" icon={<StarOutlined />} />
                                </Tooltip> */}
                            </div>
                        </div>
                    }
                >
                    <Meta title={props.item.name} description={props.item.releasedate ? props.item.releasedate.slice(0, 4) : 'Null'} />
                </Card>
            {/* </a> */}
        </div>
    )
}

export default MovieCard;