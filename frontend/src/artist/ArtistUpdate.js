import React, { useState, useEffect } from 'react';
import { Grid, Breadcrumb, Spin, Result, Typography, Form, Input, Row, Col, DatePicker, Select, Popconfirm, Button, message } from 'antd';
import ImageUpload from '../components/ImageUpload';
import axios from 'axios';
import api from '../api';
import { LoadingOutlined, ToolOutlined } from '@ant-design/icons';
import { connect } from "react-redux";
import moment from 'moment';
import { Link } from 'react-router-dom';

const { useBreakpoint } = Grid;
const { TextArea } = Input;
const { Option } = Select;
const loadingIcon  = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function ArtistUpdate (props) {
    const screens = useBreakpoint()
    const [form] = Form.useForm()
    const [loading, setLoading] = useState()
    const [artist, setArtist] = useState()
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
        getArtist()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function getArtist() {        
        setLoading(true)
        const id = props.match.params.artistID;
        const url = api.artists + "/" + id + "/";  
        axios({
            method: 'GET',
            url: url,
            headers: {
                'Content-Type': 'application/json'                
            }
        })
        .then(res => {
            let target = res.data  
            setArtist(target)
            setLoading(false)
        })
        .catch(err => {
            message.error("Алдаа гарлаа. Та хуудсаа дахин ачааллуулна уу.")
        })
    }

    function onImageSelected (path) {        
        setImage(path);
    }

    function onFinish(values) {        
        setLoading(true)
        let count = 0
        var formData = new FormData();
        if (values.name) {
            formData.append('name', values.name)
            count++
        }
        if (values.lastname && values.lastname !== null) {
            formData.append('lastname', values.lastname)
            count++
        }
        if (values.firstname && values.firstname !== null) {
            formData.append('firstname', values.firstname)
            count++
        }
        if (values.birthday && values.birthday !== null) {
            formData.append('birthday', moment(values.birthday).format("YYYY-MM-DD"))
            count++
        }
        if (values.gender && values.gender !== null) {
            formData.append('gender', values.gender)
            count++
        }
        if (values.biography && values.biography !== null) {
            formData.append('biography', values.biography)
            count++
        }
        if (values.occupation && values.occupation !== null) {
            formData.append('occupation', values.occupation)
            count++
        }
        if (image && image !== null) {
            formData.append('avatar', image)
            count++
        }
        if (count > 0) {
            formData.append('token', props.token)
            formData.append('artistid', artist.id)
            for (var pair of formData.entries()) {
                console.log(pair[0]+ ', '+ pair[1])
            }
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
        } else {
            message.warning("Дор хаяж нэг талбарыг өөрчлөх хэрэгтэй.")
        }                  
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

    function getIDsFromArray (array) {
        let result = []
        array.forEach(item => {
            result.push(item.id.toString())
        });        
        return result
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
                        Уран бүтээлч засах
                    </Breadcrumb.Item>
                </Breadcrumb>
            </div>
            { props.token ? (
                <div style={{ padding: getPadding() }}>
                    { loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                            <Spin indicator={loadingIcon} tip="Уншиж байна..." />
                        </div>
                    ) : artist ? (
                        <>
                            <Typography.Title level={3}>Уран бүтээлч засах</Typography.Title>
                            <Form layout="vertical" form={form} onFinish={onFinish}>
                                <Row gutter={[16, 16]}>
                                    <Col xs={24} sm={8} md={8} lg={8} xl={6}>
                                        <Form.Item name="avatar" label="Зураг:">                               
                                            <ImageUpload image={artist.avatar} onImageSelected={onImageSelected} height="300px" width="200px" />                        
                                        </Form.Item>
                                        <Form.Item name="birthday" label="Төрсөн өдөр:">
                                            <DatePicker style={{ width: '100%' }} defaultValue={artist.birthday ? moment(artist.birthday) : undefined}/>
                                        </Form.Item>
                                        <Form.Item name="gender" label="Хүйс:">
                                            <Select
                                                defaultValue={artist.gender ? artist.gender : undefined}
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
                                        <Form.Item name="name" label="Овог Нэр:">
                                            <Input placeholder="А.Бат-Эрдэнэ" defaultValue={artist.name ? artist.name : ""} />
                                        </Form.Item> 
                                        <Row gutter={[16, 16]}>
                                            <Col xs={24} sm={24} md={24} lg={12}>
                                                <Form.Item name="lastname" label="Овог:">
                                                    <Input placeholder="Анх-Эрдэнэ" defaultValue={artist.lastname ? artist.lastname : ""} />
                                                </Form.Item>  
                                            </Col>
                                            <Col xs={24} sm={24} md={24} lg={12}>
                                                <Form.Item name="firstname" label="Нэр:">
                                                    <Input placeholder="Бат-Эрдэнэ" defaultValue={artist.firstname ? artist.firstname : ""} />
                                                </Form.Item>  
                                            </Col>                                            
                                        </Row>
                                        <Form.Item name="occupation" label="Мэргэжил:">
                                            <Select
                                                defaultValue={artist.occupation ? getIDsFromArray(artist.occupation) : undefined}
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
                                            <TextArea rows={10} defaultValue={artist.biography ? artist.biography : ""} />
                                        </Form.Item> 
                                    </Col>
                                </Row>             
                                <Form.Item>
                                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                        <Popconfirm title="Засах уу？" okText="Тийм" cancelText="Үгүй" onConfirm={form.submit}>
                                            <Button type="primary" icon={<ToolOutlined />} style={{ marginRight: '8px' }}>
                                                Засах   
                                            </Button>
                                        </Popconfirm>
                                    </div>                                      
                                </Form.Item>                                 
                            </Form>
                        </>
                    ) : <></>}
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

export default connect(mapStateToProps)(ArtistUpdate);