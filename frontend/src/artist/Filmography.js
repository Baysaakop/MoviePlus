import { CheckCircleOutlined, EyeOutlined, LikeOutlined, PlusCircleOutlined, StarOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';
import { Table, Typography } from 'antd';

function Filmography (props) {

    const [movies, setMovies] = useState();

    useEffect(() => {
        getMovies()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function getMovies() {
        var url = api.movies + "?artist=" + props.id             
        axios({
            method: 'GET',
            url: url
        }).then(res => {                    
            console.log(res.data.results)                
            setMovies(res.data.results)
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

    function getRole(id) {      
        const movie = movies.find(x => x.id === id)  
        const roles = []
        movie.member.forEach(mem => {
            if (mem.artist.id === props.id) {
                roles.push(mem.role.name)
            }            
        })
        movie.cast.forEach(mem => {
            if (mem.artist.id === props.id) {
                roles.push("Жүжигчин")
            }            
        })
        return roles.toString()
    }

    function getMovieName(id) {      
        const movie = movies.find(x => x.id === id)  
        return movie.name
    }

    const columns = [
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
            render: item => <a href={`/movies/${item}`}>{getMovieName(item)}</a>
        },
        {
            title: 'Үүрэг',
            dataIndex: 'id',
            key: 'id',
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
            title: <EyeOutlined style={{ fontSize: '18px' }} />,
            dataIndex: 'views',
            key: 'views',
            align: 'center',
            render: item => formatCount(item),
        },
        {
            title: <LikeOutlined style={{ fontSize: '18px' }} />,
            dataIndex: 'likes',
            key: 'likes',
            align: 'center',
            render: item => formatCount(item),
        },
        {
            title: <CheckCircleOutlined style={{ fontSize: '18px' }} />,
            dataIndex: 'watched',
            key: 'watched',
            align: 'center',
            render: item => formatCount(item),
        },
        {
            title: <PlusCircleOutlined style={{ fontSize: '18px' }} />,
            dataIndex: 'watchlist',
            key: 'watchlist',
            align: 'center',
            render: item => formatCount(item),
        },
    ];
    
    return (
        <div>
            <Table bordered columns={columns} dataSource={movies} pagination={{ pageSize: 20 }} size="middle" />
        </div>
    )
}

export default Filmography;