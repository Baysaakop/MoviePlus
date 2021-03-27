import React, { useState, useEffect } from 'react';
import { Form, Input, Row, Col, DatePicker, Select, Popconfirm, Button, message } from 'antd';
import ImageUpload from '../components/ImageUpload';
import axios from 'axios';
import api from '../api';
import { PlusOutlined } from '@ant-design/icons';
import { connect } from "react-redux";
import moment from 'moment';

const { TextArea } = Input;
const { Option } = Select;

function ArtistAdd (props) {
    const [form] = Form.useForm();
    const [image, setImage] = useState(); 
    const [occupations, setOccupations] = useState(); 

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

    function onImageSelected (path) {        
        setImage(path);
    }

    function onFinish(values) {
        // console.log(values)
        // console.log(image)
        var formData = new FormData();
        formData.append('name', values.name);      
        if (values.lastname && values.lastname !== null) {
            formData.append('lastname', values.lastname);
        }
        if (values.firstname && values.firstname !== null) {
            formData.append('firstname', values.firstname);
        }
        if (values.birthday && values.birthday !== null) {
            formData.append('birthday', moment(values.birthday).format("YYYY-MM-DD"));
        }
        if (values.gender && values.gender !== null) {
            formData.append('gender', values.gender);
        }
        if (values.biography && values.biography !== null) {
            formData.append('biography', values.biography);
        }
        if (values.occupation && values.occupation !== null) {
            formData.append('occupation', values.occupation);
        }
        if (image && image !== null) {
            formData.append('avatar', image);
        }
        formData.append('token', props.token);
        axios({
            method: 'POST',
            url: `${api.artists}/`,
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

    return (
        <div>
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
                            <ImageUpload onImageSelected={onImageSelected} height="150px" width="150px" />                        
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={16}>
                        <Form.Item name="biography" label="Намтар:">
                            <TextArea rows={8} />
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

export default connect(mapStateToProps)(ArtistAdd);