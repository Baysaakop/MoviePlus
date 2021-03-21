import { Card } from 'antd';
import React from 'react';
import { CheckCircleOutlined, EyeOutlined, LikeOutlined } from '@ant-design/icons';

const { Meta } = Card;

function MovieCard (props) {
    return (
        <div>
            <Card 
                hoverable 
                // title={props.item.name} 
                style={{ width: '100%', height: 'auto', border: '0' }}
                cover={<img src={props.item.poster} alt="poster" />}
                actions={[
                    <LikeOutlined key="like" />,
                    <CheckCircleOutlined key="watched" />,
                    <EyeOutlined key="watchlist" />,
                ]}
            >
                <Meta title={props.item.name} description={props.item.releasedate.slice(0, 4)} />
            </Card>
        </div>
    )
}

export default MovieCard;