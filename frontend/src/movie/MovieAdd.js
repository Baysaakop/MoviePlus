import { PlusOutlined } from '@ant-design/icons';
import { Breadcrumb, Grid, Form, Row, Col, Input, InputNumber, Select, Button, Popconfirm, DatePicker, message, Radio, Typography } from 'antd';
import React, { useState, useEffect } from 'react';
import ImageUpload from '../components/ImageUpload';
import axios from 'axios';
import api from '../api';
import { connect } from "react-redux";
import moment from 'moment';
import { Link } from 'react-router-dom';

const { useBreakpoint } = Grid;
const { TextArea } = Input;
const { Option } = Select;

function MovieAdd (props) {
    const screens = useBreakpoint()
    const [form] = Form.useForm()   
    const [poster, setPoster] = useState()
    const [landscape, setLandscape] = useState()
    const [ratings, setRatings] = useState()
    const [genres, setGenres] = useState()

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
            description: values.description ? values.description : "",
            plot: values.plot ? values.plot : "",
            duration: values.duration ? values.duration : 90,
            releasedate: values.releasedate ? moment(values.releasedate).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD"),
            is_released: values.is_released ? values.is_released : true,
            in_theater: values.in_theater ? values.in_theater : false,
            trailer: values.trailer ? values.trailer : "",            
            token: props.token
        }
        if (values.rating && values.rating !== null) {            
            data['rating'] = values.rating;
        }
        if (values.genre && values.genre !== null && values.genre.length > 0 && values.genre[0] !== "") {
            data['genre'] = values.genre;
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
            url: `${api.movies}/`,
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
                    url: `${api.movies}/${res.data.id}/`,
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

    function getPadding() {
        if (screens.xxl) {
            return '16px 15%'
        } else if (screens.xl) {
            return '16px 10%'
        } else if (screens.lg) {
            return '16px 8%'
        } else if (screens.md) {
            return '16px 5%'
        } else if (screens.sm) {
            return '16px 5%'
        } else if (screens.xs) {
            return '16px 5%'
        }
    }

    function getWidth() {
        if (screens.xxl) {
            return window.screen.availWidth * 0.6
        } else if (screens.xl) {
            return window.screen.availWidth * 0.7
        } else if (screens.lg) {
            return window.screen.availWidth * 0.8
        } else if (screens.md) {
            return window.screen.availWidth * 0.85
        } else if (screens.sm) {
            return window.screen.availWidth * 0.85
        } else if (screens.xs) {
            return window.screen.availWidth * 0.9
        }
    }

    function getHeight() {

    }

    return (
        <div style={{ marginTop: '80px', minHeight: '80vh' }}>
            <div style={{ padding: getPadding() }}>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/">Нүүр</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to="/movies">Кино</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Кино нэмэх
                    </Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div style={{ padding: getPadding() }}>
                <Typography.Title level={3}>Кино нэмэх</Typography.Title>
                <Form layout="vertical" form={form} onFinish={onFinish}>
                    <Form.Item name="landscape" label="Өргөн зураг:">
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>           
                            <div>
                                <ImageUpload onImageSelected={onLandscapeSelected} height="300px" width={getWidth()} />                        
                            </div>                 
                        </div>                               
                    </Form.Item>
                    <Form.Item name="name" label="Нэр:" rules={[{ required: true, message: 'Та киноны нэрийг оруулна уу!' }]}>
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
                                <InputNumber defaultValue={90} min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col xs={12} sm={8} md={6}>
                            <Form.Item name="releasedate" label="Нээлт:">
                                <DatePicker  style={{ width: '100%' }} />
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
                            <Form.Item name="is_released" label="Нээлтээ хийсэн:">                               
                                <Radio.Group defaultValue={true}>
                                    <Radio value={true}>Тийм</Radio>
                                    <Radio value={false}>Үгүй</Radio>
                                </Radio.Group> 
                            </Form.Item>
                        </Col>             
                        <Col xs={24} sm={12}>                        
                            <Form.Item name="in_theater" label="Одоо гарч буй:">                               
                                <Radio.Group defaultValue={false}>
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
                        {/* <Col xs={24} sm={12} md={12} lg={16}>                        
                            <Form.Item name="landscape" label="Өргөн зураг:">                               
                                <ImageUpload onImageSelected={onLandscapeSelected} height="300px" width="600px" />                        
                            </Form.Item>
                        </Col>                                    */}
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
        </div>
    )
}

const mapStateToProps = state => {
    return {
        token: state.token
    }
}

export default connect(mapStateToProps)(MovieAdd);