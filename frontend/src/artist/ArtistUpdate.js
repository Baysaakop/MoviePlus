import React, { useState, useEffect } from 'react';
import { Typography, Form, Input, Row, Col, DatePicker, Select, Popconfirm, Button, message, Spin } from 'antd';
import ImageUpload from '../components/ImageUpload';
import axios from 'axios';
import api from '../api';
import { DeleteOutlined, ToolOutlined } from '@ant-design/icons';
import { connect } from "react-redux";
import moment from 'moment';
import Filmography from './Filmography';

const { TextArea, Search } = Input;
const { Option } = Select;

function ArtistUpdate (props) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState();
    const [artists, setArtists] = useState();
    const [image, setImage] = useState(); 
    const [occupations, setOccupations] = useState(); 
    const [selection, setSelection] = useState(); 

    useEffect(() => {
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
        setLoading(true)
        axios({
            method: 'GET',
            url: api.artists + "?name=" + value
        })
        .then(res => {                        
            setArtists(res.data.results);        
            setLoading(false)    
        })        
        .catch(err => {
            console.log(err.message);
        })      
    }

    function selectArtist (value) {                        
        const target = artists.find(x => x.id === parseInt(value))             
        console.log(target)           
        form.setFieldsValue({
            name: target.name !== null ? target.name : "",
            lastname: target.lastname !== null ? target.lastname : "",
            firstname: target.firstname !== null ? target.firstname : "",
            biography: target.biography !== null ? target.biography : "",
            occupation: target.occupation  !== null && target.occupation.length > 0 ? getIDsFromArray(target.occupation) : undefined,                                               
            birthday: target.birthday !== null ? moment(target.birthday) : undefined,
            gender: target.gender !== null ? target.gender : undefined                                                              
        })     
        setImage(target.avatar)        
        setSelection(target)
    }

    function getIDsFromArray (array) {
        let result = []
        array.forEach(item => {
            result.push(item.id.toString())
        });        
        return result
    }

    function compareM2M (ids, objects) {
        if (ids.length !== objects.length) {
            return false;
        }
        let i;
        for (i = 0; i < ids.length; i++) {
            if (parseInt(ids[i]) !== parseInt(objects[i].id)) {
                return false;
            }
        }
        return true;
    }

    function onImageSelected (path) {        
        setImage(path);
    }

    function onFinish(values) {        
        if (selection) {
            var formData = new FormData();
            if (values.name && values.name !== selection.lastname) {
                formData.append('name', values.name);
            }
            if (values.lastname && values.lastname !== selection.lastname) {
                formData.append('lastname', values.lastname);
            }
            if (values.firstname && values.firstname !== selection.firstname) {
                formData.append('firstname', values.firstname);
            }
            if (values.birthday && moment(values.birthday).format("YYYY-MM-DD") !== selection.birthday) {
                formData.append('birthday', moment(values.birthday).format("YYYY-MM-DD"));
            }
            if (values.gender && values.gender !== selection.gender) {
                formData.append('gender', values.gender);
            }
            if (values.biography && values.biography !== selection.biography) {
                formData.append('biography', values.biography);
            }
            if (values.occupation && !compareM2M(values.occupation, selection.occupation)) {                                
                formData.append('occupation', values.occupation);
            }
            if (image && image !== selection.avatar) {
                formData.append('avatar', image);
            }
            formData.append('token', props.token);
            axios({
                method: 'PUT',
                url: `${api.artists}/${selection.id}/`,
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Token ${props.token}`            
                }
            }).then(res => {                        
                if (res.status === 201 || res.status === 200) {                
                    message.info("Засварлалаа.");
                }             
            }).catch(err => {   
                message.error("Амжилтгүй боллоо."); 
                console.log(err);            
            })
        } else {
            message.warning("Та эхлээд засварлах уран бүтээлчээ сонгоно уу!")
        }              
    }

    function onDelete() {
        if (selection) {
            axios({
                method: 'DELETE',
                url: `${api.artists}/${selection.id}/`                
            })            
            .then(res => {                
                if (res.status === 200 || res.status === 204) {
                    message.info("Устгалаа.")   
                }                        
                form.resetFields()             
            })
            .catch(err => {                            
                message.error("Амжилтгүй боллоо.")
            }) 
        } else {
            message.warning("Та эхлээд засварлах уран бүтээлчээ сонгоно уу!")
        }   
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
                    { loading ? (
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
            { selection ? (
                <Form layout="vertical" form={form} onFinish={onFinish}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={24} lg={8}>
                            <Form.Item name="name" label="Овог Нэр:" rules={[{ required: true, message: 'Та киноны нэрийг оруулна уу!' }]}>
                                <Input />
                            </Form.Item> 
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={8}>
                            <Form.Item name="lastname" label="Овог:">
                                <Input />
                            </Form.Item>  
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={8}>
                            <Form.Item name="firstname" label="Нэр:">
                                <Input />
                            </Form.Item>  
                        </Col>
                    </Row> 
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={24} lg={8}>
                            <Form.Item name="birthday" label="Төрсөн өдөр:">
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={8}>
                            <Form.Item name="gender" label="Хүйс:">
                                <Select
                                    showSearch                                
                                    placeholder="Хүйс сонгох"                                                
                                    optionFilterProp="children"                                
                                >
                                    <Option key="m">Эр</Option>
                                    <Option key="f">Эм</Option>
                                </Select> 
                            </Form.Item>  
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={8}>
                            <Form.Item name="occupation" label="Мэргэжил:">
                                <Select                                
                                    showSearch                                
                                    mode="multiple"
                                    placeholder="Мэргэжил сонгох"                                                
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
                    </Row>             
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={24} lg={8}>
                            <Form.Item name="avatar" label="Зураг:">                               
                                <ImageUpload image={image} onImageSelected={onImageSelected} height="150px" width="150px" />                        
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={16}>
                            <Form.Item name="biography" label="Намтар:">
                                <TextArea rows={8} />
                            </Form.Item> 
                        </Col>
                    </Row>   
                    <Form.Item label="Уран бүтээлүүд">
                        <Filmography id={selection.id} />
                    </Form.Item>                    
                    <Form.Item>
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <Popconfirm title="Засах уу？" okText="Тийм" cancelText="Үгүй" onConfirm={form.submit}>
                                <Button type="primary" icon={<ToolOutlined />} style={{ marginRight: '8px' }}>
                                    Засах   
                                </Button>
                            </Popconfirm>
                            <Popconfirm title="Устгах уу？" okText="Тийм" cancelText="Үгүй" onConfirm={onDelete}>
                                <Button danger type="primary" icon={<DeleteOutlined />}>
                                    Устгах
                                </Button>
                            </Popconfirm>
                        </div>                                        
                    </Form.Item>                                 
                </Form>
            ) : (
                <></>
            )}            
        </div>
    )
}

const mapStateToProps = state => {
    return {
        token: state.token
    }
}

export default connect(mapStateToProps)(ArtistUpdate);