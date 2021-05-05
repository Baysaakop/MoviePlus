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
        var url = api.movies + "?member=" + id             
        axios({
            method: 'GET',
            url: url
        }).then(res => {                                        
            let data = res.data.results                             
            setMembers(data.sort((a, b) => parseInt(a.releasedate.slice(0, 4)) - parseInt(b.releasedate.slice(0, 4))))
        }).catch(err => {
            console.log(err.message)
        });        
    } 
    
    function getActors(id) {
        var url = api.movies + "?actor=" + id             
        axios({
            method: 'GET',
            url: url
        }).then(res => {                                        
            let data = res.data.results                 
            setActors(data.sort((a, b) => parseInt(a.releasedate.slice(0, 4)) - parseInt(b.releasedate.slice(0, 4))))
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
                    {/* <Table bordered columns={memberColumns} dataSource={members ? members : undefined} size="middle" pagination={false} /> */}
                    <Timeline>
                        {members.map(item => {
                            return (
                                <Timeline.Item>
                                    <Typography.Text style={{ fontSize: '16px' }}>
                                        {moment(item.releasedate).format("YYYY")}
                                        <Popover 
                                            title={
                                                <Typography.Title level={5} style={{ margin: 0 }}>
                                                    {item.name}
                                                </Typography.Title>
                                            } 
                                            content={
                                                <div style={{ width: '300px' }}>
                                                    <Row gutter={[8, 8]}>
                                                        <Col span={10}>
                                                            <img alt={item.name} src={item.poster} style={{ width: '100%', height: 'auto' }} />
                                                        </Col>
                                                        <Col span={14}>
                                                            <Typography.Paragraph ellipsis={{ rows: 8 }}>
                                                                {item.description}
                                                            </Typography.Paragraph>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            }
                                        >                                        
                                            <Link to={`/movies/${item.id}`}>
                                                {` - ${item.name} | `}
                                            </Link>
                                        </Popover>
                                        {getRole(item.members)}
                                        {` | Үнэлгээ: ${item.score}%`}
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
                                        {moment(item.releasedate).format("YYYY")} 
                                        <Link to={`/movies/${item.id}`}>
                                            {` - ${item.name}`}
                                        </Link>
                                        {` | Дүр: ${getRoleName(item.actors)}`}
                                        {` | Үнэлгээ: ${item.score}%`}
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