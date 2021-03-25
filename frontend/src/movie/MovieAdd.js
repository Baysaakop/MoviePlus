import { PlusOutlined } from '@ant-design/icons';
import { Typography, Form, Row, Col, Input, InputNumber, Select, Button, Popconfirm, DatePicker } from 'antd';
import React, { useState, useEffect } from 'react';
import ImageUpload from '../components/ImageUpload';
import axios from 'axios';
import api from '../api';

const { TextArea } = Input;
const { Option } = Select;

function MovieAdd () {
    const [form] = Form.useForm();    
    const [image, setImage] = useState();
    const [ratings, setRatings] = useState(); 
    const [genres, setGenres] = useState(); 
    const [occupations, setOccupations] = useState(); 
    const [artists, setArtists] = useState(); 

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
        axios({
            method: 'GET',                        
            url: api.occupations
        })
        .then(res => {                        
            setOccupations(res.data.results);            
        })        
        .catch(err => {
            console.log(err.message);
        }) 
    }, [])

    function onActorSearch(value) {                
        axios({
            method: 'GET',                        
            url: api.artists + "?search=" + value
        })
        .then(res => {                        
            setArtists(res.data.results);            
        })        
        .catch(err => {
            console.log(err.message);
        })      
    }

    function onFinish (values) {   
        var formData = new FormData();                  
        // formData.append('name', values.name);      
        // if (values.code && values.code !== null) {
        //     formData.append('code', values.code);
        // }
        // if (values.description && values.description !== null) {
        //     formData.append('description', values.description);
        // }
        // if (values.category && values.category !== null) {
        //     formData.append('category', values.category);
        // }
        // if (values.author && values.author !== null) {
        //     formData.append('author', values.author);
        // }
        // if (values.published_at && values.published_at !== null) {
        //     formData.append('published_at', values.published_at);
        // } 
        // if (values.pages && values.pages !== null) {
        //     formData.append('pages', values.pages);
        // }        
        // if (values.count && values.count !== null) {
        //     formData.append('count', values.count);            
        // }
        // if (values.available && values.available !== null) {            
        //     formData.append('available', values.available);
        // }
        // if (image && image !== null) {
        //     formData.append('image', image);
        // }            
        // formData.append('token', props.token);                              
        // axios({
        //     method: 'POST',
        //     url: `${api.books}/`,
        //     data: formData,
        //     headers: {'Content-Type': 'multipart/form-data'}            
        // })                   
        // .then(res => {
        //     if (res.status === 200 || res.status === 201) {
        //         message.info("Амжилттай бүртгэгдлээ.")   
        //     }                        
        //     form.resetFields()             
        // })
        // .catch(err => {                            
        //     message.error("Бүртгэл амжилтгүй боллоо. Та дахин оролдоно уу.")
        // })         
    }

    function onImageSelected (path) {        
        setImage(path);
    }

    return (
        <div>
            <Typography.Title level={4}>Шинээр кино нэмэх</Typography.Title>
            <Form layout="vertical" form={form} onFinish={onFinish}>
                <Form.Item name="name" label="Нэр:" rules={[{ required: true, message: 'Та киноны нэрийг оруулна уу!' }]}>
                    <Input placeholder="Harry Potter..." />
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
                                mode="multiple"
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
                <Row gutter={16}>       
                    <Col xs={24} sm={12} md={12} lg={8}>                        
                        <Form.Item name="poster" label="Постер:">                               
                            <ImageUpload onImageSelected={onImageSelected} height="300px" width="200px" />                        
                        </Form.Item>
                    </Col>             
                    <Col xs={24} sm={12} md={12} lg={16}>                        
                        <Form.Item name="landscape" label="Өргөн зураг:">                               
                            <ImageUpload onImageSelected={onImageSelected} height="300px" width="600px" />                        
                        </Form.Item>
                    </Col>                                   
                </Row>
                <Row gutter={16}>       
                    <Col xs={24} sm={12} md={6}>                        
                        <Form.Item name="crew" label="Баг бүрэлдэхүүн:">   
                            <Select
                                showSearch
                                onSearch={onActorSearch}                                
                                placeholder="Уран бүтээлч сонгоно уу"                                                
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
                        </Form.Item>
                    </Col>                              
                    <Col xs={24} sm={12} md={6}>                        
                        <Form.Item name="role" label="Үүрэг:">   
                            <Select
                                showSearch
                                mode="multiple"                                                       
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
                    <Col xs={24} sm={12} md={6}>                        
                        <Form.Item name="cast" label="Жүжигчин:">   
                            <Select
                                showSearch
                                onSearch={onActorSearch}                                
                                placeholder="Жүжигчин сонгоно уу"                                                
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
                        </Form.Item>
                    </Col>                              
                    <Col xs={24} sm={12} md={6}>                        
                        <Form.Item name="role_name" label="Дүр:">   
                            <Input placeholder="Peter Parker" />                                                                                 
                        </Form.Item>
                    </Col>                                   
                </Row>
                <Form.Item>
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <Popconfirm title="Тус номыг бүртгэх үү？" okText="Тийм" cancelText="Үгүй" onConfirm={form.submit}>
                            <Button block type="primary" icon={<PlusOutlined />}>
                                Бүртгэх
                            </Button>
                        </Popconfirm>
                        {/* <Button type="ghost" icon={<ReloadOutlined />} onClick={onReset} style={{ marginRight: '8px' }}>
                            Хоослох
                        </Button>                                 */}
                    </div>                                        
                </Form.Item>                                
            </Form>
        </div>
    )
}

export default MovieAdd;