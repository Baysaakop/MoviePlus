import { PlusOutlined } from '@ant-design/icons';
import { Form, Row, Col, Input, InputNumber, Select, Button, Popconfirm, DatePicker, message, Radio } from 'antd';
import React, { useState, useEffect } from 'react';
import ImageUpload from '../components/ImageUpload';
import axios from 'axios';
import api from '../api';
import { connect } from "react-redux";
import moment from 'moment';

const { TextArea } = Input;
const { Option } = Select;

function SeriesAdd (props) {
    const [form] = Form.useForm();    
    const [poster, setPoster] = useState();
    const [landscape, setLandscape] = useState();
    const [ratings, setRatings] = useState(); 
    const [genres, setGenres] = useState(); 

    useEffect(() => {
        axios({
            method: 'GET',                        
            url: api.ratings
        })
        .then(res => {                        
            setRatings(res.data.results);            
        })        
        .catch(err => {
            console.log(err.message);
        }) 
        axios({
            method: 'GET',                        
            url: api.genres
        })
        .then(res => {                        
            setGenres(res.data.results);            
        })        
        .catch(err => {
            console.log(err.message);
        })        
    }, []) // eslint-disable-line react-hooks/exhaustive-deps
    
    function onFinish (values) {      
        console.log(values)            
        const data = {
            name: values.name,
            token: props.token
        }
        if (values.description && values.description !== null) {
            data['description'] = values.description;
        }
        if (values.plot && values.plot !== null) {
            data['plot'] = values.plot;
        }
        if (values.releasedate && values.releasedate !== null) {            
            data['releasedate'] = moment(values.releasedate).format("YYYY-MM-DD");
        }
        if (values.duration && values.duration !== null) {            
            data['duration'] = values.duration;
        }
        if (values.season_count && values.season_count !== null) {            
            data['season_count'] = values.season_count;
        }
        if (values.episode_count && values.episode_count !== null) {            
            data['episode_count'] = values.episode_count;
        }
        if (values.is_released && values.is_released !== null) {            
            data['is_released'] = values.is_released;
        }
        if (values.on_tv && values.on_tv !== null) {            
            data['on_tv'] = values.on_tv;
        }
        if (values.is_finished && values.is_finished !== null) {            
            data['is_finished'] = values.is_finished;
        }
        if (values.rating && values.rating !== null) {            
            data['rating'] = values.rating;
        }
        if (values.genre && values.genre !== null && values.genre.length > 0 && values.genre[0] !== "") {
            data['genre'] = values.genre;
        }
        if (values.trailer && values.trailer !== null) {            
            data['trailer'] = values.trailer;
        }
        var formData = new FormData();
        if (poster && poster !== null) {
            formData.append('poster', poster)               
        }
        if (landscape && landscape !== null) {
            formData.append('landscape', landscape)            
        }
        formData.append('token', props.token)
        axios({
            method: 'POST',
            url: `${api.series}/`,
            data: data,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${props.token}`            
            }
        }).then(res => {                        
            if (res.status === 201 || res.status === 200) {      
                console.log(res)
                axios({
                    method: 'PUT',
                    url: `${api.series}/${res.data.id}/`,
                    data: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Token ${props.token}`            
                    }
                }).then(res => {                        
                    if (res.status === 201 || res.status === 200) {                
                        message.info("Нэмэгдлээ.");
                        form.resetFields();
                    }             
                }).catch(err => {   
                    message.error("Амжилтгүй боллоо."); 
                    console.log(err);            
                })                          
            }             
        }).catch(err => {   
            message.error("Амжилтгүй боллоо."); 
            console.log(err);            
        })        
    }

    function onPosterSelected (path) {        
        setPoster(path);
    }

    function onLandscapeSelected (path) {        
        setLandscape(path);
    }

    return (
        <div>
            <Form layout="vertical" form={form} onFinish={onFinish}>
                <Form.Item name="name" label="Нэр:" rules={[{ required: true, message: 'Цувралын нэрийг оруулна уу!' }]}>
                    <Input />
                </Form.Item>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={12}>
                        <Form.Item name="description" label="Дэлгэрэнгүй:">
                            <TextArea rows={8} />
                        </Form.Item>  
                    </Col>
                    <Col xs={24} sm={24} md={12}>
                        <Form.Item name="plot" label="Агуулга:">
                            <TextArea rows={8} />
                        </Form.Item>  
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col xs={12} sm={8} md={6}>
                        <Form.Item name="duration" label="Хугацаа:">
                            <InputNumber defaultValue={0} min={0} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col xs={12} sm={8} md={6}>
                        <Form.Item name="releasedate" label="Нээлт:">
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col xs={12} sm={8} md={6}>
                        <Form.Item name="rating" label="Насны ангилал:">                        
                            <Select
                                showSearch                                
                                placeholder="Ангилал сонгоно уу"                                                
                                optionFilterProp="children"                                
                            >
                                { ratings ? (
                                    <>
                                        {ratings.map(item => {
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
                    <Col xs={12} sm={8} md={6}>
                        <Form.Item name="genre" label="Төрөл жанр:">                        
                            <Select
                                showSearch
                                mode="multiple"
                                placeholder="Төрөл сонгоно уу"                                                
                                optionFilterProp="children"                                
                            >
                                { genres ? (
                                    <>
                                        {genres.map(item => {
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
                </Row>
                <Form.Item name="trailer" label="Трейлер:">
                    <Input />
                </Form.Item>
                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item name="season_count" label="Улирлын тоо">
                            <InputNumber defaultValue={1} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item name="episode_count" label="Ангийн тоо">
                            <InputNumber defaultValue={1} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>       
                    <Col xs={24} sm={8}>                        
                        <Form.Item name="is_released" label="Нээлтээ хийсэн:">                               
                            <Radio.Group defaultValue={true}>
                                <Radio value={true}>Тийм</Radio>
                                <Radio value={false}>Үгүй</Radio>
                            </Radio.Group> 
                        </Form.Item>
                    </Col>             
                    <Col xs={24} sm={8}>                        
                        <Form.Item name="on_tv" label="Одоо гарч буй:">                               
                            <Radio.Group defaultValue={false}>
                                <Radio value={true}>Тийм</Radio>
                                <Radio value={false}>Үгүй</Radio>
                            </Radio.Group>          
                        </Form.Item>
                    </Col>   
                    <Col xs={24} sm={8}>                        
                        <Form.Item name="is_finished" label="Дууссан:">                               
                            <Radio.Group defaultValue={true}>
                                <Radio value={true}>Тийм</Radio>
                                <Radio value={false}>Үгүй</Radio>
                            </Radio.Group>          
                        </Form.Item>
                    </Col>                                   
                </Row>
                <Row gutter={16}>       
                    <Col xs={24} sm={12} md={12} lg={8}>                        
                        <Form.Item name="poster" label="Постер:">                               
                            <ImageUpload onImageSelected={onPosterSelected} height="300px" width="200px" />                        
                        </Form.Item>
                    </Col>             
                    <Col xs={24} sm={12} md={12} lg={16}>                        
                        <Form.Item name="landscape" label="Өргөн зураг:">                               
                            <ImageUpload onImageSelected={onLandscapeSelected} height="300px" width="600px" />                        
                        </Form.Item>
                    </Col>                                   
                </Row>                                                
                <Form.Item>
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <Popconfirm title="Нэмэх үү？" okText="Тийм" cancelText="Үгүй" onConfirm={form.submit}>
                            <Button type="primary" icon={<PlusOutlined />}>
                                Нэмэх
                            </Button>
                        </Popconfirm>
                    </div>                                        
                </Form.Item>                                       
            </Form>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        token: state.token
    }
}

export default connect(mapStateToProps)(SeriesAdd);