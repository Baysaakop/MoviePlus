import { CheckCircleOutlined, LikeOutlined, PlusCircleOutlined, StarOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';
import { Table, Typography } from 'antd';

function Filmography (props) {    
    const [members, setMembers] = useState();

    useEffect(() => {
        getMembers(props.id)
    }, [props.id]) // eslint-disable-line react-hooks/exhaustive-deps

    function getMembers(id) {
        var url = api.members + "?artist=" + id             
        axios({
            method: 'GET',
            url: url
        }).then(res => {                                
            let data = res.data.results                 
            setMembers(data.sort((a, b) => parseInt(a.movie.releasedate.slice(0, 4)) - parseInt(b.movie.releasedate.slice(0, 4)))           )
        }).catch(err => {
            console.log(err.message)
        });        
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
        data.forEach(role => {
            roles.push(role.name)
        })
        return roles.toString()
    }    

    const columns = [
        {
            title: 'Он',
            dataIndex: 'movie',
            key: 'movie',            
            render: item => item ? item.releasedate.toString().slice(0, 4) : '----',            
        },
        {
            title: 'Кино',
            dataIndex: 'movie',
            key: 'movie',
            render: item => <a href={`/movies/${item.id}`}>{item.name}</a>
        },
        {
            title: 'Үүрэг',
            dataIndex: 'role',
            key: 'role',
            render: item => <Typography.Text>{getRole(item)}</Typography.Text>,
        },
        {
            title: <StarOutlined style={{ fontSize: '18px' }} />,
            dataIndex: 'movie',
            key: 'movie',
            align: 'center',            
            render: item => item.score / 10
        },
        // {
        //     title: <EyeOutlined style={{ fontSize: '18px' }} />,
        //     dataIndex: 'movie',
        //     key: 'movie',
        //     align: 'center',
        //     render: item => formatCount(item.view_count),
        // },
        {
            title: <LikeOutlined style={{ fontSize: '18px' }} />,
            dataIndex: 'movie',
            key: 'movie',
            align: 'center',
            render: item => formatCount(item.like_count),
        },
        {
            title: <CheckCircleOutlined style={{ fontSize: '18px' }} />,
            dataIndex: 'movie',
            key: 'movie',
            align: 'center',
            render: item => formatCount(item.check_count),
        },
        {
            title: <PlusCircleOutlined style={{ fontSize: '18px' }} />,
            dataIndex: 'movie',
            key: 'movie',
            align: 'center',
            render: item => formatCount(item.watchlist_count),
        },
    ];
    
    return (
        <div>
            <Table bordered columns={columns} dataSource={members ? members.sort((a, b) => b.movie.releasedate - a.movie.releasedate) : undefined} pagination={{ pageSize: 20 }} size="middle" />
        </div>
    )
}

export default Filmography;