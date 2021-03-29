import { Button, Card, Tooltip } from 'antd';
import React from 'react';
import '../movie/MovieCard.css';
import { UserAddOutlined, HeartOutlined } from '@ant-design/icons';
import blank from '../movie/blank.jpg';

const { Meta } = Card;

function ArtistCard (props) {

    function like () {
        console.log(props.item.id + " like")
    }

    function follow () {
        console.log(props.item.id + " follow")
    }

    return (
        <div>
            {/* <a href={`/movies/${props.item.id}`}> */}
                <Card             
                    size="small"
                    hoverable                 
                    style={{ width: '100%', height: 'auto', border: '0' }}
                    cover={
                        <div className="cover-container" style={{ paddingBottom: '100%', overflow: 'hidden' }}>
                            <a href={`/artists/${props.item.id}`}>
                                <img src={props.item.avatar ? props.item.avatar : blank} alt="poster" style={{ position: 'absolute', width: '100%', height: '100%' }} />
                            </a>
                            <div className="cover-overlay-top-left">
                                {/* <Avatar size="large" style={{ background: '#161b22', border: '1px solid orange', color: 'orange', fontFamily: 'Nerko One, cursive', fontSize: '20px' }}>
                                    99
                                </Avatar>                                 */}
                            </div>
                            <div className="cover-overlay-bot-right">                           
                                <Tooltip title="Таалагдсан">                                
                                    <Button type="ghost" shape="circle" size="large" icon={<HeartOutlined />} onClick={like} />
                                </Tooltip>
                                <Tooltip title="Дагах">
                                    <Button type="ghost" shape="circle" size="large" icon={<UserAddOutlined style={{ marginLeft: '2px' }} />} onClick={follow} />
                                </Tooltip>
                            </div>
                        </div>
                    }
                >
                    <Meta title={props.item.name} description={props.item.birthday ? props.item.birthday : '----'} />
                </Card>
            {/* </a> */}
        </div>
    )
}

export default ArtistCard;