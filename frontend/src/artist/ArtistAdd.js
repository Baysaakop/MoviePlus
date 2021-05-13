import React, { useState, useEffect } from 'react';
import { Grid, Breadcrumb, Spin, Result, Typography, Form, Input, Row, Col, DatePicker, Select, Popconfirm, Button, message } from 'antd';
import ImageUpload from '../components/ImageUpload';
import axios from 'axios';
import api from '../api';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { connect } from "react-redux";
import moment from 'moment';
import { Link } from 'react-router-dom';

const { useBreakpoint } = Grid;
const { TextArea } = Input;
const { Option } = Select;
const loadingIcon  = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function ArtistAdd (props) {
    const screens = useBreakpoint()
    const [form] = Form.useForm()
    const [loading, setLoading] = useState()
    const [image, setImage] = useState()
    const [occupations, setOccupations] = useState()

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
        setLoading(true)
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
        for (var pair of formData.entries()) {
            console.log(pair[0]+ ', '+ pair[1]);
        }
        console.log(api.tempartists)
        axios({
            method: 'POST',
            url: `${api.tempartists}/`,
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Token ${props.token}`            
            }
        }).then(res => {                        
            if (res.status === 201 || res.status === 200) {                
                message.info("Хүсэлтийг хүлээж авлаа.")
                form.resetFields()
                setImage(undefined)
                setLoading(false)
            }             
        }).catch(err => {   
            message.error("Амжилтгүй боллоо.")
            console.log(err)
            setLoading(false)
        })
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

    return (
        <div style={{ marginTop: '80px', minHeight: '80vh' }}>
            <div style={{ padding: getPadding() }}>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/">Нүүр</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to="/artists">Уран бүтээлч</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Уран бүтээлч нэмэх
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
                            <Typography.Title level={3}>Уран бүтээлч нэмэх</Typography.Title>
                            <Form layout="vertical" form={form} onFinish={onFinish}>
                                <Row gutter={[16, 16]}>
                                    <Col xs={24} sm={8} md={8} lg={8} xl={6}>
                                        <Form.Item name="avatar" label="Зураг:">                               
                                            <ImageUpload onImageSelected={onImageSelected} height="300px" width="200px" />                        
                                        </Form.Item>
                                        <Form.Item name="birthday" label="Төрсөн өдөр:">
                                            <DatePicker style={{ width: '100%' }} />
                                        </Form.Item>
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
                                    <Col xs={24} sm={24} md={24} lg={16} xl={18}>
                                        <Form.Item name="name" label="Овог Нэр:" rules={[{ required: true, message: 'Та киноны нэрийг оруулна уу!' }]}>
                                            <Input placeholder="А.Бат-Эрдэнэ" />
                                        </Form.Item> 
                                        <Row gutter={[16, 16]}>
                                            <Col xs={24} sm={24} md={24} lg={12}>
                                                <Form.Item name="lastname" label="Овог:">
                                                    <Input placeholder="Анх-Эрдэнэ" />
                                                </Form.Item>  
                                            </Col>
                                            <Col xs={24} sm={24} md={24} lg={12}>
                                                <Form.Item name="firstname" label="Нэр:">
                                                    <Input placeholder="Бат-Эрдэнэ" />
                                                </Form.Item>  
                                            </Col>                                            
                                        </Row>
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
                                        <Form.Item name="biography" label="Намтар:">
                                            <TextArea rows={10} />
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

export default connect(mapStateToProps)(ArtistAdd);