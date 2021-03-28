import { MinusCircleOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Typography, Form, Row, Col, Input, InputNumber, Select, Button, Popconfirm, DatePicker, message } from 'antd';
import React, { useState, useEffect } from 'react';
import ImageUpload from '../components/ImageUpload';
import axios from 'axios';
import api from '../api';
import { connect } from "react-redux";
import moment from 'moment';

const { TextArea } = Input;
const { Option } = Select;

function MovieAdd (props) {
    const [form] = Form.useForm();    
    const [poster, setPoster] = useState();
    const [landscape, setLandscape] = useState();
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

    function onArtistSearch(value) {                
        axios({
            method: 'GET',                        
            url: api.artists + "?name=" + value
        })
        .then(res => {                        
            setArtists(res.data.results);            
        })        
        .catch(err => {
            console.log(err.message);
        })      
    }

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
        if (values.rating && values.rating !== null) {            
            data['rating'] = values.rating;
        }
        if (values.genre && values.genre !== null && values.genre.length > 0 && values.genre[0] !== "") {
            data['genre'] = values.genre;
        }
        if (values.crew && values.crew !== null && values.crew.length > 0 && values.crew[0] !== "") {
            data['crew'] = values.crew;
        }
        if (values.cast && values.cast !== null && values.cast.length > 0 && values.cast[0] !== "") {
            data['cast'] = values.cast;
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

    // function handleMember(arr) {
    //     arr.forEach(item => 

    //     )
    // }

    function onPosterSelected (path) {        
        setPoster(path);
    }

    function onLandscapeSelected (path) {        
        setLandscape(path);
    }

    return (
        <div>
            <Form layout="vertical" form={form} onFinish={onFinish} initialValues={{ 
                ["crew"]: [''],
                ["cast"]: ['']                      
                }}
            >
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
                <Row gutter={[16, 16]}>
                    <Col span={11} style={{ marginBottom: '8px' }}>
                        <Typography.Text>Баг бүрэлдэхүүн</Typography.Text>                                
                    </Col>
                    <Col span={11}>
                        <Typography.Text>Үүрэг</Typography.Text>
                    </Col>
                    <Col span={2}></Col>                    
                </Row>
                <Form.List name="crew">                                                        
                    {(fields, { add, remove }) => (
                    <>
                        {fields.map(field => (
                        <Row key={field.key} gutter={[8, 8]} style={{ width: '100%' }}>
                            <Col span={11}>
                                <Form.Item
                                {...field}
                                    name={[field.name, 'artist']}
                                    fieldKey={[field.fieldKey, 'artist']}                                                
                                >
                                    <Select 
                                        showSearch
                                        onSearch={onArtistSearch}                                
                                        placeholder="Уран бүтээлч"                                                
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
                            <Col span={11}>
                                <Form.Item
                                {...field}
                                    name={[field.name, 'role']}
                                    fieldKey={[field.fieldKey, 'role']}                                      
                                >
                                    <Select 
                                        showSearch                                                              
                                        placeholder="Үүрэг"                                                
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
                            <Col span={2}>
                                <Form.Item>
                                    <PlusCircleOutlined onClick={() => add()} style={{ marginRight: '8px', fontSize: '20px', color: '#888' }} />
                                    <MinusCircleOutlined onClick={() => remove(field.name)} style={{ fontSize: '20px', color: '#888' }} />
                                </Form.Item>  
                            </Col>
                        </Row>
                        ))}                                
                    </>
                    )}                                                                                                            
                </Form.List>
                <Row gutter={[16, 16]}>
                    <Col span={11} style={{ marginBottom: '8px' }}>
                        <Typography.Text>Жүжигчид</Typography.Text>                                
                    </Col>
                    <Col span={11}>
                        <Typography.Text>Дүр</Typography.Text>
                    </Col>
                    <Col span={2}></Col>                    
                </Row>
                <Form.List name="cast">                                                        
                    {(fields, { add, remove }) => (
                    <>
                        {fields.map(field => (
                        <Row key={field.key} gutter={[8, 8]} style={{ width: '100%' }}>
                            <Col span={11}>
                                <Form.Item
                                {...field}
                                    name={[field.name, 'artist']}
                                    fieldKey={[field.fieldKey, 'artist']}                                                 
                                >
                                    <Select 
                                        showSearch
                                        onSearch={onArtistSearch}                                
                                        placeholder="Уран бүтээлч"                                                
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
                            <Col span={11}>
                                <Form.Item
                                {...field}
                                    name={[field.name, 'role_name']}
                                    fieldKey={[field.fieldKey, 'role_name']}                                      
                                >
                                    <Input placeholder="Дүр" /> 
                                </Form.Item>   
                            </Col>
                            <Col span={2}>
                                <Form.Item>
                                    <PlusCircleOutlined onClick={() => add()} style={{ marginRight: '8px', fontSize: '20px', color: '#888' }} />
                                    <MinusCircleOutlined onClick={() => remove(field.name)} style={{ fontSize: '20px', color: '#888' }} />
                                </Form.Item>  
                            </Col>
                        </Row>
                        ))}                                
                    </>
                    )}                                                                                                            
                </Form.List>               
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

export default connect(mapStateToProps)(MovieAdd);