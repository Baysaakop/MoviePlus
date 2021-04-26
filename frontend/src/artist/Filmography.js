import { CheckCircleOutlined, LikeOutlined, PlusCircleOutlined, StarOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';
import { Table, Typography } from 'antd';

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

    function getName(id, movies) {
        return movies ? movies.find(x => x.id === id).name : ""
    }

    function formatCount(count) {
        if (count >= 1000000) {
            return (count / 1000000).toFixed(1).toString() + "M";
        } else if (count >= 1000) {
            return (count / 1000).toFixed(1).toString() + "K";
        } else {
            return count.toString();
        }
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

    const memberColumns = [
        {
            title: 'Он',
            dataIndex: 'releasedate',
            key: 'releasedate',            
            render: item => item ? item.toString().slice(0, 4) : '----',            
        },
        {
            title: 'Кино',
            dataIndex: 'id',
            key: 'id',       
            render: item => <a href={`/movies/${item}/`}>{getName(item, members ? members : undefined)}</a>     
        },
        {
            title: 'Үүрэг',
            dataIndex: 'members',
            key: 'members',
            render: item => <Typography.Text>{getRole(item)}</Typography.Text>,
        },
        {
            title: <StarOutlined style={{ fontSize: '18px' }} />,
            dataIndex: 'score',
            key: 'score',
            align: 'center',            
            render: item => item / 10
        },
        {
            title: <LikeOutlined style={{ fontSize: '18px' }} />,
            dataIndex: 'likes',
            key: 'likes',
            align: 'center',
            render: item => formatCount(item.length),
        },
        {
            title: <CheckCircleOutlined style={{ fontSize: '18px' }} />,
            dataIndex: 'checks',
            key: 'checks',
            align: 'center',
            render: item => formatCount(item.length),
        },
        {
            title: <PlusCircleOutlined style={{ fontSize: '18px' }} />,
            dataIndex: 'watchlists',
            key: 'watchlists',
            align: 'center',
            render: item => formatCount(item.length),
        },
    ];

    const actorColumns = [
        {
            title: 'Он',
            dataIndex: 'releasedate',
            key: 'releasedate',            
            render: item => item ? item.toString().slice(0, 4) : '----',            
        },
        {
            title: 'Кино',
            dataIndex: 'id',
            key: 'id',       
            render: item => <a href={`/movies/${item}/`}>{getName(item, actors ? actors : undefined)}</a>     
        },
        {
            title: 'Дүр',
            dataIndex: 'actors',
            key: 'actors',
            render: item => <Typography.Text>{getRoleName(item)}</Typography.Text>,
        },
        {
            title: <StarOutlined style={{ fontSize: '18px' }} />,
            dataIndex: 'score',
            key: 'score',
            align: 'center',            
            render: item => item / 10
        },
        {
            title: <LikeOutlined style={{ fontSize: '18px' }} />,
            dataIndex: 'likes',
            key: 'likes',
            align: 'center',
            render: item => formatCount(item.length),
        },
        {
            title: <CheckCircleOutlined style={{ fontSize: '18px' }} />,
            dataIndex: 'checks',
            key: 'checks',
            align: 'center',
            render: item => formatCount(item.length),
        },
        {
            title: <PlusCircleOutlined style={{ fontSize: '18px' }} />,
            dataIndex: 'watchlists',
            key: 'watchlists',
            align: 'center',
            render: item => formatCount(item.length),
        },
    ];
    
    return (
        <div>        
            { members && members.length > 0 ? (
                <>
                    <Typography.Title level={5}>Уран бүтээлүүд</Typography.Title>
                    <Table bordered columns={memberColumns} dataSource={members ? members : undefined} size="middle" />
                </>
            ) : (
                <></>
            )}      
            { actors && actors.length > 0 ? (
                <>
                    <Typography.Title level={5}>Уран бүтээлүүд (Жүжигчин)</Typography.Title>
                    <Table bordered columns={actorColumns} dataSource={actors ? actors : undefined} size="middle" />
                </>
            ) : (
                <></>
            )}              
        </div>
    )
}

export default Filmography;