import React, { useEffect, useState } from 'react';
import { Typography, Form, Input, Row, Col, Select, Spin, Button, Popconfirm, message } from 'antd';
import { connect } from "react-redux";
import axios from 'axios';
import api from '../api';

const { Search } = Input;
const { Option } = Select;

function ArtistUpdateMovie (props) {
    const [form] = Form.useForm();
    const [occupations, setOccupations] = useState();    
    const [aLoading, setALoading] = useState(false);
    const [artists, setArtists] = useState();
    const [members, setMembers] = useState();
    const [artist, setArtist] = useState();
    const [member, setMember] = useState();    

    useEffect(() => {
        axios({
            method: 'GET',
            url: `${api.occupations}/`
        })
        .then(res => {                        
            setOccupations(res.data.results);                    
        })        
        .catch(err => {
            console.log(err.message);
        })  
    }, [])

    function onArtistSearch(value) {                
        setALoading(true)
        axios({
            method: 'GET',
            url: api.artists + "?name=" + value
        })
        .then(res => {                        
            setArtists(res.data.results);        
            setALoading(false)    
        })        
        .catch(err => {
            console.log(err.message);
        })      
    }

    function selectArtist (value) {                        
        const target = artists.find(x => x.id === parseInt(value))             
        setArtist(target)
        axios({
            method: 'GET',
            url: api.members + "?artist=" + target.id
        })
        .then(res => {                        
            setMembers(res.data.results);        
        })        
        .catch(err => {
            console.log(err.message);
        })      
    }

    function selectMember (value) {                        
        const target = members.find(x => x.id === parseInt(value))             
        setMember(target)
        console.log(target)
        let roles = []
        target.role.forEach(r => {
            roles.push(r.id.toString())
        })
        form.setFieldsValue({
            role: roles,
            role_name: target.role_name
        })
    }

    function onFinish (values) {        
        const data = {
            role: values.role ? values.role : undefined,
            role_name: values.role_name ? values.role_name : ""
        }
        axios({
            method: 'PUT',
            url: `${api.members}/${member.id}/`,
            data: data,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${props.token}`            
            }
        }).then(res => {                        
            if (res.status === 201 || res.status === 200) {                                            
                message.success("Амжилттай")        
            }             
        }).catch(err => {   
            message.error("Амжилтгүй боллоо."); 
            console.log(err);            
        }) 
    }

    function onDelete () {
        axios({
            method: 'DELETE',
            url: `${api.members}/${member.id}/`            
        }).then(res => {                        
            if (res.status === 204 || res.status === 200) {                                            
                message.success("Устгалаа")        
            }     
            form.resetFields()                  
        }).catch(err => {   
            message.error("Амжилтгүй боллоо."); 
            console.log(err);            
        })         
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
                    { aLoading ? (
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
            { artist ? (
                <>
                    <Typography.Text>Кино сонгох:</Typography.Text>   
                    <Select
                        showSearch                
                        style={{ width: '100%', margin: '8px 0' }}
                        placeholder="Кино сонгоно уу"                
                        onSelect={selectMember}
                        optionFilterProp="children"                            
                    >
                        { members ? (
                            <>
                                {members.map(item => {
                                    return (
                                        <Option key={item.id}>{item.movie.name}</Option>
                                    )
                                })}
                            </>
                        ) : (
                            <></>
                        )}
                    </Select>   
                    { member ? (
                        <Form layout="vertical" form={form} onFinish={onFinish}>
                            <Row gutter={16}>
                                <Col sm={24} md={12}>                                    
                                    <Form.Item name="role" label="Үүрэг">
                                        <Select
                                            showSearch               
                                            mode="multiple" 
                                            style={{ width: '100%' }}                                            
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
                                <Col sm={24} md={12}>
                                    <Form.Item name="role_name" label="Дүр">
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Popconfirm title="Хадгалах уу？" okText="Тийм" cancelText="Үгүй" onConfirm={form.submit}>
                                <Button type="primary" style={{ marginRight: '8px' }}>
                                    Хадгалах   
                                </Button>
                            </Popconfirm>  
                            <Popconfirm title="Устгах уу？" okText="Тийм" cancelText="Үгүй" onConfirm={onDelete}>
                                <Button danger type="primary" style={{ marginRight: '8px' }}>
                                    Устгах   
                                </Button>
                            </Popconfirm>                            
                        </Form>
                    ) : (
                        <></>
                    )}
                </>
            ) : 
                <></>
            }
        </div>
    )
}

const mapStateToProps = state => {
    return {
        token: state.token
    }
}

export default connect(mapStateToProps)(ArtistUpdateMovie);