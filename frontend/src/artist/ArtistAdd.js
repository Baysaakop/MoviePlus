import React, { useState, useEffect } from 'react';
import { Typography, Form, Input, Row, Col, DatePicker, Select, Popconfirm, Button } from 'antd';
import ImageUpload from '../components/ImageUpload';
import axios from 'axios';
import api from '../api';
import { PlusOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

function ArtistAdd () {
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
        console.log(values)
        console.log(image)
    }

    return (
        <div>
            <Typography.Title level={4}>Шинээр уран бүтээлч нэмэх</Typography.Title>
            <Form layout="vertical" form={form} onFinish={onFinish}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={24} lg={8}>
                        <Form.Item name="name" label="Овог Нэр:" rules={[{ required: true, message: 'Та киноны нэрийг оруулна уу!' }]}>
                            <Input placeholder="Б.Билгүүн" />
                        </Form.Item> 
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={8}>
                        <Form.Item name="lastname" label="Овог:">
                            <Input placeholder="Бат-Эрдэнэ" />
                        </Form.Item>  
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={8}>
                        <Form.Item name="firstname" label="Нэр:">
                            <Input placeholder="Билгүүн" />
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
                        <Popconfirm title="Тус уран бүтээлчийг бүртгэх үү？" okText="Тийм" cancelText="Үгүй" onConfirm={form.submit}>
                            <Button block type="primary" icon={<PlusOutlined />}>
                                Хадгалах
                            </Button>
                        </Popconfirm>
                    </div>                                        
                </Form.Item>                                 
            </Form>
        </div>
    )
}

export default ArtistAdd;