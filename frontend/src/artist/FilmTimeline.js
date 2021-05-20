import { Col, Popover, Row, Timeline, Typography } from "antd"
import axios from 'axios';
import api from '../api';
import { Link } from 'react-router-dom'
import moment from 'moment'

function FilmTimeline (props) {

    function getFilmId (movie) {
        let id = 0
        axios({
            method: 'GET',
            url: `${api.films}?movie=${movie}`
        }).then(res => {
            id = res.data.results[0].id
        }).catch(err => {
            console.log(err)
        })
        return id
    }

    function getRoles (roles) {
        let arr = []
        roles.forEach(role => {
            arr.push(role.name)
        })
        return arr.toString()
    }   

    return (
        <div>
            { props.list ? (
                <Timeline>
                    {props.list.map(item => {
                        return (
                            <Timeline.Item>
                                <Typography.Text style={{ fontSize: '16px' }}>
                                    {moment(item.film.movie.releasedate).year()}
                                    <Popover 
                                        title={
                                            <Typography.Title level={5} style={{ margin: 0 }}>
                                                {item.film.movie.name}
                                            </Typography.Title>
                                        } 
                                        content={
                                            <div style={{ width: '300px' }}>
                                                <Row gutter={[8, 8]}>
                                                    <Col span={10}>
                                                        <img alt={item.film.movie.name} src={item.film.movie.poster} style={{ width: '100%', height: 'auto' }} />
                                                    </Col>
                                                    <Col span={14}>
                                                        <Typography.Paragraph ellipsis={{ rows: 8 }}>
                                                            {item.film.movie.description}
                                                        </Typography.Paragraph>
                                                    </Col>
                                                </Row>
                                            </div>
                                        }
                                    >                                        
                                        <Link to={`/movies/${item.film.id}`}>
                                            {` - ${item.film.movie.name} | `}
                                        </Link>
                                    </Popover>
                                    { item.role ?
                                        <Typography.Text>{getRoles(item.role)}</Typography.Text>
                                    : item.role_name ?
                                        <Typography.Text>{item.role_name}</Typography.Text>
                                    : <></>}                                    
                                    {/* {` | Үнэлгээ: ${item.movie.score}%`} */}
                                </Typography.Text>
                            </Timeline.Item>
                        )
                    })}
                </Timeline>
            ) : (
                <></>
            )}            
        </div>
    )
}

export default FilmTimeline