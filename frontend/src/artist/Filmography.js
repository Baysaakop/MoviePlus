import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';
import { Col, Popover, Row, Timeline, Typography } from 'antd'
import { Link } from 'react-router-dom'
import moment from 'moment'

function Filmography (props) {    
    const [members, setMembers] = useState();
    const [actors, setActors] = useState();

    useEffect(() => {
        getMembers(props.id)
        getActors(props.id)
    }, [props.id]) // eslint-disable-line react-hooks/exhaustive-deps

    function getMembers(id) {
        var url = api.films + "?member=" + id             
        axios({
            method: 'GET',
            url: url
        }).then(res => {                                   
            let data = res.data.results                                          
            setMembers(data.sort((a, b) => parseInt(a.movie.releasedate.slice(0, 4)) - parseInt(b.movie.releasedate.slice(0, 4))))
        }).catch(err => {
            console.log(err.message)
        });        
    } 
    
    function getActors(id) {
        var url = api.films + "?actor=" + id             
        axios({
            method: 'GET',
            url: url
        }).then(res => {                                        
            let data = res.data.results                 
            setActors(data.sort((a, b) => parseInt(a.movie.releasedate.slice(0, 4)) - parseInt(b.movie.releasedate.slice(0, 4))))
        }).catch(err => {
            console.log(err.message)
        });        
    }

    function getRole(data) {      
        const roles = []
        data.forEach(member => {
            if (member.artist.id === props.id) {
                roles.push(member.role.name)
            }            
        })
        return roles.toString()
    }    

    function getRoleName(data) {
        const roles = []
        data.forEach(actor => {
            if (actor.artist.id === props.id) {
                roles.push(actor.role_name)
            }            
        })
        return roles.toString()
    }    
    
    return (
        <div>        
            { members && members.length > 0 ? (
                <>
                    <Typography.Title level={4}>Кино</Typography.Title>                    
                    <Timeline>
                        {members.map(item => {
                            return (
                                <Timeline.Item>
                                    <Typography.Text style={{ fontSize: '16px' }}>
                                        {moment(item.movie.releasedate).format("YYYY")}
                                        <Popover 
                                            title={
                                                <Typography.Title level={5} style={{ margin: 0 }}>
                                                    {item.movie.name}
                                                </Typography.Title>
                                            } 
                                            content={
                                                <div style={{ width: '300px' }}>
                                                    <Row gutter={[8, 8]}>
                                                        <Col span={10}>
                                                            <img alt={item.movie.name} src={item.movie.poster} style={{ width: '100%', height: 'auto' }} />
                                                        </Col>
                                                        <Col span={14}>
                                                            <Typography.Paragraph ellipsis={{ rows: 8 }}>
                                                                {item.movie.description}
                                                            </Typography.Paragraph>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            }
                                        >                                        
                                            <Link to={`/movies/${item.id}`}>
                                                {` - ${item.movie.name} | `}
                                            </Link>
                                        </Popover>
                                        {getRole(item.movie.members)}
                                        {` | Үнэлгээ: ${item.movie.score}%`}
                                    </Typography.Text>
                                </Timeline.Item>
                            )
                        })}
                    </Timeline>
                </>
            ) : (
                <></>
            )}      
            { actors && actors.length > 0 ? (
                <>
                    <Typography.Title level={4} style={{ marginTop: '8px' }}>Кино (Жүжигчин)</Typography.Title>
                    <Timeline>
                        {actors.map(item => {
                            return (
                                <Timeline.Item>
                                    <Typography.Text style={{ fontSize: '16px' }}>
                                        {moment(item.movie.releasedate).format("YYYY")} 
                                        <Popover 
                                            title={
                                                <Typography.Title level={5} style={{ margin: 0 }}>
                                                    {item.movie.name}
                                                </Typography.Title>
                                            } 
                                            content={
                                                <div style={{ width: '300px' }}>
                                                    <Row gutter={[8, 8]}>
                                                        <Col span={10}>
                                                            <img alt={item.movie.name} src={item.movie.poster} style={{ width: '100%', height: 'auto' }} />
                                                        </Col>
                                                        <Col span={14}>
                                                            <Typography.Paragraph ellipsis={{ rows: 8 }}>
                                                                {item.movie.description}
                                                            </Typography.Paragraph>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            }
                                        >                                        
                                            <Link to={`/movies/${item.id}`}>
                                                {` - ${item.movie.name} | `}
                                            </Link>
                                        </Popover>
                                        {` | Дүр: ${getRoleName(item.movie.actors)}`}
                                        {` | Үнэлгээ: ${item.movie.score}%`}
                                    </Typography.Text>
                                </Timeline.Item>
                            )
                        })}
                    </Timeline>
                </>
            ) : (
                <></>
            )}              
        </div>
    )
}

export default Filmography;