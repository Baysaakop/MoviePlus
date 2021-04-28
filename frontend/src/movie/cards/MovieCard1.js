import { Button, Card, Progress, Tooltip } from 'antd'
import React, { useState } from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import './MovieCard1.css'
import { CheckOutlined, HeartOutlined, MoreOutlined, PlusOutlined, StarOutlined } from '@ant-design/icons'

function MovieCard1 (props) {

    const [visible, setVisible] = useState(false)

    function getGenre(genres) {
        let result = ""
        genres.slice(0, 2).forEach(genre => {
            result = result + genre.name + ", "
        })
        return result.slice(0, result.length - 2)
    }

    return (
        <div>            
            <Card 
                hoverable 
                cover={
                    <div className="container">
                        <Link to={`/movies/${props.item.id}`}>
                            <img className="poster" alt={props.item.name} src={props.item.poster} />
                        </Link>
                        <div className="overlay-more">
                            <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '4px' }}>
                                <Button type="ghost" shape="circle" icon={<MoreOutlined />} onClick={() => setVisible(!visible)} />
                            </div>
                            { visible ? 
                            <div className="actions">   
                                <Button type="ghost" shape="circle" icon={<HeartOutlined />} />
                                <Button type="ghost" shape="circle" icon={<CheckOutlined />} />
                                <Button type="ghost" shape="circle" icon={<PlusOutlined />} />
                                <Button type="ghost" shape="circle" icon={<StarOutlined />} />
                            </div>
                            : 
                            <></>
                            }
                        </div>
                        <div className="overlay-score">
                            <Progress type="circle" percent={props.item.score} width={40} strokeColor="yellow" />
                        </div>
                    </div>
                } 
                style={{ border: 0 }} 
                size="small"
            >                                    
                <Card.Meta 
                    title={
                        <Tooltip title={props.item.name}>
                            {`${props.item.name} /${moment(props.item.releasedate).format("YYYY")}/`} 
                        </Tooltip>
                    }
                    description={getGenre(props.item.genre)} 
                />
            </Card>            
        </div>
    )
}

export default MovieCard1