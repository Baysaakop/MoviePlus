import React, { useEffect, useState } from 'react';
import { Typography, Form, Input, Row, Col, Select, Spin, Button, message, Tabs } from 'antd';
import { connect } from "react-redux";
import axios from 'axios';
import api from '../api';

const { Search } = Input;
const { Option } = Select;

function ArtistAddMovie (props) {
    const [occupations, setOccupations] = useState();    
    const [aLoading, setALoading] = useState(false);
    const [mLoading, setMLoading] = useState(false);
    const [artists, setArtists] = useState();
    const [movies, setMovies] = useState();
    const [artist, setArtist] = useState();
    const [movie, setMovie] = useState();

    useEffect(() => {
        axios({
            method: 'GET',
            url: `${api.occupations}/`
        })
        .then(res => {                        
            setOccupations(res.data.results);                    
        })        
        .catch(err => {
            console.log(err.message);
        })  
    }, [])

    function onArtistSearch(value) {                
        setALoading(true)
        axios({
            method: 'GET',
            url: api.artists + "?name=" + value
        })
        .then(res => {                        
            setArtists(res.data.results);        
            setALoading(false)    
        })        
        .catch(err => {
            console.log(err.message);
        })      
    }

    function selectArtist (value) {                        
        const target = artists.find(x => x.id === parseInt(value))             
        setArtist(target)
    }

    function onMovieSearch(value) {                
        setMLoading(true)
        axios({
            method: 'GET',
            url: api.movies + "?name=" + value
        })
        .then(res => {                        
            setMovies(res.data.results);        
            setMLoading(false)    
        })        
        .catch(err => {
            console.log(err.message);
        })      
    }

    function selectMovie (value) {                        
        const target = movies.find(x => x.id === parseInt(value))             
        setMovie(target)
    }

    function onFinishActor (values) {
        const data = {            
            artist: artist.id,
            role_name: values.role_name ? values.role_name : "",
            token: props.token
        }
        axios({
            method: 'PUT',
            url: `${api.movies}/${movie.id}/`,
            data: data,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${props.token}`            
            }
        }).then(res => {                        
            if (res.status === 201 || res.status === 200) {      
                console.log(res)                   
                message.success("Амжилттай.")                     
            }             
        }).catch(err => {   
            message.error("Амжилтгүй боллоо."); 
            console.log(err);            
        }) 
    }

    function onFinishMember (values) {
        const data = {            
            artist: artist.id,
            role : values.role ? values.role : undefined,
            token: props.token
        }        
        axios({
            method: 'PUT',
            url: `${api.movies}/${movie.id}/`,
            data: data,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${props.token}`            
            }
        }).then(res => {                        
            if (res.status === 201 || res.status === 200) {                  
                message.success("Амжилттай.")                     
            }             
        }).catch(err => {   
            message.error("Амжилтгүй боллоо."); 
            console.log(err);            
        }) 
    }

    return (
        <div>
            <Row gutter={16}>
                <Col sm={24} md={12}>
                    <Typography.Text>Уран бүтээлч хайх:</Typography.Text>   
                    <Search placeholder="Уран бүтээлчийн нэрийг бичиж хайна уу" onSearch={onArtistSearch} enterButton style={{ margin: '8px 0' }} />
                </Col>
                <Col sm={24} md={12}>
                    <Typography.Text>Уран бүтээлч сонгох:</Typography.Text>   
                    { aLoading ? (
                        <div style={{ width: '100%', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Spin />
                        </div>
                    ) : (
                        <Select
                            showSearch                
                            style={{ width: '100%', margin: '8px 0' }}
                            placeholder="Уран бүтээлч сонгоно уу"                
                            onSelect={selectArtist}
                            optionFilterProp="children"                            
                        >
                            { artists ? (
                                <>
                                    {artists.map(item => {
                                        return (
                                            <Option key={item.id}>{item.name}</Option>
                                        )
                                    })}
                                </>
                            ) : (
                                <></>
                            )}
                        </Select> 
                    )}                    
                </Col>
            </Row>
            { artist ? (
                <>
                    <Row gutter={16}>
                        <Col sm={24} md={12}>
                            <Typography.Text>Кино хайх:</Typography.Text>   
                            <Search placeholder="Киноны нэрийг бичиж хайна уу" onSearch={onMovieSearch} enterButton style={{ margin: '8px 0' }} />
                        </Col>
                        <Col sm={24} md={12}>
                            <Typography.Text>Кино сонгох:</Typography.Text>   
                            { mLoading ? (
                                <div style={{ width: '100%', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Spin />
                                </div>
                            ) : (
                                <Select
                                    showSearch                
                                    style={{ width: '100%', margin: '8px 0' }}
                                    placeholder="Кино сонгоно уу"                
                                    onSelect={selectMovie}
                                    optionFilterProp="children"                            
                                >
                                    { movies ? (
                                        <>
                                            {movies.map(item => {
                                                return (
                                                    <Option key={item.id}>{item.name}</Option>
                                                )
                                            })}
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                </Select> 
                            )}                    
                        </Col>
                    </Row>
                    { movie ? (
                    <Tabs defaultActiveKey="1">
                        <Tabs.TabPane key="1" tab="Жүжигчин">
                            <Form layout="vertical" onFinish={onFinishActor}>                           
                                <Form.Item name="role_name" label="Дүр">
                                    <Input />
                                </Form.Item>
                                <Button htmlType="submit" type="primary" style={{ marginRight: '8px' }}>
                                    Хадгалах   
                                </Button>                           
                            </Form>
                        </Tabs.TabPane>
                        <Tabs.TabPane key="2" tab="Бүрэлдэхүүн">
                            <Form layout="vertical" onFinish={onFinishMember}>                           
                                <Form.Item name="role" label="Үүрэг" rules={[{ required: true, message: 'Үүрэг сонгоно уу.' }]}>
                                    <Select
                                        showSearch               
                                        // mode="multiple" 
                                        style={{ width: '100%' }}                                        
                                        placeholder="Үүрэг сонгоно уу"                                                        
                                        optionFilterProp="children"                            
                                    >
                                        { occupations ? (
                                            <>
                                                {occupations.filter(x => x.id !== 1).map(item => {
                                                    return (
                                                        <Option key={item.id}>{item.name}</Option>
                                                    )
                                                })}
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                    </Select>                    
                                </Form.Item>
                                <Button htmlType="submit" type="primary" style={{ marginRight: '8px' }}>
                                    Хадгалах   
                                </Button>                         
                            </Form>
                        </Tabs.TabPane>
                    </Tabs>
                    ) : (<></>)}                    
                </>
            ) : 
                <></>
            }
        </div>
    )
}

const mapStateToProps = state => {
    return {
        token: state.token
    }
}

export default connect(mapStateToProps)(ArtistAddMovie);