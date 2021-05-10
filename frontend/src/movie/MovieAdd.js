import { PlusCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { Breadcrumb, Grid, Form, Row, Col, Input, InputNumber, Select, Button, Popconfirm, DatePicker, message, Radio, Typography, Result, Spin } from 'antd';
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
const loadingIcon  = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function MovieAdd (props) {
    const screens = useBreakpoint()
    const [form] = Form.useForm()   
    const [loading, setLoading] = useState()
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
        setLoading(true)       
        var formData = new FormData();
        formData.append('name', values.name)
        if (values.description) {
            formData.append('description', values.description)
        }
        if (values.plot) {
            formData.append('plot', values.plot)
        }
        if (values.trailer) {
            formData.append('trailer', values.trailer)
        }
        if (values.duration) {
            formData.append('duration', values.duration)
        }
        if (values.releasedate) {
            formData.append('releasedate', moment(values.releasedate).format("YYYY-MM-DD"))
        }         
        if (values.is_released) {
            formData.append('is_released', values.is_released)
        }
        if (values.is_playing) {
            formData.append('is_playing', values.is_playing)
        }  
        if (values.rating) {
            formData.append('rating', values.rating)
        }  
        if (values.genre) {
            formData.append('genre', values.genre)
        } 
        if (poster) {
            formData.append('poster', poster)
        } 
        if (landscape) {
            formData.append('landscape', landscape)
        }       
        formData.append('token', props.token)         
        axios({
            method: 'POST',
            url: `${api.tempfilms}/`,
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Token ${props.token}`            
            }
        }).then(res => {                        
            if (res.status === 201) {      
                console.log(res)
                message.info("Хүсэлтийг хүлээж авлаа.")
                form.resetFields()
                setLoading(false)                                               
            }             
        }).catch(err => {   
            message.error("Амжилтгүй боллоо.")
            console.log(err)            
            setLoading(false)          
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
            return window.screen.availWidth * 0.69
        } else if (screens.xl) {
            return window.screen.availWidth * 0.79
        } else if (screens.lg) {
            return window.screen.availWidth * 0.83
        } else if (screens.md) {
            return window.screen.availWidth * 0.89
        } else if (screens.sm) {
            return window.screen.availWidth * 0.89
        } else if (screens.xs) {
            return window.screen.availWidth * 0.89
        }
    }

    function getHeight() {
        if (screens.xxl) {
            return window.screen.availWidth * 0.2
        } else if (screens.xl) {
            return window.screen.availWidth * 0.25
        } else if (screens.lg) {
            return window.screen.availWidth * 0.3
        } else if (screens.md) {
            return window.screen.availWidth * 0.4
        } else if (screens.sm) {
            return window.screen.availWidth * 0.4
        } else if (screens.xs) {
            return window.screen.availWidth * 0.4
        }
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
            { props.token ? (
            <div style={{ padding: getPadding() }}>
                { loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                        <Spin indicator={loadingIcon} tip="Уншиж байна..." />
                    </div>
                ) : (
                    <>
                        <Typography.Title level={3}>Кино нэмэх</Typography.Title>
                        <Form layout="vertical" form={form} onFinish={onFinish}>
                            <Form.Item name="landscape" label="Өргөн зураг:">
                                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>           
                                    <div>
                                        <ImageUpload onImageSelected={onLandscapeSelected} height={getHeight()} width={getWidth()} />                        
                                    </div>                 
                                </div>                               
                            </Form.Item>
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={8} md={8} lg={8} xl={6}>
                                    <Form.Item name="poster" label="Постер:">                               
                                        <ImageUpload onImageSelected={onPosterSelected} height="300px" width="200px" />                        
                                    </Form.Item>
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
                                            <Form.Item name="is_playing" label="Одоо гарч буй:">                               
                                                <Radio.Group defaultValue={false}>
                                                    <Radio value={true}>Тийм</Radio>
                                                    <Radio value={false}>Үгүй</Radio>
                                                </Radio.Group>          
                                            </Form.Item>
                                        </Col>                                   
                                    </Row>
                                </Col>
                                <Col xs={24} sm={16} md={16} lg={16} xl={18}>
                                    <Form.Item name="name" label="Нэр:" rules={[{ required: true, message: 'Та киноны нэрийг оруулна уу!' }]}>
                                        <Input />
                                    </Form.Item>
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
                                    <Row gutter={[16, 16]}>
                                        <Col xs={24} sm={24} md={8}>
                                            <Form.Item name="releasedate" label="Нээлт:">
                                                <DatePicker style={{ width: '100%' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={24} md={8}>
                                            <Form.Item name="duration" label="Хугацаа:">
                                                <InputNumber defaultValue={90} min={0} style={{ width: '100%' }} />
                                            </Form.Item>
                                        </Col>                                
                                        <Col xs={24} sm={24} md={8}>
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
                                    </Row>
                                    <Row gutter={[16, 16]}>
                                        <Col xs={24} sm={24} md={12}>
                                            <Form.Item name="description" label="Дэлгэрэнгүй:">
                                                <TextArea rows={10} />
                                            </Form.Item>  
                                        </Col>
                                        <Col xs={24} sm={24} md={12}>
                                            <Form.Item name="plot" label="Агуулга:">
                                                <TextArea rows={10} />
                                            </Form.Item>  
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>                                                                                                                                                 
                            <Form.Item>
                                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                    <Popconfirm title="Нэмэх үү？" okText="Тийм" cancelText="Үгүй" onConfirm={form.submit}>
                                        <Button size="large" type="primary" icon={<PlusCircleOutlined />}>
                                            Нэмэх
                                        </Button>
                                    </Popconfirm>
                                </div>                                        
                            </Form.Item>                                       
                        </Form>
                    </>
                )}                
            </div>
            ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    <Result
                        status="403"
                        title="403"
                        subTitle="Уучлаарай, та эхлээд системд нэвтэрнэ үү."
                        extra={<Button type="primary" href="/login">Нэвтрэх цонх руу шилжих</Button>}
                    />
                </div>
            )}
        </div>
    )
}

const mapStateToProps = state => {
    return {
        token: state.token
    }
}

export default connect(mapStateToProps)(MovieAdd);