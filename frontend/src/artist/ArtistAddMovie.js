import React, { useEffect, useState } from 'react';
import { Typography, Form, Input, Row, Col, Select, Spin, Button, Popconfirm, message } from 'antd';
import { connect } from "react-redux";
import axios from 'axios';
import api from '../api';

const { Search } = Input;
const { Option } = Select;

function ArtistAddMovie (props) {
    const [form] = Form.useForm();
    const [occupations, setOccupations] = useState();    
    const [aLoading, setALoading] = useState(false);
    const [mLoading, setMLoading] = useState(false);
    const [artists, setArtists] = useState();
    const [movies, setMovies] = useState();
    const [artist, setArtist] = useState();
    const [movie, setMovie] = useState();
    const [isActor, setIsActor] = useState(false);

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

    function selectRole (values) {                
        let check = false
        values.forEach(x => {
            if (x === "1") {
                check = true
            }
        })        
        setIsActor(check)
    }

    function onFinish (values) {
        console.log(values)
        const data = {            
            artist: artist.id,
            movie: movie.id,
            role: values.role ? values.role : undefined,
            role_name: values.role_name ? values.role_name : ""
        }
        axios({
            method: 'POST',
            url: `${api.members}/`,
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
                        <Form layout="vertical" form={form} onFinish={onFinish}>
                            <Row gutter={16}>
                                <Col sm={24} md={12}>                                    
                                    <Form.Item name="role" label="Үүрэг">
                                        <Select
                                            showSearch               
                                            mode="multiple" 
                                            style={{ width: '100%' }}
                                            onChange={selectRole}
                                            placeholder="Үүрэг сонгоно уу"                                                        
                                            optionFilterProp="children"                            
                                        >
                                            { occupations ? (
                                                <>
                                                    {occupations.map(item => {
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
                                </Col>
                                <Col sm={24} md={12}>
                                    <Form.Item name="role_name" label="Дүр">
                                        <Input disabled={!isActor} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Popconfirm title="Хадгалах уу？" okText="Тийм" cancelText="Үгүй" onConfirm={form.submit}>
                                <Button type="primary" style={{ marginRight: '8px' }}>
                                    Хадгалах   
                                </Button>
                            </Popconfirm>                            
                        </Form>
                    ) : (
                        <></>
                    )}
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